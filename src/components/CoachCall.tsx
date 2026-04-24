import { useEffect, useRef, useState } from 'react'
import type { SVGProps } from 'react'
import { getAssistantId, getVapi, vapiConfigured } from '../lib/vapi'

type Status = 'idle' | 'connecting' | 'connected' | 'ended' | 'error'

type Segment = { role: 'user' | 'assistant'; text: string; final: boolean }

type Props = {
  firstMessage: string
}

export function CoachCall({ firstMessage }: Props) {
  const configured = vapiConfigured()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [segments, setSegments] = useState<Segment[]>([])
  const [assistantSpeaking, setAssistantSpeaking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const firstMessageRef = useRef(firstMessage)

  // Keep the ref in sync but don't restart the call when prop changes.
  useEffect(() => {
    firstMessageRef.current = firstMessage
  }, [firstMessage])

  useEffect(() => {
    if (!configured) return
    const vapi = getVapi()

    const onCallStart = () => setStatus('connected')
    const onCallEnd = () => setStatus(s => (s === 'error' ? 'error' : 'ended'))
    const onSpeechStart = () => setAssistantSpeaking(true)
    const onSpeechEnd = () => setAssistantSpeaking(false)
    const onError = (e: unknown) => {
      const message = e instanceof Error ? e.message : 'Call error'
      setError(message)
      setStatus('error')
    }
    const onMessage = (msg: {
      type?: string
      role?: string
      transcript?: string
      transcriptType?: string
    }) => {
      if (msg.type !== 'transcript' || !msg.transcript || !msg.role) return
      const role = msg.role === 'user' ? 'user' : 'assistant'
      const text = msg.transcript
      const isFinal = msg.transcriptType === 'final'

      setSegments(segs => {
        const last = segs[segs.length - 1]
        // Extend the current in-progress segment of the same role.
        if (last && last.role === role && !last.final) {
          if (last.text === text && last.final === isFinal) return segs
          return [...segs.slice(0, -1), { role, text, final: isFinal }]
        }
        // Otherwise start a new segment (role switch or after a finalized turn).
        return [...segs, { role, text, final: isFinal }]
      })
    }

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)
    vapi.on('message', onMessage)

    // Auto-start with a small delay. React StrictMode double-invokes effects in
    // dev, and Daily.co (VAPI's transport) will eject a call if start/stop/start
    // fires in rapid succession. The debounce lets the first "cleanup" cancel
    // the timer before any connect actually happens.
    let active = true
    let started = false
    setStatus('connecting')
    setSegments([])
    setError(null)
    const startTimer = window.setTimeout(() => {
      if (!active) return
      vapi
        .start(getAssistantId(), { firstMessage: firstMessageRef.current })
        .then(() => {
          if (!active) {
            // Component unmounted mid-connect — hang up now.
            try { vapi.stop() } catch { /* ignore */ }
            return
          }
          started = true
        })
        .catch(err => {
          if (!active) return
          const message = err instanceof Error ? err.message : 'Could not start call'
          setError(message)
          setStatus('error')
        })
    }, 50)

    return () => {
      active = false
      window.clearTimeout(startTimer)
      vapi.removeListener('call-start', onCallStart)
      vapi.removeListener('call-end', onCallEnd)
      vapi.removeListener('speech-start', onSpeechStart)
      vapi.removeListener('speech-end', onSpeechEnd)
      vapi.removeListener('error', onError)
      vapi.removeListener('message', onMessage)
      if (started) {
        try {
          vapi.stop()
        } catch {
          // ignore
        }
      }
    }
  }, [configured])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [segments, assistantSpeaking])

  function stop() {
    if (!configured) return
    try {
      getVapi().stop()
    } catch {
      // ignore
    }
  }

  if (!configured) {
    return (
      <div className="bg-card border border-line rounded-[14px] p-5 h-full flex flex-col justify-center">
        <div className="font-display text-[15px] font-semibold mb-1">Talk to coach</div>
        <div className="text-muted text-[12.5px] leading-[1.5]">
          VAPI isn't configured yet. Set <span className="font-mono">VITE_VAPI_PUBLIC_KEY</span> and{' '}
          <span className="font-mono">VITE_VAPI_ASSISTANT_ID</span> in <span className="font-mono">.env</span>.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-line rounded-[14px] h-full min-h-0 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line-soft">
        <div className="font-display text-[14px] font-semibold">Talk to coach</div>
        <StatusBadge status={status} speaking={assistantSpeaking} />
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto px-5 py-4 flex flex-col gap-3">
        {segments.length === 0 ? (
          <div className="text-muted text-[12.5px] italic">
            {status === 'connecting' ? 'Connecting to your coach…' : 'Listening…'}
          </div>
        ) : (
          segments.map((seg, i) =>
            seg.role === 'assistant' ? (
              <p key={i} className="text-[13.5px] leading-[1.65] text-ink whitespace-pre-wrap m-0">
                {seg.text}
              </p>
            ) : (
              <div
                key={i}
                className="text-[12.5px] leading-[1.5] text-muted italic border-l-2 border-line pl-3 py-0.5"
              >
                {seg.text}
              </div>
            ),
          )
        )}
      </div>

      <div className="border-t border-line-soft px-4 py-3 flex flex-col gap-2.5">
        {error && (
          <div className="text-[12px] text-clay bg-[#faece4] border border-clay/30 rounded-[10px] px-3 py-2">
            {error}
          </div>
        )}
        {status === 'connected' && (
          <div className="flex items-center justify-between gap-2">
            {assistantSpeaking ? (
              <div className="flex items-center gap-2 text-muted text-[12.5px] italic">
                Coach is speaking…
              </div>
            ) : (
              <div className="flex items-center gap-2 text-ink text-[12.5px] font-medium">
                <span className="relative w-7 h-7 rounded-full bg-accent grid place-items-center">
                  <span className="absolute inset-0 rounded-full bg-accent opacity-60 animate-ping" />
                  <MicIcon className="relative" width={14} height={14} />
                </span>
                Ask follow up questions
              </div>
            )}
            <button
              type="button"
              onClick={stop}
              className="h-[34px] px-3.5 rounded-full bg-clay text-white text-[12.5px] font-medium hover:opacity-90"
            >
              End call
            </button>
          </div>
        )}
        {status === 'connecting' && (
          <div className="flex items-center gap-2 text-muted text-[12px]">
            <Spinner /> Connecting…
          </div>
        )}
        {status === 'ended' && (
          <div className="text-muted text-[12px]">Call ended.</div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status, speaking }: { status: Status; speaking: boolean }) {
  const label =
    status === 'connected'
      ? speaking
        ? 'Coach speaking'
        : 'Listening'
      : status === 'connecting'
      ? 'Connecting'
      : status === 'ended'
      ? 'Call ended'
      : status === 'error'
      ? 'Error'
      : 'Not connected'

  const dotColor =
    status === 'connected'
      ? 'bg-court'
      : status === 'connecting'
      ? 'bg-accent'
      : status === 'error'
      ? 'bg-clay'
      : 'bg-line'

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-line rounded-full text-[11px] text-muted whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  )
}

function Spinner() {
  return (
    <span className="relative w-3.5 h-3.5 inline-block">
      <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-ink animate-spin" />
    </span>
  )
}

function MicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  )
}
