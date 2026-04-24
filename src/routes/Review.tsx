import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CoachCall } from '../components/CoachCall'
import { insforge, type SessionRow } from '../lib/insforge'
import { useAuth } from '../lib/auth'
import { formatDate } from '../lib/format'

type ReviewState = { text?: string; videoUrl?: string } | null

export default function Review() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()

  const state = (location.state as ReviewState) ?? null
  const initialText = state?.text ?? null
  const initialVideo = state?.videoUrl ?? null

  const [session, setSession] = useState<SessionRow | null>(null)
  const [text, setText] = useState<string | null>(initialText)
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideo)
  const [error, setError] = useState<string | null>(null)

  const needsFetch = !!sessionId && (!initialText || !initialVideo)
  const [loading, setLoading] = useState(needsFetch)

  useEffect(() => {
    if (!needsFetch) return
    if (authLoading) return
    if (!user) {
      setError('Sign in to view a saved session.')
      setLoading(false)
      return
    }
    let cancelled = false
    insforge.database
      .from('sessions')
      .select('*')
      .eq('id', sessionId!)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) {
          setError(error?.message ?? 'Session not found')
          setLoading(false)
          return
        }
        const row = data as SessionRow
        setSession(row)
        if (row.analysis_text && !text) setText(row.analysis_text)
        if (row.video_url && !videoUrl) setVideoUrl(row.video_url)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsFetch, sessionId, user, authLoading])

  return (
    <AppShell title="Review">
      <div className="h-full min-h-0 px-8 py-6 flex flex-col gap-4">
        <div>
          <div className="font-mono text-muted text-[10.5px] tracking-[.16em]">
            {session ? `SESSION · ${formatDate(session.created_at).toUpperCase()}` : 'SESSION'}
          </div>
          <h1 className="font-display text-[28px] mt-1 leading-[1.1]">Coach feedback.</h1>
          {!sessionId && text && (
            <div className="text-muted text-[12.5px] mt-1.5">
              Anonymous session — not saved.{' '}
              <Link to="/auth" className="underline text-ink">Sign in</Link> to keep your history.
            </div>
          )}
        </div>

        {loading && (
          <div className="bg-card border border-line rounded-[14px] p-8 text-muted text-sm">
            Loading analysis…
          </div>
        )}

        {!loading && error && (
          <div className="text-[12px] text-clay bg-[#faece4] border border-clay/30 rounded-[10px] px-3 py-2">
            {error}
          </div>
        )}

        {!loading && !error && text && (
          <div className="flex-1 min-h-0 grid grid-cols-[1.2fr_1fr] gap-4">
            <VideoPanel url={videoUrl} />
            <CoachCall firstMessage={text} />
          </div>
        )}

        {!loading && !error && !text && (
          <div className="bg-card border border-line rounded-[14px] p-8 text-center">
            <div className="font-display text-[18px] mb-1.5">Nothing to show</div>
            <div className="text-muted text-[13px]">
              Drop a clip on the <Link to="/upload" className="text-ink underline">Upload</Link> screen to get an analysis.
            </div>
          </div>
        )}

        <div className="flex gap-2.5">
          <Link
            to="/upload"
            className="h-[34px] px-3.5 rounded-full bg-ink text-accent text-[12.5px] font-medium flex items-center hover:opacity-90"
          >
            Analyze another clip
          </Link>
          {user && (
            <Link
              to="/history"
              className="h-[34px] px-3.5 rounded-full border border-line text-ink text-[12.5px] font-medium flex items-center hover:bg-[#f4f4ef]"
            >
              View history
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  )
}

function VideoPanel({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="bg-ink rounded-[14px] grid place-items-center text-muted text-[12px]">
        No video available
      </div>
    )
  }
  return (
    <div className="bg-ink rounded-[14px] overflow-hidden">
      <video
        key={url}
        src={url}
        autoPlay
        muted
        loop
        playsInline
        controls
        className="w-full h-full object-contain"
      />
    </div>
  )
}
