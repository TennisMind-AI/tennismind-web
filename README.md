# TennisMind

A web app that analyzes a tennis playback clip and then lets you talk to an AI coach about what it saw.

**Live:** https://6mskp9r2.insforge.site

## How it works

1. The user uploads a short video clip or pastes a public video URL on `/upload`.
2. The frontend uploads the file to InsForge storage (if it's a file) and invokes the `analyze-video` edge function with the resulting URL.
3. The edge function POSTs `{ user_id, video_url }` to an external analysis service (`https://analysis-agent-production.up.railway.app/analyze`) and persists the returned text to the `sessions` table.
4. The client navigates to `/review/:id`, where the original video plays on loop and the analysis starts streaming in as speech via VAPI. The first message is the full analysis, then the user can ask follow-ups out loud.

Anonymous users can also run the analysis; they just don't get a persisted session or history.

## Stack

- **Frontend** — React 18, Vite 5, TypeScript, Tailwind v4, React Router v6
- **Backend** — [InsForge](https://insforge.ai) for auth, Postgres + RLS, storage buckets, and edge functions
- **Analysis** — external service hosted on Railway (HTTP `POST /analyze`)
- **Voice AI** — [VAPI](https://vapi.ai) Web SDK (`@vapi-ai/web`) + Daily.co WebRTC under the hood

## Project layout

```
.
├── src/                                # React app
│   ├── App.tsx                         # Routes
│   ├── main.tsx                        # Entry (wraps in AuthProvider)
│   ├── components/
│   │   ├── AppShell.tsx                # Sidebar + header chrome
│   │   ├── CoachCall.tsx               # VAPI call + streaming transcript
│   │   └── icons.tsx
│   ├── lib/
│   │   ├── auth.tsx                    # AuthProvider, useAuth, session helpers
│   │   ├── insforge.ts                 # SDK client + SessionRow type
│   │   ├── vapi.ts                     # Vapi client singleton
│   │   └── format.ts
│   └── routes/
│       ├── Auth.tsx                    # Sign-in / sign-up / verify / reset password
│       ├── Upload.tsx                  # Dropzone + paste-link
│       ├── Review.tsx                  # Video + coach call
│       └── History.tsx                 # Signed-in session list
├── insforge/
│   └── functions/
│       └── analyze-video/index.ts      # Deno edge function: calls external API, saves session
├── migrations/                         # Postgres schema
│   ├── 20260424205921_create-sessions.sql
│   ├── 20260424214438_redesign-sessions.sql
│   └── 20260424214809_add-sessions-insert-policy.sql
├── public/                             # Static assets (favicon, logo)
├── design_handoff_tennismind_direction_a/   # Original HTML design spec (reference only)
├── vercel.json                         # SPA rewrite config for deploy
└── vite.config.ts
```

## Data model

```sql
sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  video_url     text not null,
  analysis_text text,
  created_at    timestamptz not null default now()
)
```

RLS: users can `SELECT` / `INSERT` / `UPDATE` / `DELETE` only their own rows (`user_id = auth.uid()`). The edge function runs in the caller's auth context, so inserts go through RLS naturally.

## Getting started

### Prerequisites

- Node 18+
- An [InsForge](https://dashboard.insforge.ai) project (linked via `.insforge/project.json`)
- A [VAPI](https://dashboard.vapi.ai) account with an assistant created

### 1. Install

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```bash
VITE_INSFORGE_URL=https://<appkey>.<region>.insforge.app
VITE_INSFORGE_ANON_KEY=<your-anon-key>
VITE_VAPI_PUBLIC_KEY=<vapi-public-key>
VITE_VAPI_ASSISTANT_ID=<vapi-assistant-id>
```

To fetch the InsForge values:

```bash
npx @insforge/cli current          # shows oss_host (→ VITE_INSFORGE_URL)
npx @insforge/cli secrets get ANON_KEY
```

Grab your VAPI keys from https://dashboard.vapi.ai.

### 3. Apply database migrations

```bash
npx @insforge/cli db migrations up --all
```

### 4. Deploy the edge function

```bash
npx @insforge/cli functions deploy analyze-video
```

### 5. Run the dev server

```bash
npm run dev
```

The app boots at http://localhost:5173.

## Deployment

The app is deployed to InsForge's Vercel integration:

```bash
# One-time: set env vars on the deployment (persists across future deploys)
npx @insforge/cli deployments env set VITE_INSFORGE_URL <value>
npx @insforge/cli deployments env set VITE_INSFORGE_ANON_KEY <value>
npx @insforge/cli deployments env set VITE_VAPI_PUBLIC_KEY <value>
npx @insforge/cli deployments env set VITE_VAPI_ASSISTANT_ID <value>

# Deploy (builds server-side)
npm run build          # verify local build first
npx @insforge/cli deployments deploy .
```

`vercel.json` rewrites every path to `/index.html` so React Router handles client-side routing.

### Google OAuth

For Google sign-in to work in production, both the InsForge dashboard's **allowed redirect URLs** and the Google Cloud Console OAuth client's **authorized redirect URIs** must include `https://<your-deploy-domain>/auth`.

## External analysis API

The edge function POSTs to:

```
POST https://analysis-agent-production.up.railway.app/analyze
Content-Type: application/json

{ "user_id": "<uuid|null>", "video_url": "<url>" }

→ 200 { "text": "..." }
```

To point at a different endpoint, edit `EXTERNAL_API_URL` in [insforge/functions/analyze-video/index.ts](insforge/functions/analyze-video/index.ts) and redeploy.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

## Design reference

The original HTML prototype lives in `design_handoff_tennismind_direction_a/`. It's a spec, not shipped code — refer to it for colors, spacing, and the broader visual direction.
