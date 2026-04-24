import Vapi from '@vapi-ai/web'

let client: Vapi | null = null

export function getVapi(): Vapi {
  if (client) return client
  const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY
  if (!publicKey) {
    throw new Error('VITE_VAPI_PUBLIC_KEY is not set')
  }
  client = new Vapi(publicKey)
  return client
}

export function getAssistantId(): string {
  const id = import.meta.env.VITE_VAPI_ASSISTANT_ID
  if (!id) {
    throw new Error('VITE_VAPI_ASSISTANT_ID is not set')
  }
  return id
}

export function vapiConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_VAPI_PUBLIC_KEY && import.meta.env.VITE_VAPI_ASSISTANT_ID,
  )
}
