export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
  } catch {
    return '—'
  }
}
