// direction-a.jsx — "Court" · clean & sporty, lime accent, bold sans

const A_COLORS = {
  bg: '#fafaf7',
  card: '#ffffff',
  ink: '#0e1411',
  muted: '#6b7368',
  line: '#e6e4dd',
  lineSoft: '#efede6',
  court: '#b7c96e',   // muted tennis green
  courtSoft: '#e8eed2',
  clay: '#c87551',
};

const aCss = `
  .dir-a { font-family: var(--tm-body); color: ${A_COLORS.ink}; background: ${A_COLORS.bg}; }
  .dir-a .tm-card { background:${A_COLORS.card}; border:1px solid ${A_COLORS.line}; border-radius:14px; }
  .dir-a .tm-title { font-family: var(--tm-display); font-weight: var(--tm-display-weight); letter-spacing:-0.02em; }
  .dir-a .tm-mono { font-family: var(--tm-mono); }
  .dir-a .tm-muted { color: ${A_COLORS.muted}; }
  .dir-a .tm-chip { display:inline-flex; align-items:center; gap:6px; padding:4px 9px; border:1px solid ${A_COLORS.line}; border-radius:999px; font-size:11px; }
  .dir-a .tm-btn { appearance:none; border:0; cursor:pointer; height:34px; padding:0 14px; border-radius:999px; font: 500 12.5px var(--tm-body); display:inline-flex; align-items:center; gap:8px; }
  .dir-a .tm-btn-pri { background:${A_COLORS.ink}; color:var(--tm-accent-a); }
  .dir-a .tm-btn-acc { background:var(--tm-accent-a); color:${A_COLORS.ink}; }
  .dir-a .tm-btn-ghost { background:transparent; color:${A_COLORS.ink}; border:1px solid ${A_COLORS.line}; }
  .dir-a .tm-nav-item { display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:10px; font-size:12.5px; color:${A_COLORS.muted}; cursor:default; }
  .dir-a .tm-nav-item.active { background:${A_COLORS.ink}; color:var(--tm-accent-a); font-weight:500; }
  .dir-a .tm-dot { width:6px; height:6px; border-radius:999px; background:${A_COLORS.ink}; }
  .dir-a .tm-divider { height:1px; background:${A_COLORS.line}; }
`;

if (typeof document !== 'undefined' && !document.getElementById('dir-a-css')) {
  const s = document.createElement('style'); s.id = 'dir-a-css'; s.textContent = aCss; document.head.appendChild(s);
}

// ───────────────────────────────────────────────────────────
// Shell: Sidebar + header
function AShell({ coach, active, children }) {
  const items = [
    { id:'upload',    label:'Upload' },
    { id:'review',    label:'Review' },
    { id:'feedback',  label:'Coach feedback' },
    { id:'progress',  label:'Progress' },
    { id:'drills',    label:'Drills' },
    { id:'settings',  label:'Coach settings' },
  ];
  return (
    <div className="dir-a" style={{ width:'100%', height:'100%', display:'grid', gridTemplateColumns:'220px 1fr' }}>
      <aside style={{ borderRight:`1px solid ${A_COLORS.line}`, padding:'18px 14px', display:'flex', flexDirection:'column', gap:16, background:'#fbfbf8' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 4px 4px 6px' }}>
          <div style={{ width:24, height:24, borderRadius:6, background:A_COLORS.ink, color:'var(--tm-accent-a)', display:'grid', placeItems:'center', fontFamily:'var(--tm-mono)', fontSize:11, fontWeight:600 }}>T</div>
          <div className="tm-title" style={{ fontSize:15, letterSpacing:'-0.01em' }}>TennisMind</div>
        </div>
        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {items.map(it => (
            <div key={it.id} className={'tm-nav-item ' + (active===it.id?'active':'')}>
              <span style={{ width:5, height:5, borderRadius:999, background: active===it.id ? 'var(--tm-accent-a)' : A_COLORS.line }}/>
              {it.label}
            </div>
          ))}
        </nav>
        <div style={{ flex:1 }}/>
        <div className="tm-card" style={{ padding:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:999, background:A_COLORS.courtSoft, color:A_COLORS.ink, display:'grid', placeItems:'center', fontFamily:'var(--tm-mono)', fontSize:11, fontWeight:600 }}>{coach.initials}</div>
            <div style={{ fontSize:12 }}>
              <div style={{ fontWeight:600 }}>{coach.name}</div>
              <div className="tm-muted" style={{ fontSize:11 }}>{coach.style}</div>
            </div>
          </div>
        </div>
      </aside>
      <main style={{ padding:0, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <header style={{ height:52, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 22px', borderBottom:`1px solid ${A_COLORS.line}`, background:'#fbfbf8' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12 }}>
            <span className="tm-muted">TennisMind</span>
            <span className="tm-muted">/</span>
            <span style={{ fontWeight:500, textTransform:'capitalize' }}>{active}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span className="tm-chip tm-muted"><span className="tm-dot" style={{ background:A_COLORS.court }}/> 4 sessions this week</span>
            <button className="tm-btn tm-btn-ghost">Share</button>
            <div style={{ width:30, height:30, borderRadius:999, background:A_COLORS.ink, color:'var(--tm-accent-a)', display:'grid', placeItems:'center', fontFamily:'var(--tm-mono)', fontSize:11 }}>JM</div>
          </div>
        </header>
        <div style={{ flex:1, overflow:'hidden', position:'relative' }}>{children}</div>
      </main>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 1. Upload
function AUpload({ coach }) {
  return (
    <AShell coach={coach} active="upload">
      <div style={{ padding:'28px 32px', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:22, height:'100%', minHeight:0 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:18, minHeight:0 }}>
          <div>
            <div className="tm-mono tm-muted" style={{ fontSize:10.5, letterSpacing:'.16em', textTransform:'uppercase' }}>New session</div>
            <h1 className="tm-title" style={{ fontSize:38, margin:'6px 0 4px' }}>Drop in a playback. <span style={{ background:'var(--tm-accent-a)', padding:'0 8px', borderRadius:6 }}>Get coached.</span></h1>
            <div className="tm-muted" style={{ fontSize:13, maxWidth:520 }}>One clip at a time. Stroke-mechanics analysis on forehand, backhand and serve — with audio notes from your chosen coach in about 90 seconds.</div>
          </div>
          <div style={{ border:`1.5px dashed ${A_COLORS.ink}`, borderRadius:18, padding:'34px 26px', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', gap:14, textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:999, background:'var(--tm-accent-a)', color:A_COLORS.ink, display:'grid', placeItems:'center' }}>
              <Icon.Upload width="22" height="22"/>
            </div>
            <div>
              <div className="tm-title" style={{ fontSize:20 }}>Drop your clip here</div>
              <div className="tm-muted" style={{ fontSize:12, marginTop:4 }}>MP4, MOV, WebM · up to 2 GB · 30 s – 20 min</div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button className="tm-btn tm-btn-pri">Choose file</button>
              <button className="tm-btn tm-btn-ghost">Paste link</button>
            </div>
            <div className="tm-mono tm-muted" style={{ fontSize:10.5, marginTop:6, letterSpacing:'.08em' }}>OR DROP ANYWHERE ON THIS PANEL</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {[
              { k:'01', h:'Film from the baseline corner', t:'Hip height, whole body in frame. 50–60 fps ideal.' },
              { k:'02', h:'One stroke focus per clip',      t:'Forehand, backhand or serve — mixed clips work too.' },
              { k:'03', h:'Any court, any level',            t:'Hard, clay, indoor — lighting adapts automatically.' },
            ].map(tip => (
              <div key={tip.k} className="tm-card" style={{ padding:14 }}>
                <div className="tm-mono tm-muted" style={{ fontSize:10, letterSpacing:'.12em' }}>{tip.k}</div>
                <div style={{ fontWeight:600, fontSize:13, marginTop:6 }}>{tip.h}</div>
                <div className="tm-muted" style={{ fontSize:12, marginTop:4, lineHeight:1.45 }}>{tip.t}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14, minHeight:0 }}>
          <div className="tm-card" style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div className="tm-title" style={{ fontSize:15 }}>Today's coach</div>
              <div className="tm-mono tm-muted" style={{ fontSize:10.5, letterSpacing:'.12em' }}>CHANGE</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:999, background:'var(--tm-accent-a)', color:A_COLORS.ink, display:'grid', placeItems:'center', fontFamily:'var(--tm-mono)', fontWeight:600 }}>{coach.initials}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{coach.name} · {coach.style}</div>
                <div className="tm-muted" style={{ fontSize:12 }}>{coach.blurb}</div>
              </div>
            </div>
          </div>
          <div className="tm-card" style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
            <div className="tm-title" style={{ fontSize:15 }}>Recent uploads</div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {SESSIONS.slice(0,4).map((s, i) => (
                <div key={s.id} style={{ display:'grid', gridTemplateColumns:'64px 1fr auto', alignItems:'center', gap:12, padding:'10px 0', borderTop: i===0?'none':`1px solid ${A_COLORS.lineSoft}` }}>
                  <div style={{ width:64, height:42, borderRadius:6, overflow:'hidden' }}>
                    <VideoPlaceholder label="" tone="light"/>
                  </div>
                  <div>
                    <div style={{ fontSize:12.5, fontWeight:500 }}>{s.title}</div>
                    <div className="tm-mono tm-muted" style={{ fontSize:11 }}>{s.date} · {s.dur}</div>
                  </div>
                  <div className="tm-mono" style={{ fontSize:12, fontWeight:600 }}>{s.score}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:A_COLORS.courtSoft, borderRadius:12 }}>
            <div style={{ width:28, height:28, borderRadius:999, background:A_COLORS.court, display:'grid', placeItems:'center', color:'#1a2210' }}>
              <Icon.Flame width="16" height="16"/>
            </div>
            <div style={{ fontSize:12 }}>
              <div style={{ fontWeight:600 }}>6-day streak</div>
              <div className="tm-muted" style={{ fontSize:11 }}>Keep it going — upload a clip today.</div>
            </div>
          </div>
        </div>
      </div>
    </AShell>
  );
}

// ───────────────────────────────────────────────────────────
// 2. Processing
function AProcessing({ coach }) {
  const steps = [
    { k:'Ingest',        s:'done',    t:'12.4s · 1080p30'},
    { k:'Pose tracking', s:'done',    t:'287 frames · 98% keypoints'},
    { k:'Stroke segmentation', s:'active',  t:'Forehand · Backhand · Serve'},
    { k:'Mechanics analysis', s:'pending', t:''},
    { k:`${coach.name}'s voice notes`, s:'pending', t:''},
  ];
  return (
    <AShell coach={coach} active="upload">
      <div style={{ padding:'28px 32px', display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:22, height:'100%' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16, minHeight:0 }}>
          <div>
            <div className="tm-mono tm-muted" style={{ fontSize:10.5, letterSpacing:'.16em' }}>ANALYZING · session-0427.mp4</div>
            <h1 className="tm-title" style={{ fontSize:34, margin:'6px 0 0' }}>Breaking down your strokes.</h1>
            <div className="tm-muted" style={{ fontSize:13, marginTop:4 }}>Usually about 90 seconds. Grab water.</div>
          </div>
          <div className="tm-card" style={{ padding:0, overflow:'hidden', position:'relative', height:340 }}>
            <VideoPlaceholder label="PREVIEW · scrubbing frame 184 / 421" tone="light"
              overlay={
                <>
                  {/* pose skeleton */}
                  <svg viewBox="0 0 200 200" style={{ position:'absolute', inset:0, width:'100%', height:'100%', padding:'12%' }}>
                    {[['100,30','100,90'],['100,90','75,130'],['100,90','125,130'],['75,130','80,170'],['125,130','120,170'],['100,60','70,80'],['100,60','135,75']].map((p,i)=>(
                      <line key={i} x1={p[0].split(',')[0]} y1={p[0].split(',')[1]} x2={p[1].split(',')[0]} y2={p[1].split(',')[1]} stroke="var(--tm-accent-a)" strokeWidth="1.5"/>
                    ))}
                    {['100,30','100,60','100,90','70,80','135,75','75,130','125,130','80,170','120,170'].map((p,i)=>{
                      const [x,y]=p.split(',');
                      return <circle key={i} cx={x} cy={y} r="2.6" fill="var(--tm-accent-a)" stroke="#0e1411" strokeWidth="0.8"/>;
                    })}
                  </svg>
                  <div style={{ position:'absolute', left:14, top:14, fontFamily:'var(--tm-mono)', fontSize:10.5, letterSpacing:'.12em', color:'#0e1411', background:'var(--tm-accent-a)', padding:'4px 8px', borderRadius:4 }}>FOREHAND · FRAME 184</div>
                  <div style={{ position:'absolute', right:14, top:14, fontFamily:'var(--tm-mono)', fontSize:10.5, color:'rgba(0,0,0,.55)' }}>00:06 / 00:14</div>
                </>
              }/>
          </div>
          <div className="tm-card" style={{ padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
              <div className="tm-title" style={{ fontSize:15 }}>Progress</div>
              <div className="tm-mono" style={{ fontSize:12, fontWeight:600 }}>42%</div>
            </div>
            <div style={{ height:6, borderRadius:999, background:A_COLORS.lineSoft, overflow:'hidden' }}>
              <div style={{ width:'42%', height:'100%', background:A_COLORS.ink, borderRadius:999 }}/>
            </div>
          </div>
        </div>

        <div className="tm-card" style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
          <div className="tm-title" style={{ fontSize:15, marginBottom:6 }}>Pipeline</div>
          {steps.map((st, i) => {
            const color = st.s==='done' ? A_COLORS.ink : st.s==='active' ? A_COLORS.court : A_COLORS.line;
            return (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'28px 1fr auto', gap:12, alignItems:'center', padding:'10px 0', borderTop: i===0?'none':`1px solid ${A_COLORS.lineSoft}` }}>
                <div style={{ width:22, height:22, borderRadius:999, background: st.s==='done'?A_COLORS.ink:'transparent', border: st.s==='done'?'none':`1.5px solid ${color}`, color:st.s==='done'?'var(--tm-accent-a)':color, display:'grid', placeItems:'center' }}>
                  {st.s==='done' ? <Icon.Check width="12" height="12"/> : st.s==='active' ? <span style={{ width:8, height:8, borderRadius:999, background:A_COLORS.court }}/> : <span className="tm-mono" style={{ fontSize:10 }}>{i+1}</span>}
                </div>
                <div>
                  <div style={{ fontSize:12.5, fontWeight: st.s==='active'?600:500 }}>{st.k}</div>
                  {st.t && <div className="tm-mono tm-muted" style={{ fontSize:10.5, marginTop:2 }}>{st.t}</div>}
                </div>
                <div className="tm-mono tm-muted" style={{ fontSize:10.5 }}>
                  {st.s==='done' && 'OK'}
                  {st.s==='active' && 'RUNNING'}
                  {st.s==='pending' && 'QUEUED'}
                </div>
              </div>
            );
          })}
          <div className="tm-divider" style={{ margin:'8px 0' }}/>
          <div className="tm-muted" style={{ fontSize:11.5, lineHeight:1.5 }}>
            Pose tracking runs locally in your browser · voice synthesis happens server-side with {coach.name}'s trained model.
          </div>
        </div>
      </div>
    </AShell>
  );
}

// ───────────────────────────────────────────────────────────
// 3. Review (video + annotations + markers)
function AReview({ coach }) {
  const bars = waveformBars(120, 3);
  const playhead = 0.38;
  const markers = [ {x:.14, label:'Late prep', tone:'warn'}, {x:.31, label:'Good finish', tone:'ok'}, {x:.48, label:'Contact depth', tone:'warn'}, {x:.72, label:'Footwork', tone:'ok'}, {x:.88, label:'Serve toss', tone:'warn'} ];
  return (
    <AShell coach={coach} active="review">
      <div style={{ padding:'22px 28px', display:'grid', gridTemplateColumns:'1fr 320px', gap:18, height:'100%', minHeight:0 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:14, minHeight:0 }}>
          {/* video area */}
          <div className="tm-card" style={{ padding:0, overflow:'hidden', position:'relative', flex:1, minHeight:0 }}>
            <VideoPlaceholder label="session-0427.mp4 · 01:14 / 03:22" tone="light"
              overlay={
                <>
                  {/* skeleton + annotations */}
                  <svg viewBox="0 0 400 300" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                    {/* dotted swing arc */}
                    <path d="M 110 220 Q 180 120 270 130 T 330 90" stroke="var(--tm-accent-a)" strokeWidth="2.2" strokeDasharray="3 4" fill="none"/>
                    {/* racquet head speed vector */}
                    <g transform="translate(260,140)">
                      <line x1="0" y1="0" x2="46" y2="-12" stroke="#0e1411" strokeWidth="2.2"/>
                      <polygon points="46,-12 40,-16 41,-8" fill="#0e1411"/>
                    </g>
                    {/* contact point */}
                    <g>
                      <circle cx="215" cy="155" r="14" fill="none" stroke="#0e1411" strokeWidth="1.4"/>
                      <circle cx="215" cy="155" r="4" fill="#0e1411"/>
                    </g>
                    {/* hip line */}
                    <line x1="180" y1="175" x2="240" y2="170" stroke="#0e1411" strokeDasharray="3 3" strokeWidth="1"/>
                  </svg>
                  {/* annotation labels */}
                  <div style={{ position:'absolute', left:'58%', top:'32%', background:'#0e1411', color:'var(--tm-accent-a)', padding:'6px 10px', borderRadius:8, fontFamily:'var(--tm-mono)', fontSize:11 }}>
                    <span style={{ opacity:.6 }}>HEAD SPEED</span> &nbsp; 71 mph ↓
                  </div>
                  <div style={{ position:'absolute', left:'40%', top:'52%', background:'var(--tm-accent-a)', color:'#0e1411', padding:'6px 10px', borderRadius:8, fontFamily:'var(--tm-mono)', fontSize:11, fontWeight:600 }}>
                    CONTACT −6 in
                  </div>
                  <div style={{ position:'absolute', left:14, top:14, display:'flex', gap:6 }}>
                    <span className="tm-chip" style={{ background:'rgba(255,255,255,.9)', border:'none' }}>FOREHAND</span>
                    <span className="tm-chip" style={{ background:'rgba(255,255,255,.9)', border:'none' }}>CLIP 3 / 8</span>
                  </div>
                  <div style={{ position:'absolute', right:14, bottom:14, display:'flex', gap:6 }}>
                    <button className="tm-btn tm-btn-pri" style={{ height:30, padding:'0 10px' }}><Icon.Pause width="11" height="11"/> 0.5×</button>
                  </div>
                </>
              }/>
          </div>

          {/* scrubber with markers */}
          <div className="tm-card" style={{ padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <button className="tm-btn tm-btn-pri" style={{ height:38, width:38, padding:0, borderRadius:999 }}><Icon.Pause width="14" height="14"/></button>
              <div className="tm-mono" style={{ fontSize:12, fontWeight:600, minWidth:84 }}>01:14 <span className="tm-muted">/ 03:22</span></div>
              <div style={{ flex:1, position:'relative', height:40 }}>
                {/* waveform backing */}
                <div style={{ position:'absolute', inset:'10px 0', display:'flex', alignItems:'center', gap:2 }}>
                  {bars.map((b,i)=>(
                    <div key={i} style={{ flex:1, height:`${b*100}%`, background: (i/bars.length)<playhead ? A_COLORS.ink : A_COLORS.line, borderRadius:1 }}/>
                  ))}
                </div>
                {/* markers */}
                {markers.map((m,i)=>(
                  <div key={i} style={{ position:'absolute', left:`${m.x*100}%`, top:0, bottom:0, transform:'translateX(-50%)' }}>
                    <div style={{ width:2, height:'100%', background: m.tone==='warn' ? A_COLORS.clay : A_COLORS.court }}/>
                  </div>
                ))}
                {/* playhead */}
                <div style={{ position:'absolute', left:`${playhead*100}%`, top:-4, bottom:-4, width:2, background:A_COLORS.ink }}/>
              </div>
              <div className="tm-mono tm-muted" style={{ fontSize:11 }}>1.0×</div>
            </div>
            <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
              {markers.map((m,i)=>(
                <span key={i} className="tm-chip" style={{ fontSize:10.5, background: m.tone==='warn' ? '#faece4' : A_COLORS.courtSoft, borderColor:'transparent', color:'#2a241f' }}>
                  <span style={{ width:5, height:5, borderRadius:999, background: m.tone==='warn' ? A_COLORS.clay : A_COLORS.court }}/> {m.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* annotations sidebar */}
        <div className="tm-card" style={{ padding:16, display:'flex', flexDirection:'column', gap:10, minHeight:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <div className="tm-title" style={{ fontSize:15 }}>Annotations</div>
            <span className="tm-mono tm-muted" style={{ fontSize:11 }}>8 found</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, overflow:'auto' }}>
            {[
              { t:'00:14', title:'Late racquet prep', tone:'warn', body:'Unit turn begins 0.18s after split. Target: before opponent contact.' },
              { t:'00:26', title:'Clean finish wrap', tone:'ok',   body:'Racquet wraps over non-dominant shoulder. Repeatable.' },
              { t:'00:41', title:'Contact depth −6 in', tone:'warn', body:'Ball struck behind lead hip. Step-in drill recommended.' },
              { t:'01:02', title:'Recovery late',      tone:'warn', body:'Split step after opponent contact. Widen base.' },
              { t:'01:20', title:'Serve toss low',     tone:'warn', body:'Toss peaks at 92% of ideal height.' },
            ].map((a,i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:10, padding:'10px 0', borderTop: i===0?'none':`1px solid ${A_COLORS.lineSoft}` }}>
                <div className="tm-mono" style={{ fontSize:11, fontWeight:600, color: a.tone==='warn' ? A_COLORS.clay : A_COLORS.ink, width:40 }}>{a.t}</div>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:500 }}>{a.title}</div>
                  <div className="tm-muted" style={{ fontSize:11.5, lineHeight:1.45, marginTop:2 }}>{a.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AShell>
  );
}

// ───────────────────────────────────────────────────────────
// 4. Coach feedback (audio player centric)
function AFeedback({ coach }) {
  const bars = waveformBars(180, 11);
  const playhead = 0.22;
  return (
    <AShell coach={coach} active="feedback">
      <div style={{ padding:'22px 28px', display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:18, height:'100%', minHeight:0 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:14, minHeight:0 }}>
          <div>
            <div className="tm-mono tm-muted" style={{ fontSize:10.5, letterSpacing:'.16em' }}>COACH FEEDBACK · 2 min 14 s</div>
            <h1 className="tm-title" style={{ fontSize:30, margin:'6px 0 4px' }}>Three fixes. One stays.</h1>
            <div className="tm-muted" style={{ fontSize:13 }}>Your forehand will move. Backhand is close. Serve toss needs height.</div>
          </div>
          {/* headline cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
            {[
              { k:'FIX', title:'Early prep', body:'Start the take-back before opponent contact, not after.', color:A_COLORS.clay },
              { k:'FIX', title:'Contact forward', body:'Step into the ball. Strike ahead of lead hip.', color:A_COLORS.clay },
              { k:'KEEP', title:'Over-shoulder finish', body:'Your wrap is clean. Groove it with shadow swings.', color:A_COLORS.court },
            ].map((c,i)=>(
              <div key={i} className="tm-card" style={{ padding:14 }}>
                <div className="tm-mono" style={{ fontSize:10, letterSpacing:'.14em', color:c.color, fontWeight:600 }}>{c.k}</div>
                <div style={{ fontWeight:600, fontSize:13.5, marginTop:6 }}>{c.title}</div>
                <div className="tm-muted" style={{ fontSize:12, marginTop:4, lineHeight:1.45 }}>{c.body}</div>
              </div>
            ))}
          </div>
          {/* transcript */}
          <div className="tm-card" style={{ padding:16, flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
              <div className="tm-title" style={{ fontSize:15 }}>Transcript</div>
              <div className="tm-mono tm-muted" style={{ fontSize:11 }}>AUTO-SCROLL</div>
            </div>
            <div style={{ overflow:'auto', display:'flex', flexDirection:'column', gap:8 }}>
              {TRANSCRIPT.map((l,i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'52px 1fr', gap:10, padding:'4px 0', background: i===1 ? '#fbfbe8' : 'transparent', borderRadius:6 }}>
                  <div className="tm-mono tm-muted" style={{ fontSize:11, paddingTop:2 }}>{l.t}</div>
                  <div style={{ fontSize:13, lineHeight:1.5 }}>{l.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* floating-style audio player */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, minHeight:0 }}>
          <div className="tm-card" style={{ padding:20, background: A_COLORS.ink, color:'#fff', borderColor:A_COLORS.ink }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:52, height:52, borderRadius:999, background:'var(--tm-accent-a)', color:A_COLORS.ink, display:'grid', placeItems:'center', fontFamily:'var(--tm-mono)', fontWeight:700, fontSize:14 }}>{coach.initials}</div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:600 }}>{coach.name}'s notes · session-0427</div>
                <div style={{ fontSize:11.5, opacity:.6 }}>{coach.style}</div>
              </div>
              <div style={{ flex:1 }}/>
              <button className="tm-btn" style={{ background:'rgba(255,255,255,0.08)', color:'#fff' }}>1.0×</button>
            </div>

            {/* waveform */}
            <div style={{ display:'flex', alignItems:'center', gap:2, height:74, marginTop:16 }}>
              {bars.map((b,i)=>{
                const pct = i/bars.length;
                const active = pct < playhead;
                return <div key={i} style={{ flex:1, height:`${b*100}%`, background: active ? 'var(--tm-accent-a)' : 'rgba(255,255,255,0.22)', borderRadius:1 }}/>;
              })}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontFamily:'var(--tm-mono)', fontSize:11, opacity:.7 }}>
              <span>00:29</span><span>2:14</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
              <div style={{ display:'flex', gap:10 }}>
                <button className="tm-btn" style={{ background:'rgba(255,255,255,0.08)', color:'#fff', height:30, width:30, padding:0, borderRadius:999 }}>‹‹</button>
                <button className="tm-btn" style={{ background:'var(--tm-accent-a)', color:A_COLORS.ink, height:40, width:40, padding:0, borderRadius:999 }}><Icon.Play width="16" height="16"/></button>
                <button className="tm-btn" style={{ background:'rgba(255,255,255,0.08)', color:'#fff', height:30, width:30, padding:0, borderRadius:999 }}>››</button>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'var(--tm-mono)', fontSize:11 }}>
                <Icon.Mic width="13" height="13" style={{ opacity:.7 }}/> <span style={{ opacity:.7 }}>VOICE · EN-US</span>
              </div>
            </div>
          </div>
          <div className="tm-card" style={{ padding:16 }}>
            <div className="tm-title" style={{ fontSize:15, marginBottom:10 }}>By the numbers</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {METRICS.map((m,i)=>(
                <div key={i} style={{ padding:'10px 12px', background:'#fbfbf8', border:`1px solid ${A_COLORS.lineSoft}`, borderRadius:10 }}>
                  <div className="tm-mono tm-muted" style={{ fontSize:10.5, letterSpacing:'.12em' }}>{m.k.toUpperCase()}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:4, marginTop:2 }}>
                    <span className="tm-title" style={{ fontSize:22 }}>{m.v}</span>
                    <span className="tm-mono tm-muted" style={{ fontSize:11 }}>{m.u}</span>
                  </div>
                  <div className="tm-mono" style={{ fontSize:10.5, marginTop:4, color: m.d.includes('\u2193')?A_COLORS.clay:A_COLORS.ink }}>{m.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="tm-btn tm-btn-acc" style={{ flex:1, justifyContent:'center' }}>Send to Drills <Icon.Arrow width="14" height="14"/></button>
            <button className="tm-btn tm-btn-ghost">Export</button>
          </div>
        </div>
      </div>
    </AShell>
  );
}

// ───────────────────────────────────────────────────────────
// 5. Progress
function AProgress({ coach }) {
  // stacked area points (score over 8 weeks)
  const pts = [62, 64, 63, 66, 68, 67, 70, 72];
  const W = 640, H = 180, pad = 12;
  const path = pts.map((v,i)=>{
    const x = pad + (i * (W-pad*2))/(pts.length-1);
    const y = H - pad - ((v-55)/25)*(H - pad*2);
    return `${i===0?'M':'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  const area = path + ` L ${W-pad} ${H-pad} L ${pad} ${H-pad} Z`;
  return (
    <AShell coach={coach} active="progress">
      <div style={{ padding:'22px 28px', display:'flex', flexDirection:'column', gap:16, height:'100%', minHeight:0, overflow:'auto' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <div>
            <div className="tm-mono tm-muted" style={{ fontSize:10.5, letterSpacing:'.16em' }}>PROGRESS · APR</div>
            <h1 className="tm-title" style={{ fontSize:30, margin:'6px 0 0' }}>You\u2019re trending up.</h1>
            <div className="tm-muted" style={{ fontSize:13, marginTop:4 }}>Forehand consistency +12% since first upload. Serve unchanged.</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {['7d','30d','90d','All'].map((r,i)=>(
              <button key={r} className="tm-btn tm-btn-ghost" style={{ background: i===1?A_COLORS.ink:'transparent', color: i===1?'var(--tm-accent-a)':A_COLORS.ink, border: i===1?'none':`1px solid ${A_COLORS.line}` }}>{r}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr', gap:14 }}>
          <div className="tm-card" style={{ padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div className="tm-title" style={{ fontSize:15 }}>Overall score</div>
              <div className="tm-mono" style={{ fontSize:11, color:A_COLORS.muted }}>8 WEEKS</div>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginTop:4 }}>
              <span className="tm-title" style={{ fontSize:44 }}>72</span>
              <span className="tm-mono" style={{ background:'var(--tm-accent-a)', color:A_COLORS.ink, padding:'2px 8px', borderRadius:999, fontSize:11, fontWeight:600 }}>+8 vs Apr 7</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:180, marginTop:8 }}>
              <defs>
                <linearGradient id="gA" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--tm-accent-a)" stopOpacity="0.6"/>
                  <stop offset="1" stopColor="var(--tm-accent-a)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0,1,2,3].map(i=>{
                const y = pad + ((H-pad*2)/3)*i;
                return <line key={i} x1={pad} y1={y} x2={W-pad} y2={y} stroke={A_COLORS.lineSoft} strokeWidth="1"/>;
              })}
              <path d={area} fill="url(#gA)"/>
              <path d={path} stroke={A_COLORS.ink} strokeWidth="2" fill="none"/>
              {pts.map((v,i)=>{
                const x = pad + (i * (W-pad*2))/(pts.length-1);
                const y = H - pad - ((v-55)/25)*(H - pad*2);
                return <circle key={i} cx={x} cy={y} r="3" fill={A_COLORS.ink}/>;
              })}
            </svg>
          </div>
          <div className="tm-card" style={{ padding:18, display:'flex', flexDirection:'column', gap:10 }}>
            <div className="tm-title" style={{ fontSize:15 }}>By stroke</div>
            {[
              { k:'Forehand', v:78, d:+12, tone:A_COLORS.court },
              { k:'Backhand', v:71, d:+5, tone:A_COLORS.ink },
              { k:'Serve',    v:62, d:0, tone:A_COLORS.clay },
              { k:'Volleys',  v:69, d:+3, tone:A_COLORS.ink },
            ].map((r,i)=>(
              <div key={i} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ fontWeight:500 }}>{r.k}</span>
                  <span className="tm-mono">{r.v} <span className="tm-muted">{r.d>0?`+${r.d}`:r.d}</span></span>
                </div>
                <div style={{ height:6, borderRadius:999, background:A_COLORS.lineSoft, overflow:'hidden' }}>
                  <div style={{ width:`${r.v}%`, height:'100%', background: r.tone }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tm-card" style={{ padding:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
            <div className="tm-title" style={{ fontSize:15 }}>Sessions</div>
            <div className="tm-mono tm-muted" style={{ fontSize:11 }}>{SESSIONS.length} TOTAL</div>
          </div>
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'64px 80px 1fr 100px 90px 70px', gap:12, padding:'8px 0', borderBottom:`1px solid ${A_COLORS.line}`, fontSize:10.5, fontFamily:'var(--tm-mono)', letterSpacing:'.12em', color:A_COLORS.muted }}>
              <div></div><div>DATE</div><div>TITLE</div><div>DURATION</div><div>SCORE</div><div>Δ</div>
            </div>
            {SESSIONS.map((s,i)=>(
              <div key={s.id} style={{ display:'grid', gridTemplateColumns:'64px 80px 1fr 100px 90px 70px', gap:12, padding:'10px 0', borderBottom:`1px solid ${A_COLORS.lineSoft}`, alignItems:'center' }}>
                <div style={{ width:60, height:36, borderRadius:6, overflow:'hidden' }}><VideoPlaceholder label=""/></div>
                <div className="tm-mono" style={{ fontSize:11.5 }}>{s.date}</div>
                <div style={{ fontSize:12.5, fontWeight:500 }}>{s.title}</div>
                <div className="tm-mono tm-muted" style={{ fontSize:11.5 }}>{s.dur}</div>
                <div className="tm-mono" style={{ fontSize:13, fontWeight:600 }}>{s.score}</div>
                <div className="tm-mono" style={{ fontSize:11.5, color: s.delta==null ? A_COLORS.muted : s.delta>0 ? '#3b7a1a' : A_COLORS.clay }}>
                  {s.delta==null ? '—' : (s.delta>0 ? `+${s.delta}` : s.delta)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AShell>
  );
}

// ───────────────────────────────────────────────────────────
// 6. Drills
function ADrills({ coach }) {
  return (
    <AShell coach={coach} active="drills">
      <div style={{ padding:'22px 28px', display:'grid', gridTemplateColumns:'1fr 300px', gap:18, height:'100%', minHeight:0 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:14, minHeight:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div>
              <div className="tm-mono tm-muted" style={{ fontSize:10.5, letterSpacing:'.16em' }}>DRILLS · FROM APR 22 SESSION</div>
              <h1 className="tm-title" style={{ fontSize:30, margin:'6px 0 4px' }}>Your next practice, planned.</h1>
              <div className="tm-muted" style={{ fontSize:13 }}>42 minutes · targets the two biggest gaps from your last upload.</div>
            </div>
            <button className="tm-btn tm-btn-acc">Start practice <Icon.Arrow width="14" height="14"/></button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, overflow:'auto' }}>
            {DRILLS.map((d,i)=>(
              <div key={d.id} className="tm-card" style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div className="tm-mono" style={{ fontSize:10.5, letterSpacing:'.12em', padding:'3px 8px', borderRadius:999, background: d.level==='Core'?'var(--tm-accent-a)':d.level==='Warm-up'?A_COLORS.courtSoft:'#f4f4ef', color:A_COLORS.ink }}>
                    {d.level.toUpperCase()}
                  </div>
                  <div className="tm-mono tm-muted" style={{ fontSize:11 }}>{d.focus.toUpperCase()}</div>
                </div>
                <div style={{ fontWeight:600, fontSize:15 }}>{d.name}</div>
                <div style={{ height:70, borderRadius:8, overflow:'hidden', border:`1px solid ${A_COLORS.lineSoft}` }}>
                  <CourtDiagram stroke="#0e1411" tone={A_COLORS.courtSoft} bg="#fff" height={70}
                    shots={i===0 ? [{ d:'M 45 100 L 165 40', color:A_COLORS.clay }] :
                           i===1 ? [{ d:'M 45 100 L 175 55', color:'#0e1411' }] :
                           i===2 ? [{ d:'M 55 90 Q 110 20 160 90', color:A_COLORS.clay }] :
                                   [{ d:'M 35 100 L 190 80', color:'#0e1411' }]}/>
                </div>
                <div className="tm-muted" style={{ fontSize:12, lineHeight:1.45 }}>{d.why}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto' }}>
                  <div className="tm-mono" style={{ fontSize:11 }}><span className="tm-muted">TIME</span> {d.mins} min · <span className="tm-muted">REPS</span> {d.reps}</div>
                  <button className="tm-btn tm-btn-ghost" style={{ height:28, padding:'0 10px', fontSize:11 }}>Open</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tm-card" style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
          <div className="tm-title" style={{ fontSize:15 }}>Practice plan</div>
          <div className="tm-muted" style={{ fontSize:12 }}>Sequenced to flow physiologically · warm-up → core → recovery.</div>
          <div className="tm-divider" style={{ margin:'4px 0' }}/>
          {DRILLS.map((d,i)=>(
            <div key={d.id} style={{ display:'grid', gridTemplateColumns:'26px 1fr auto', gap:10, alignItems:'center', padding:'6px 0', borderTop: i===0?'none':`1px solid ${A_COLORS.lineSoft}` }}>
              <div className="tm-mono" style={{ fontSize:11, color:A_COLORS.muted }}>0{i+1}</div>
              <div>
                <div style={{ fontSize:12.5, fontWeight:500 }}>{d.name}</div>
                <div className="tm-mono tm-muted" style={{ fontSize:10.5 }}>{d.focus.toUpperCase()}</div>
              </div>
              <div className="tm-mono" style={{ fontSize:11.5, fontWeight:600 }}>{d.mins}m</div>
            </div>
          ))}
          <div className="tm-divider" style={{ margin:'4px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
            <span className="tm-muted">Total</span>
            <span style={{ fontWeight:600 }} className="tm-mono">42 min</span>
          </div>
          <button className="tm-btn tm-btn-pri" style={{ justifyContent:'center', marginTop:6 }}>Add to calendar</button>
        </div>
      </div>
    </AShell>
  );
}

// ───────────────────────────────────────────────────────────
// 7. Settings — coach picker + voice
function ASettings({ coach }) {
  return (
    <AShell coach={coach} active="settings">
      <div style={{ padding:'26px 32px', display:'flex', flexDirection:'column', gap:18, maxWidth:900, height:'100%', minHeight:0, overflow:'auto' }}>
        <div>
          <div className="tm-mono tm-muted" style={{ fontSize:10.5, letterSpacing:'.16em' }}>COACH SETTINGS</div>
          <h1 className="tm-title" style={{ fontSize:30, margin:'6px 0 4px' }}>Pick a voice that pushes you.</h1>
          <div className="tm-muted" style={{ fontSize:13 }}>Every session you can switch. They all see the same video.</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          {COACHES.map(c => {
            const active = c.id === coach.id;
            return (
              <div key={c.id} className="tm-card" style={{
                padding:16, display:'flex', flexDirection:'column', gap:10,
                borderColor: active ? A_COLORS.ink : A_COLORS.line,
                background: active ? A_COLORS.ink : A_COLORS.card,
                color: active ? '#fff' : A_COLORS.ink,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:44, height:44, borderRadius:999, background:'var(--tm-accent-a)', color:A_COLORS.ink, display:'grid', placeItems:'center', fontFamily:'var(--tm-mono)', fontWeight:700 }}>{c.initials}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14 }}>{c.name}</div>
                    <div style={{ fontSize:11.5, opacity: active ? 0.7 : 1, color: active ? '#fff' : A_COLORS.muted }}>{c.style}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, lineHeight:1.45, opacity: active ? 0.85 : 1, color: active ? '#fff' : A_COLORS.muted }}>{c.blurb}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {['Firm','Bilingual','90s avg'].map((tag,i)=>(
                    <span key={i} className="tm-chip" style={{ borderColor: active ? 'rgba(255,255,255,0.2)' : A_COLORS.line, color: active ? '#fff' : A_COLORS.muted, fontSize:10.5 }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:'auto' }}>
                  <button className="tm-btn" style={{
                    background: active ? 'var(--tm-accent-a)' : A_COLORS.ink,
                    color: active ? A_COLORS.ink : 'var(--tm-accent-a)',
                    flex:1, justifyContent:'center'
                  }}>{active ? 'Selected' : 'Select'}</button>
                  <button className="tm-btn" style={{
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: active ? '#fff' : A_COLORS.ink,
                    border: active ? 'none' : `1px solid ${A_COLORS.line}`,
                    width:36, padding:0, justifyContent:'center'
                  }}><Icon.Play width="13" height="13"/></button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tm-card" style={{ padding:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div>
            <div className="tm-title" style={{ fontSize:15, marginBottom:10 }}>Voice</div>
            {[
              { k:'Pace',      v:'Natural', opts:['Slow','Natural','Fast'] },
              { k:'Tone',      v:'Direct',  opts:['Warm','Direct','Clinical'] },
              { k:'Language',  v:'English', opts:['English','Español','Français'] },
            ].map((row,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderTop: i===0?'none':`1px solid ${A_COLORS.lineSoft}` }}>
                <div style={{ fontSize:12.5 }}>{row.k}</div>
                <div style={{ display:'flex', gap:4, background:A_COLORS.lineSoft, borderRadius:999, padding:3 }}>
                  {row.opts.map((o,j)=>(
                    <span key={o} className="tm-mono" style={{ fontSize:10.5, padding:'4px 9px', borderRadius:999, background: o===row.v ? A_COLORS.ink : 'transparent', color: o===row.v ? 'var(--tm-accent-a)' : A_COLORS.ink }}>{o}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="tm-title" style={{ fontSize:15, marginBottom:10 }}>Focus areas</div>
            {[
              { k:'Forehand mechanics', on:true },
              { k:'Backhand mechanics', on:true },
              { k:'Serve mechanics',    on:true },
              { k:'Footwork (beta)',    on:false },
              { k:'Strategy tips',      on:false },
            ].map((row,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderTop: i===0?'none':`1px solid ${A_COLORS.lineSoft}` }}>
                <div style={{ fontSize:12.5 }}>{row.k}</div>
                <div style={{ width:34, height:20, borderRadius:999, background: row.on ? A_COLORS.ink : A_COLORS.line, position:'relative' }}>
                  <div style={{ position:'absolute', top:2, left: row.on? 16 : 2, width:16, height:16, borderRadius:999, background: row.on ? 'var(--tm-accent-a)' : '#fff', transition:'left .15s' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AShell>
  );
}

// Export direction namespace
window.DirA = {
  Upload: AUpload,
  Processing: AProcessing,
  Review: AReview,
  Feedback: AFeedback,
  Progress: AProgress,
  Drills: ADrills,
  Settings: ASettings,
};
