export function waveformBars(n: number, seed = 7): number[] {
  const out: number[] = []
  let s = seed
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280
    const rnd = s / 233280
    const env = Math.sin((i / n) * Math.PI) * 0.7 + 0.3
    out.push(Math.max(0.12, rnd * env))
  }
  return out
}
