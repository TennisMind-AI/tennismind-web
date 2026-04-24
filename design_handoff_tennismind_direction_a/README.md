# Handoff: TennisMind · Direction A (Court)

## Overview
**TennisMind** is a tennis coaching web app. A user uploads a playback clip, the system analyzes stroke mechanics (forehand, backhand, serve), and an AI coach "speaks" personalized feedback with a waveform audio player + transcript. The app also tracks progress over time, prescribes drills, and lets the user switch between coach personas.

This handoff covers **Direction A — "Court"**: a clean, sporty aesthetic (ink-on-cream, lime accent, bold sans) chosen from a side-by-side exploration.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these HTML designs in the target codebase's existing environment** (React, Next.js, Vue, etc.) using its established patterns, component library, and styling conventions. If no environment exists yet, pick the most appropriate framework for the project (React + Vite + Tailwind is a reasonable default) and implement the designs there.

Do not ship the HTML prototype as-is. Treat it as a spec.

## Fidelity
**High-fidelity.** Colors, typography, spacing, layout, and interaction patterns are final. Recreate pixel-perfect using the codebase's component library.

## Screens / Views

All screens share a **two-column shell**: a 220 px left sidebar (logo + nav + coach card) and a main area with a 52 px top header (breadcrumb + streak chip + Share + avatar). Main content sits inside at ~22–32 px padding.

### 1. Upload (`/upload`)
Purpose: drop in a new video clip, pick coach, glance at recent uploads.
Layout: two-column grid `1.4fr 1fr`, gap 22 px.
- **Hero headline**: eyebrow (10.5 px mono, uppercase, `.16em` tracking), then H1 at 38 px with a pill-highlighted phrase (`background: #d9f16b; padding: 0 8px; border-radius: 6px`).
- **Dropzone**: 1.5 px dashed ink border, 18 px radius, white background, 34 px vertical padding, centered. Contains a 56 px round lime button with upload glyph, then "Drop your clip here" (20 px title), "MP4, MOV, WebM · up to 2 GB · 30 s – 20 min" (muted 12 px), then two buttons ("Choose file" primary ink-on-lime, "Paste link" ghost).
- **Tip cards**: 3-up grid. Each card 14 px padding, `01/02/03` mono eyebrow, bold heading, muted body.
- **Right column**: Today's Coach card (avatar + name · style + blurb), Recent uploads list (4 rows with 64×42 video thumb, title, date · duration, score on the right), and a lime-tinted streak banner.

### 2. Processing (`/processing`)
Purpose: show pipeline progress while analysis runs.
Layout: two-column `1.2fr 1fr`.
- Left: eyebrow + H1 ("Breaking down your strokes."), then a **preview card** (height 340 px) with striped placeholder + lime-colored pose skeleton overlay + "FOREHAND · FRAME 184" lime badge. Below that, a progress bar (6 px tall, ink fill, 42%).
- Right: **Pipeline** card listing 5 steps (Ingest, Pose tracking, Stroke segmentation, Mechanics analysis, Voice notes). Each row has a 22 px status circle (filled ink + lime check when done, outline + green dot when active, outline with step number when pending), a title + mono sub-caption, and a uppercase mono status (`OK`, `RUNNING`, `QUEUED`).

### 3. Review — Video + Annotations (`/review/:sessionId`)
Purpose: watch the clip with AI annotations and scrub by event markers.
Layout: two-column `1fr 320px`.
- Left: **Video card** flex-1 (striped video placeholder) with SVG overlays — dotted lime swing-arc, ink head-speed vector arrow, contact-point ring, annotation labels (`HEAD SPEED 71 mph ↓` ink card with lime text, `CONTACT −6 in` lime-on-ink pill). Top-left chips: FOREHAND, CLIP 3/8. Bottom-right: 0.5× pause button.
- Below video: **Scrubber card** — 38 px round play button, mono timecode `01:14 / 03:22`, waveform bars (120 bars; ink before playhead, light-line after), colored event markers (orange = warn, court-green = ok), playhead line. Below bars: pill chips for each event.
- Right: **Annotations** list — 8 entries. Each row: mono timecode on left (orange if warn, ink if ok), title bold, muted body.

### 4. Coach Feedback — Audio + Text (`/feedback/:sessionId`) — *primary voice UI*
Purpose: listen to the coach's spoken feedback + read transcript.
Layout: two-column `1.3fr 1fr`.
- Left: eyebrow + H1 ("Three fixes. One stays."), three **verdict cards** (FIX / FIX / KEEP — colored mono tag, bold title, muted body), then a **Transcript card** that fills remaining height. Transcript rows have a 52 px mono timecode and text; the currently-playing row gets a pale highlight (`#fbfbe8`).
- Right: **Floating audio player** (ink background `#0e1411`, white text). Contains coach avatar (44 px lime circle, initials), name + style, 1.0× speed button, then a 74 px tall waveform (lime bars before playhead at 22%, white-alpha-22 after), timecodes `00:29 / 2:14`, transport controls (‹‹, big lime play, ››), and a mono `VOICE · EN-US` label with mic icon. Below: **By the numbers** metrics card (2×2 grid of tiles, each with mono label, big number + unit, delta). At bottom: **Send to Drills** primary-lime button + **Export** ghost.

### 5. Progress (`/progress`)
Purpose: weekly trend of overall score, stroke breakdown, session history.
Layout: vertical stack inside the main area.
- Header row: eyebrow + H1 + 13 px subtitle on the left; 4-option range switcher on the right (`7d / 30d / 90d / All`; active is ink background + lime text).
- **Overall score** card (1.8fr) with H1-scale "72" + lime pill "+8 vs Apr 7", and an 8-point line chart with gradient fill (lime 0.6 → 0).
- **By stroke** card (1fr) with 4 horizontal bar rows (Forehand 78 +12, Backhand 71 +5, Serve 62 0, Volleys 69 +3).
- **Sessions** table: columns `thumb / date / title / duration / score / Δ`. Δ color: green for +, orange for −, muted em-dash for null.

### 6. Drills (`/drills`)
Purpose: prescribed practice plan derived from the latest session.
Layout: two-column `1fr 300px`.
- Left: header (eyebrow + H1 + subtitle) with "Start practice" primary-lime button. Below: 2-column grid of 4 drill cards. Each card: level badge (`CORE` lime / `WARM-UP` lime-tint / other gray), focus tag on right, drill name (15 px bold), small court SVG, muted "why" text, bottom row with mono TIME/REPS and "Open" ghost button.
- Right: **Practice plan** sticky card. Muted intro text, divider, numbered rows (`01` muted · name + focus · mono minutes), divider, Total row, and "Add to calendar" primary-ink button.

### 7. Coach Settings (`/settings/coach`)
Purpose: pick a coach persona and configure voice + analysis focus.
Layout: vertical, max-width 900 px, centered.
- Header (eyebrow + H1 + subtitle).
- **3 coach cards**. Active card flips to **ink background + white text + white-alpha chips**; Select button flips to `background: lime; color: ink`. Inactive cards: cream background. Each card has 44 px lime avatar, name (14 bold), style sub, blurb, 3 muted chips (Firm / Bilingual / 90s avg), Select button full-width, play-preview icon button on the right.
- **Voice + Focus** card: two columns.
  - Voice column: Pace / Tone / Language rows, each with a segmented mono pill picker (active segment: ink background, lime text).
  - Focus column: 5 toggles (iOS-style pill, `background: ink` when on, lime knob; `background: line` when off, white knob).

## Interactions & Behavior
- **Sidebar nav**: simple routing; active item has ink background, lime text, 5 px lime dot.
- **Dropzone**: accept drag-enter over entire left panel; on drop → navigate to /processing. Clicking "Choose file" opens native file picker; "Paste link" opens URL input.
- **Processing → Review**: auto-advance when pipeline completes; show the progress bar animating 0 → 100% over ~90s in real use.
- **Review scrubber**: clicking an event marker or chip seeks the video to that timestamp. Hover on marker shows a tooltip with the event title.
- **Transcript row ↔ audio**: clicking a transcript line seeks the audio; the currently-playing line auto-highlights (`#fbfbe8` background) and the view auto-scrolls to keep it centered.
- **Audio player**: Play/pause toggles `Icon.Play ↔ Icon.Pause`. Speed button cycles 0.5 → 1.0 → 1.25 → 1.5. Waveform is clickable to seek.
- **Send to Drills**: navigates to /drills with the session context pre-loaded.
- **Progress range switcher**: client-side filter, no reload.
- **Drills "Start practice"**: navigates to a per-drill timer view (out of scope here — leave a stub route).
- **Coach card selection**: clicking an inactive card flips it to active style; persists as user preference.
- **Toggles**: iOS-style with 150 ms `left` transition on the knob.
- All buttons have subtle hover: primary-ink buttons → `opacity: .9`; ghost buttons → `background: #f4f4ef`.
- Card hover where clickable: `box-shadow: 0 2px 12px rgba(0,0,0,0.04); transform: translateY(-1px)` over 150 ms.

## State Management
- `session`: current session id, metadata (date, title, duration, fileUrl).
- `pipelineStatus`: per-step state (`pending | running | done | error`) + overall progress 0–1.
- `annotations`: array of `{ t: seconds, title, tone: 'warn'|'ok', body }`.
- `transcript`: array of `{ t: seconds, speaker, text }`.
- `player`: `{ playing, currentTime, duration, speed, audioUrl }`.
- `coach`: `{ id, name, style, blurb, initials }` — active coach persona.
- `metrics`: `{ headSpeed, contactDepth, spinRate, courtCoverage, ... }`.
- `progressSeries`: weekly scores.
- `sessions`: list (for table and recent uploads).
- `drills`: prescribed plan from latest analysis.
- `voiceSettings`: `{ pace, tone, language, length }`.
- `focusFlags`: `{ forehand, backhand, serve, footwork, strategy }`.

Persist `coach`, `voiceSettings`, `focusFlags` to the backend user profile.

## Data fetching
- `POST /api/sessions` (multipart upload) → `{ sessionId }`.
- `GET /api/sessions/:id` → session + pipelineStatus (poll every 2 s while processing, or use SSE).
- `GET /api/sessions/:id/analysis` → annotations + metrics + audioUrl + transcript once pipeline done.
- `GET /api/progress?range=30d` → series + strokeBreakdown.
- `GET /api/drills?from=:sessionId` → prescribed drills.
- `GET /api/coaches`, `PUT /api/user/coach`.

## Design Tokens

### Colors
```
bg              #fafaf7   (page)
card            #ffffff
ink             #0e1411   (primary text, dark surfaces)
muted           #6b7368   (secondary text)
line            #e6e4dd   (borders)
line-soft       #efede6   (inner dividers)
court           #b7c96e   (tennis-green highlight, "ok" state)
court-soft      #e8eed2   (tints, tip cards)
clay            #c87551   (warning, "fix" state)
accent-A (lime) #d9f16b   (primary accent — pill highlights, active states, audio waveform)
```
Accent is **tweakable**; default #d9f16b. The whole app uses `--tm-accent-a`.

### Typography
- Display: **Inter 600–700** (`letter-spacing: -0.02em` on large headings). Also tested with Fraunces (editorial), Geist (technical), Instrument Serif (contrast) via the Tweaks pairing picker — pick Inter for launch.
- Body: **Inter 400–500**.
- Mono: **Geist Mono** for eyebrows, timecodes, metric units, chips.
- Scale (regular density): `text = 13.5px`, `title = 26px`, header H1 = 30–38px.
- Eyebrows: 10.5 px, uppercase, letter-spacing `.16em`, muted color.

### Spacing / radii / shadows
- Unit: 12 px (regular). Density tweak: compact = 10, comfy = 14.
- Card radius: 14 px. Chip/pill: 999 px. Button: 999 px. Input: 10 px.
- Sidebar nav item radius: 10 px.
- No heavy shadows. Cards use a 1 px border (`#e6e4dd`) instead of drop shadow. Optional hover lift: `0 2px 12px rgba(0,0,0,0.04)`.

### Density variants (layout)
`--tm-pad` and `--tm-gap` scale 12/16/20 (compact/regular/comfy). Default to regular.

## Assets
- **Icons**: inline SVG, 1.6 px stroke, round caps/joins. Full set in `shared.jsx` under `Icon.*` (Upload, Play, Pause, Mic, Check, Arrow, Spark, Gear, Close, Flame, Dot). Replace with Lucide or Phosphor equivalents in the real app.
- **Court diagram**: SVG primitive in `shared.jsx` (`CourtDiagram`). Single reusable component; pass `shots` array for overlays.
- **Video thumbs / frames**: placeholder striped backgrounds. In production, use a server-generated poster frame at 2 s.
- **Coach avatars**: initials on lime circle. Replace with real headshots when available.
- **No third-party images** used.

## Files in this bundle
- `TennisMind.html` — entry point (loads React + Babel + the JSX modules).
- `shared.jsx` — data fixtures (coaches, transcript, drills, sessions, metrics), `Icon.*`, `CourtDiagram`, `VideoPlaceholder`, `waveformBars`.
- `direction-a.jsx` — all 7 Direction A screens (`DirA.Upload`, `DirA.Processing`, `DirA.Review`, `DirA.Feedback`, `DirA.Progress`, `DirA.Drills`, `DirA.Settings`) and the `AShell` chrome.
- `app.jsx` — Design-canvas wiring + Tweaks panel (typography / density / coach / accent).
- `design-canvas.jsx`, `tweaks-panel.jsx` — scaffolding, not part of the shipped product.

Direction B files were intentionally excluded.

## Implementation notes
- **Keep the floating audio player persistent** across Review ↔ Feedback ↔ Progress — when a user navigates away mid-playback, keep it playing and dock it to the bottom-right.
- **Pose tracking** can run client-side (MediaPipe Pose, TF.js) to avoid server GPU cost; voice synthesis must be server-side (ElevenLabs, OpenAI TTS, or a self-hosted model).
- **Pipeline** is an async job; don't block the UI — render the Processing screen optimistically the moment upload completes.
- **Accessibility**: all buttons need discernible labels; waveform bars should be supplemented with a slider for keyboard users; transcript should be a `role="log"` with `aria-live="polite"` while playing.
- **Keyboard**: `Space` play/pause, `J`/`K` seek −/+ 5 s, `←`/`→` seek −/+ 1 s on the Review screen (shown in Direction B; still a good idea for A).
