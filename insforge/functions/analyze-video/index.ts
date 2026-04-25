import { createClient } from 'npm:@insforge/sdk'

const EXTERNAL_API_URL = 'https://analysis-agent-production.up.railway.app/analyze'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default async function (req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const authHeader = req.headers.get('Authorization')
  const userToken = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null

  const client = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    edgeFunctionToken: userToken ?? undefined,
    anonKey: Deno.env.get('ANON_KEY'),
  })

  // Auth is optional. Anon callers get the analysis text but no persisted session.
  let userId: string | null = null
  if (userToken) {
    const { data: userData } = await client.auth.getCurrentUser()
    if (userData?.user?.id) userId = userData.user.id
  }

  const body = await req.json().catch(() => null)
  const videoUrl: string | undefined = body?.video_url
  if (!videoUrl) {
    return json({ error: 'Missing video_url' }, 400)
  }

  const resp = await fetch(EXTERNAL_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ user_id: userId, video_url: videoUrl }),
  })
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '')
    console.error('[analyze-video] external API error', resp.status, detail)
    return json({ error: `Analysis API returned ${resp.status}` }, 502)
  }
  const payload = await resp.json().catch(() => null)
  const analysisText = typeof payload?.text === 'string' ? payload.text.trim() : ''
  if (!analysisText) {
    return json({ error: 'Analysis API returned empty text' }, 502)
  }

  // Persist only for signed-in callers.
  if (!userId) {
    return json({ session_id: null, text: analysisText })
  }

  const { data: session, error: insertError } = await client.database
    .from('sessions')
    .insert([{ user_id: userId, video_url: videoUrl, analysis_text: analysisText }])
    .select()
    .single()

  if (insertError || !session) {
    console.warn('[analyze-video] DB insert failed:', insertError)
    return json({ session_id: null, text: analysisText })
  }

  return json({ session_id: session.id, text: analysisText })
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
