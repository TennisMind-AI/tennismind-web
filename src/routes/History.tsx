import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { insforge, type SessionRow } from '../lib/insforge'
import { useAuth } from '../lib/auth'
import { formatDate } from '../lib/format'

export default function History() {
  const { user, loading } = useAuth()
  const [sessions, setSessions] = useState<SessionRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setSessions(null)
      return
    }
    let cancelled = false
    insforge.database
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setError(error.message)
          return
        }
        setSessions((data as SessionRow[]) ?? [])
      })
    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <AppShell activeNav="history" title="History">
      <div className="h-full min-h-0 overflow-auto px-8 py-7">
        <div className="max-w-[760px] mx-auto flex flex-col gap-5">
          <div>
            <div className="font-mono text-muted text-[10.5px] tracking-[.16em]">SESSIONS</div>
            <h1 className="font-display text-[30px] mt-1.5 leading-[1.1]">Your history.</h1>
            <div className="text-muted text-[13px] mt-1">Every clip you've analyzed, with the coach's notes.</div>
          </div>

          {loading && <div className="text-muted text-sm">Loading…</div>}

          {!loading && !user && <SignedOutCard />}

          {!loading && user && error && (
            <div className="text-[12px] text-clay bg-[#faece4] border border-clay/30 rounded-[10px] px-3 py-2">
              {error}
            </div>
          )}

          {!loading && user && sessions && sessions.length === 0 && (
            <div className="bg-card border border-line rounded-[14px] p-8 text-center">
              <div className="font-display text-[18px] mb-1.5">No sessions yet.</div>
              <div className="text-muted text-[13px]">
                Drop a clip on the{' '}
                <Link to="/upload" className="text-ink underline">Upload</Link> screen — it'll show up here.
              </div>
            </div>
          )}

          {!loading && user && sessions && sessions.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {sessions.map(s => <SessionRowCard key={s.id} row={s} />)}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

function SessionRowCard({ row }: { row: SessionRow }) {
  const excerpt = (row.analysis_text ?? '').replace(/\s+/g, ' ').trim().slice(0, 160)
  return (
    <Link
      to={`/review/${row.id}`}
      className="bg-card border border-line rounded-[14px] p-4 flex flex-col gap-1.5 hover:border-ink transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="font-mono text-muted text-[10.5px] tracking-[.12em]">
          {formatDate(row.created_at).toUpperCase()}
        </div>
        <div className="font-mono text-muted text-[10px] tracking-[.12em] truncate max-w-[280px]">
          {row.video_url}
        </div>
      </div>
      <div className="text-[13px] leading-[1.5] text-ink line-clamp-2">
        {excerpt || <span className="text-muted italic">No analysis saved.</span>}
      </div>
    </Link>
  )
}

function SignedOutCard() {
  return (
    <div className="bg-card border border-line rounded-[14px] p-8 text-center">
      <div className="font-display text-[20px]">Sign in to keep your history.</div>
      <div className="text-muted text-[13px] mt-2 max-w-md mx-auto">
        Sign in to save every analysis and come back to it later.
      </div>
      <Link
        to="/auth"
        className="inline-flex h-[36px] px-4 rounded-full bg-ink text-accent text-[12.5px] font-medium items-center mt-4 hover:opacity-90"
      >
        Sign in or create an account
      </Link>
    </div>
  )
}
