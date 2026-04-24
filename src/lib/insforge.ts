import { createClient } from '@insforge/sdk'

export const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_URL,
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
})

export type SessionRow = {
  id: string
  user_id: string
  video_url: string
  analysis_text: string | null
  created_at: string
}
