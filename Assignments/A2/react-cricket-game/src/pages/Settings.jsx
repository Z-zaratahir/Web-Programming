const IArrow  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
const IRotate = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>

function stepper({ label, desc, val, min, max, onchange }) {
  return (
    <div style={{ background: 'white', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #fde68a' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400e', fontSize: 15, margin: 0 }}>{label}</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 11, margin: '1px 0 0', opacity: .8 }}>{desc}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <button onClick={() => val > min && onchange(val - 1)}
          style={{ width: 34, height: 34, borderRadius: 9, background: '#fef3c7', border: '2px solid #fde68a', cursor: val <= min ? 'not-allowed' : 'pointer', opacity: val <= min ? .4 : 1, fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 17, color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          -
        </button>
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: '#92400e', fontSize: 22, minWidth: 24, textAlign: 'center' }}>{val}</span>
        <button onClick={() => val < max && onchange(val + 1)}
          style={{ width: 34, height: 34, borderRadius: 9, background: '#fef3c7', border: '2px solid #fde68a', cursor: val >= max ? 'not-allowed' : 'pointer', opacity: val >= max ? .4 : 1, fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 17, color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          +
        </button>
      </div>
    </div>
  )
}

export default function settings({ config, onchange, onback }) {
  const reset = () => onchange({ overs: 2, wickets: 2, speed: 'normal' })

  return (
    <div style={{ height: '100%', background: 'linear-gradient(180deg,#fef3c7 0%,#fffbeb 100%)', overflowY: 'auto' }}>

      {/* sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#b91c1c', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 3px 14px rgba(185,28,28,.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <button onClick={onback} style={{ width: 38, height: 38, borderRadius: 11, background: '#991b1b', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IArrow />
          </button>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 24, margin: 0 }}>Settings</h1>
        </div>
        <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#991b1b', border: 'none', borderRadius: 10, padding: '7px 13px', color: 'white', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12 }}>
          <IRotate /> Reset
        </button>
      </div>

      <div style={{ maxWidth: 460, margin: '0 auto', padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div style={{ background: '#b91c1c', borderRadius: 20, padding: '16px 20px' }}>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 20, margin: '0 0 4px' }}>Match Settings</h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.85)', fontSize: 12, margin: 0 }}>Customise your gully cricket match</p>
        </div>

        <stepper label="Number of Overs" desc={`${config.overs * 6} balls per innings`} val={config.overs} min={1} max={5} onchange={v => onchange({ ...config, overs: v })} />
        <stepper label="Wickets" desc="How many lives you get" val={config.wickets} min={1} max={5} onchange={v => onchange({ ...config, wickets: v })} />

        {/* speed selector */}
        <div style={{ background: 'white', borderRadius: 18, padding: '14px 16px', border: '1px solid #fde68a' }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400e', fontSize: 15, margin: '0 0 3px' }}>Slider Speed</p>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 11, margin: '0 0 11px', opacity: .8 }}>How fast the Power Bar slider moves</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['slow', 'normal', 'fast'].map(s => (
              <button key={s} onClick={() => onchange({ ...config, speed: s })}
                style={{ flex: 1, padding: '9px 0', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 14, textTransform: 'capitalize', background: config.speed === s ? '#f59e0b' : '#fef3c7', color: config.speed === s ? 'white' : '#92400e', transition: 'all .15s' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* format summary */}
        <div style={{ background: '#3d7a1f', borderRadius: 18, padding: '16px 18px' }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'white', fontSize: 16, margin: '0 0 12px' }}>Current Format</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[['Overs', config.overs], ['Balls', config.overs * 6], ['Wickets', config.wickets]].map(([l, v]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,.18)', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 26 }}>{v}</div>
                <div style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.8)', fontSize: 11, marginTop: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onback} style={{ width: '100%', padding: '14px', background: '#b91c1c', border: 'none', borderRadius: 16, color: 'white', fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 19, cursor: 'pointer' }}>
          Save and Back
        </button>
      </div>
    </div>
  )
}
