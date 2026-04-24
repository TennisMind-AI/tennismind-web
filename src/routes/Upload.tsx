import { useRef, useState } from 'react'
import type { DragEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { UploadIcon } from '../components/icons'
import { insforge } from '../lib/insforge'

const TIPS = [
  { k: '01', h: 'Film from the baseline corner', t: 'Hip height, whole body in frame. 50–60 fps ideal.' },
  { k: '02', h: 'One stroke focus per clip', t: 'Forehand, backhand or serve — mixed clips work too.' },
  { k: '03', h: 'Any court, any level', t: 'Hard, clay, indoor — lighting adapts automatically.' },
]

type Phase = 'idle' | 'uploading' | 'analyzing'

export default function Upload() {
  const navigate = useNavigate()

  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [urlMode, setUrlMode] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)

  const busy = phase !== 'idle'

  async function runAnalysis(videoUrl: string) {
    setError(null)
    setPhase('analyzing')
    try {
      const { data, error } = await insforge.functions.invoke('analyze-video', {
        body: { video_url: videoUrl },
      })
      if (error) throw new Error(error.message)
      if (!data?.text) throw new Error('Edge function returned no text')
      const dest = data.session_id ? `/review/${data.session_id}` : '/review'
      navigate(dest, { state: { text: data.text, videoUrl } })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setError(message)
      setPhase('idle')
    }
  }

  async function startFileUpload(file: File) {
    setError(null)
    setPhase('uploading')
    try {
      const { data: upload, error: uploadError } = await insforge.storage
        .from('videos')
        .uploadAuto(file)
      if (uploadError || !upload) {
        throw new Error(uploadError?.message ?? 'Upload failed')
      }
      await runAnalysis(upload.url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
      setPhase('idle')
    }
  }

  function onUrlSubmit(e: FormEvent) {
    e.preventDefault()
    const v = urlValue.trim()
    if (!v) return
    void runAnalysis(v)
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    if (!dragOver && !busy) setDragOver(true)
  }
  function onDragLeave(e: DragEvent) {
    if (e.currentTarget === e.target) setDragOver(false)
  }
  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (busy) return
    const file = e.dataTransfer.files?.[0]
    if (file) void startFileUpload(file)
  }

  return (
    <AppShell activeNav="upload" title="Upload">
      <div className="h-full min-h-0 overflow-auto px-8 py-7">
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) void startFileUpload(f)
          }}
        />

        <div className="flex flex-col gap-[18px] max-w-[680px] mx-auto">
          <div>
            <div className="font-mono text-muted text-[10.5px] uppercase tracking-[.16em]">NEW SESSION</div>
            <h1 className="font-display text-[38px] mt-1.5 mb-1 leading-[1.1]">
              Drop in a playback. <span className="bg-accent px-2 rounded-md">Get coached.</span>
            </h1>
            <div className="text-muted text-[13px] max-w-[520px]">
              One clip at a time. Stroke-mechanics analysis on forehand, backhand and serve — with audio notes from
              your chosen coach in about 90 seconds.
            </div>
          </div>

          {busy ? (
            <AnalyzingCard phase={phase} />
          ) : urlMode ? (
            <UrlForm
              value={urlValue}
              onChange={setUrlValue}
              onSubmit={onUrlSubmit}
              onBack={() => {
                setUrlMode(false)
                setUrlValue('')
              }}
            />
          ) : (
            <div
              className={[
                'border-[1.5px] border-dashed border-ink rounded-[18px] px-6 py-[34px] bg-card flex flex-col items-center gap-3.5 text-center transition',
                dragOver ? 'bg-accent/20 border-solid' : '',
              ].join(' ')}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className="w-14 h-14 rounded-full bg-accent text-ink grid place-items-center">
                <UploadIcon width={22} height={22} />
              </div>
              <div>
                <div className="font-display text-xl">Drop your clip here</div>
                <div className="text-muted text-xs mt-1">MP4, MOV, WebM · up to 2 GB · 30 s – 20 min</div>
              </div>
              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="h-[34px] px-3.5 rounded-full bg-ink text-accent text-[12.5px] font-medium hover:opacity-90"
                >
                  Choose file
                </button>
                <button
                  type="button"
                  onClick={() => setUrlMode(true)}
                  className="h-[34px] px-3.5 rounded-full border border-line text-ink text-[12.5px] font-medium hover:bg-[#f4f4ef]"
                >
                  Paste link
                </button>
              </div>
              <div className="font-mono text-muted text-[10.5px] mt-1.5 tracking-[.08em]">
                OR DROP ANYWHERE ON THIS PANEL
              </div>
            </div>
          )}

          {error && (
            <div className="text-[12px] text-clay bg-[#faece4] border border-clay/30 rounded-[10px] px-3 py-2">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            {TIPS.map(tip => (
              <div key={tip.k} className="bg-card border border-line rounded-[14px] p-3.5">
                <div className="font-mono text-muted text-[10px] tracking-[.12em]">{tip.k}</div>
                <div className="font-semibold text-[13px] mt-1.5">{tip.h}</div>
                <div className="text-muted text-xs mt-1 leading-[1.45]">{tip.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function AnalyzingCard({ phase }: { phase: Phase }) {
  const label = phase === 'uploading' ? 'Uploading your clip…' : 'Analyzing your strokes…'
  return (
    <div className="border border-line rounded-[18px] bg-card px-6 py-[48px] flex flex-col items-center gap-4 text-center">
      <Spinner />
      <div className="font-display text-xl">{label}</div>
      <div className="text-muted text-xs max-w-[380px]">
        Usually takes about 30 seconds. Hang tight — we'll show the results as soon as it's done.
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-[3px] border-line-soft" />
      <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-ink animate-spin" />
    </div>
  )
}

function UrlForm({
  value,
  onChange,
  onSubmit,
  onBack,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
  onBack: () => void
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-[1.5px] border-dashed border-ink rounded-[18px] px-6 py-[28px] bg-card flex flex-col items-center gap-3.5 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-accent text-ink grid place-items-center">
        <UploadIcon width={22} height={22} />
      </div>
      <div>
        <div className="font-display text-xl">Paste a video link</div>
        <div className="text-muted text-xs mt-1">Public URL (MP4, MOV, WebM). YouTube links don't work yet.</div>
      </div>
      <input
        type="url"
        required
        value={value}
        placeholder="https://…"
        onChange={e => onChange(e.target.value)}
        autoFocus
        className="h-10 w-full max-w-[420px] px-3 rounded-[10px] border border-line bg-white text-[13px] outline-none focus:border-ink"
      />
      <div className="flex gap-2.5 mt-1">
        <button
          type="submit"
          className="h-[34px] px-3.5 rounded-full bg-ink text-accent text-[12.5px] font-medium hover:opacity-90"
        >
          Analyze
        </button>
        <button
          type="button"
          onClick={onBack}
          className="h-[34px] px-3.5 rounded-full border border-line text-ink text-[12.5px] font-medium hover:bg-[#f4f4ef]"
        >
          Back to file
        </button>
      </div>
    </form>
  )
}

