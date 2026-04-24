// app.jsx — Canvas shell + Tweaks wiring for both directions

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "typePairing": "sporty",
  "density": "regular",
  "coach": "marin",
  "accentA": "#d9f16b",
  "accentB": "#ff7a1a"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Typography pairings
  const typePairs = {
    sporty:    { display: 'Inter', body: 'Inter', mono: '"Geist Mono", monospace', displayWeight: 700 },
    editorial: { display: '"Fraunces", serif', body: 'Inter', mono: '"Geist Mono", monospace', displayWeight: 500 },
    technical: { display: '"Geist", Inter, sans-serif', body: '"Geist", Inter, sans-serif', mono: '"Geist Mono", monospace', displayWeight: 600 },
    contrast:  { display: '"Instrument Serif", serif', body: 'Inter', mono: '"Geist Mono", monospace', displayWeight: 400 },
  };
  const type = typePairs[t.typePairing] || typePairs.sporty;

  // Density scales
  const densityMap = {
    compact: { unit: 10, text: 12.5, title: 22, pad: 12, gap: 8 },
    regular: { unit: 12, text: 13.5, title: 26, pad: 16, gap: 12 },
    comfy:   { unit: 14, text: 14.5, title: 30, pad: 20, gap: 16 },
  };
  const density = densityMap[t.density] || densityMap.regular;

  // Inject CSS variables on root
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--tm-display', type.display);
    root.style.setProperty('--tm-body', type.body);
    root.style.setProperty('--tm-mono', type.mono);
    root.style.setProperty('--tm-display-weight', String(type.displayWeight));
    root.style.setProperty('--tm-text', density.text + 'px');
    root.style.setProperty('--tm-title', density.title + 'px');
    root.style.setProperty('--tm-pad', density.pad + 'px');
    root.style.setProperty('--tm-gap', density.gap + 'px');
    root.style.setProperty('--tm-accent-a', t.accentA);
    root.style.setProperty('--tm-accent-b', t.accentB);
  }, [t.typePairing, t.density, t.accentA, t.accentB]);

  const coach = COACHES.find(c => c.id === t.coach) || COACHES[0];

  // Artboard dimensions — laptop-ish, shared
  const W = 1180, H = 760;

  return (
    <>
      <DesignCanvas>
        <DCSection id="direction-a" title="Direction A · Court" subtitle="Clean & sporty — lime accent, bold type, tennis-club feel">
          <DCArtboard id="a-upload"    label="A · Upload"           width={W} height={H}><DirA.Upload   coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="a-processing" label="A · Processing"      width={W} height={H}><DirA.Processing coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="a-review"    label="A · Video + annotations" width={W} height={H}><DirA.Review  coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="a-feedback"  label="A · Coach feedback (audio)" width={W} height={H}><DirA.Feedback coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="a-progress"  label="A · Progress"         width={W} height={H}><DirA.Progress coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="a-drills"    label="A · Drills"           width={W} height={H}><DirA.Drills   coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="a-settings"  label="A · Coach settings"   width={W} height={H}><DirA.Settings coach={coach} density={density}/></DCArtboard>
        </DCSection>

        <DCSection id="direction-b" title="Direction B · Telemetry" subtitle="Technical & data-forward — dark, monospace, chart-heavy">
          <DCArtboard id="b-upload"    label="B · Upload"           width={W} height={H}><DirB.Upload   coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="b-processing" label="B · Processing"      width={W} height={H}><DirB.Processing coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="b-review"    label="B · Video + annotations" width={W} height={H}><DirB.Review  coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="b-feedback"  label="B · Coach feedback (audio)" width={W} height={H}><DirB.Feedback coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="b-progress"  label="B · Progress"         width={W} height={H}><DirB.Progress coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="b-drills"    label="B · Drills"           width={W} height={H}><DirB.Drills   coach={coach} density={density}/></DCArtboard>
          <DCArtboard id="b-settings"  label="B · Coach settings"   width={W} height={H}><DirB.Settings coach={coach} density={density}/></DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Typography" />
        <TweakSelect label="Pairing" value={t.typePairing}
          options={[
            { value:'sporty',    label:'Sporty (Inter)'},
            { value:'editorial', label:'Editorial (Fraunces + Inter)'},
            { value:'technical', label:'Technical (Geist)'},
            { value:'contrast',  label:'High contrast (Instrument Serif)'},
          ]}
          onChange={(v) => setTweak('typePairing', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density}
          options={['compact','regular','comfy']}
          onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Coach persona" />
        <TweakRadio label="Voice" value={t.coach}
          options={COACHES.map(c => ({ value: c.id, label: c.name }))}
          onChange={(v) => setTweak('coach', v)} />
        <TweakSection label="Accent colors" />
        <TweakColor label="Direction A" value={t.accentA} onChange={(v)=>setTweak('accentA', v)} />
        <TweakColor label="Direction B" value={t.accentB} onChange={(v)=>setTweak('accentB', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
