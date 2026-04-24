// shared.jsx — shared data, icons, utilities for both directions

const COACHES = [
  { id: 'marin',  name: 'Marin',  style: 'Analytical pro',  blurb: 'Technical, precise. ATP-tour coach.', initials: 'MR' },
  { id: 'nadia',  name: 'Nadia',  style: 'Warm mentor',     blurb: 'Encouraging. Grassroots specialist.',  initials: 'NP' },
  { id: 'rex',    name: 'Rex',    style: 'Drill sergeant',  blurb: 'Direct, no-nonsense. NCAA D1.',         initials: 'RK' },
];

const TRANSCRIPT = [
  { t: '00:02', speaker: 'Marin', text: 'Alright — let\u2019s start with the forehand at 0:14. Your prep is late.' },
  { t: '00:09', speaker: 'Marin', text: 'See how the racquet head drops below the wrist? That\u2019s costing you roughly 8 mph of head speed.' },
  { t: '00:18', speaker: 'Marin', text: 'Contact point is 6 inches behind the lead hip. Push it forward — step into the ball.' },
  { t: '00:26', speaker: 'Marin', text: 'Good extension on this next one. The finish wraps around the shoulder. Repeat that.' },
  { t: '00:34', speaker: 'Marin', text: 'Your backhand unit-turn is clean. Keep the non-dominant hand driving the take-back.' },
];

const DRILLS = [
  { id: 'd1', name: 'Early prep window', focus: 'Forehand', mins: 12, reps: '3 x 20', level: 'Core',     why: 'Fix late take-back timing seen in clips 0:14, 0:41, 1:02.' },
  { id: 'd2', name: 'Contact-forward step-in', focus: 'Forehand', mins: 10, reps: '4 x 15', level: 'Core',     why: 'Push contact 6" ahead of lead hip for +8 mph head speed.' },
  { id: 'd3', name: 'Shadow finish wrap',    focus: 'Follow-through', mins: 6,  reps: '3 x 25', level: 'Warm-up', why: 'Groove the over-shoulder finish for topspin consistency.' },
  { id: 'd4', name: 'Slice recovery footwork', focus: 'Backhand', mins: 14, reps: '5 x 10', level: 'Next-up', why: 'Recovery step lags after low slice — widen split step.' },
];

const SESSIONS = [
  { id: 's01', date: 'Apr 22', title: 'Baseline rally, 3 sets', dur: '14:08', score: 72, delta: +4 },
  { id: 's02', date: 'Apr 18', title: 'Serve + 1 practice',     dur: '09:42', score: 68, delta: +2 },
  { id: 's03', date: 'Apr 15', title: 'Match vs. Diego',        dur: '42:16', score: 66, delta: -1 },
  { id: 's04', date: 'Apr 11', title: 'Forehand drill block',   dur: '18:30', score: 67, delta: +3 },
  { id: 's05', date: 'Apr 07', title: 'First upload',           dur: '12:05', score: 64, delta: null },
];

const METRICS = [
  { k: 'Head speed',      v: '78', u: 'mph', d: '+3' },
  { k: 'Contact depth',   v: '-6', u: 'in',  d: '\u2193 fix' },
  { k: 'Spin rate',       v: '2.1', u: 'krpm', d: '+0.2' },
  { k: 'Court coverage',  v: '62', u: '%',   d: '+4' },
];

// Generate a waveform (stable per seed)
function waveformBars(n, seed = 7) {
  const out = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    // envelope
    const env = Math.sin((i / n) * Math.PI) * 0.7 + 0.3;
    out.push(Math.max(0.12, rnd * env));
  }
  return out;
}

// Icons
const Icon = {
  Upload: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Play:   (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z"/></svg>,
  Pause:  (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>,
  Mic:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/></svg>,
  Check:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="5 12 10 17 19 7"/></svg>,
  Arrow:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>,
  Spark:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
  Gear:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>,
  Close:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>,
  Flame:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-3 0 2 1.5 3 3 3 0-3-2-4-2-6 0-1 1-2 2-2z"/><path d="M7 14a5 5 0 0 0 10 0"/></svg>,
  Dot:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="12" cy="12" r="3"/></svg>,
};

// Court SVG diagram (reusable)
function CourtDiagram({ stroke = '#222', bg = 'transparent', tone = '#d4e6c8', shots = [], width = 220, height = 140 }) {
  // tennis court ratio ~78 x 36 ft
  return (
    <svg viewBox="0 0 220 140" width={width} height={height} style={{display:'block'}}>
      <rect x="0" y="0" width="220" height="140" fill={bg}/>
      <rect x="20" y="20" width="180" height="100" fill={tone} stroke={stroke} strokeWidth="1.2"/>
      {/* singles sidelines */}
      <line x1="36" y1="20" x2="36" y2="120" stroke={stroke} strokeWidth="0.8"/>
      <line x1="184" y1="20" x2="184" y2="120" stroke={stroke} strokeWidth="0.8"/>
      {/* service boxes */}
      <line x1="36" y1="56" x2="184" y2="56" stroke={stroke} strokeWidth="0.8"/>
      <line x1="36" y1="84" x2="184" y2="84" stroke={stroke} strokeWidth="0.8"/>
      <line x1="110" y1="56" x2="110" y2="84" stroke={stroke} strokeWidth="0.8"/>
      {/* net */}
      <line x1="20" y1="70" x2="200" y2="70" stroke={stroke} strokeWidth="1.6"/>
      <line x1="20" y1="70" x2="200" y2="70" stroke={stroke} strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6"/>
      {shots.map((s, i) => (
        <g key={i}>
          <path d={s.d} stroke={s.color || stroke} strokeWidth={s.w || 1.4} fill="none" strokeLinecap="round" opacity={s.o || 0.9}/>
          {s.from && <circle cx={s.from[0]} cy={s.from[1]} r="2" fill={s.color || stroke}/>}
          {s.to   && <circle cx={s.to[0]}   cy={s.to[1]}   r="2" fill={s.color || stroke}/>}
        </g>
      ))}
    </svg>
  );
}

// Striped placeholder for video frames
function VideoPlaceholder({ label = 'PLAYBACK · 1080p', tone = 'light', overlay, style }) {
  const isDark = tone === 'dark';
  const bg = isDark ? '#1a1a1a' : '#e8e5df';
  const stripe = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
  const fg = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  return (
    <div style={{
      position:'relative', width:'100%', height:'100%',
      background:`repeating-linear-gradient(135deg, ${bg} 0 10px, ${stripe} 10px 20px)`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'"Geist Mono", "JetBrains Mono", monospace', fontSize:10, letterSpacing:'.14em',
      color:fg, textTransform:'uppercase', overflow:'hidden',
      ...style
    }}>
      <span>{label}</span>
      {overlay}
    </div>
  );
}

Object.assign(window, { COACHES, TRANSCRIPT, DRILLS, SESSIONS, METRICS, waveformBars, Icon, CourtDiagram, VideoPlaceholder });
