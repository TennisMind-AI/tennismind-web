import { createClient } from 'npm:@insforge/sdk'

// TODO: swap for the real analysis endpoint. Until it's live, the call will
// fail and we fall back to a mock response so the UX can be tested end-to-end.
const EXTERNAL_API_URL = 'https://placeholder.ai/analyze'

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

  let analysisText: string
  try {
    const resp = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ user_id: userId, video_url: videoUrl }),
    })
    if (!resp.ok) throw new Error(`Analysis API returned ${resp.status}`)
    const payload = await resp.json()
    const text = typeof payload?.text === 'string' ? payload.text.trim() : ''
    if (!text) throw new Error('Empty analysis text')
    analysisText = text
  } catch (err) {
    console.warn('[analyze-video] external API failed, using mock:', err)
    analysisText = mockAnalysis(videoUrl)
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
    // Don't drop the analysis because the DB write failed; return what we have.
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

function mockAnalysis(videoUrl: string): string {
  return `Analysis of ${videoUrl}

Forehand — your take-back is starting about 0.18s after your split step. Try to begin the unit turn before your opponent's racquet strikes the ball; you'll pick up roughly 8 mph of head speed.

Contact point — you're striking about 6 inches behind your lead hip. Step into the ball and drive the contact forward. The over-shoulder finish on your better swings is clean, so groove that.

Serve toss — peaks at ~92% of target height. Toss to where your fully extended racquet would meet the ball at its apex.

(This is a placeholder response. Point EXTERNAL_API_URL in the edge function at the real analysis endpoint to replace it.)`
}
