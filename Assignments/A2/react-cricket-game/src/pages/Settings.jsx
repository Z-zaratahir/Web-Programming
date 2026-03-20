const IArrow  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
const IRotate = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>

function Stepper({ label, desc, val, min, max, onchange }) {
  return (
    <div style={{ background: 'white', borderRadius: 24, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #fde68a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400e', fontSize: 17, margin: 0 }}>{label}</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 12, margin: '2px 0 0', opacity: .8 }}>{desc}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => val > min && onchange(val - 1)}
          style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', border: '2px solid #fde68a', cursor: val <= min ? 'not-allowed' : 'pointer', opacity: val <= min ? .4 : 1, fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 20, color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          -
        </button>
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: '#444', fontSize: 26, minWidth: 32, textAlign: 'center' }}>{val}</span>
        <button onClick={() => val < max && onchange(val + 1)}
          style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', border: '2px solid #fde68a', cursor: val >= max ? 'not-allowed' : 'pointer', opacity: val >= max ? .4 : 1, fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 20, color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

       <div style={{ maxWidth: 500, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div style={{ background: '#b91c1c', borderRadius: 24, padding: '20px 24px', boxShadow: '0 4px 16px rgba(185,28,28,.2)' }}>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 24, margin: '0 0 6px' }}>Match Settings</h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.9)', fontSize: 14, margin: 0 }}>Customise your school cricket match</p>
        </div>

        <Stepper label="Number of Overs" desc={`${config.overs * 6} balls per innings`} val={config.overs} min={1} max={5} onchange={v => onchange({ ...config, overs: v })} />
        <Stepper label="Wickets" desc="How many lives you get" val={config.wickets} min={1} max={5} onchange={v => onchange({ ...config, wickets: v })} />

        {/* speed selector - segmented control style like screenshot */}
        <div style={{ background: 'white', borderRadius: 24, padding: '18px 22px', border: '1px solid #fde68a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400e', fontSize: 17, margin: '0 0 4px' }}>Slider Speed</p>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 12, margin: '0 0 14px', opacity: .8 }}>How fast the Power Bar slider moves</p>
          <div style={{ display: 'flex', gap: 10, background: '#fef9e1', padding: 4, borderRadius: 16 }}>
            {['slow', 'normal', 'fast'].map(s => (
              <button key={s} onClick={() => onchange({ ...config, speed: s })}
                style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 16, textTransform: 'capitalize', background: config.speed === s ? '#f59e0b' : 'transparent', color: config.speed === s ? 'white' : '#92400e', transition: 'all .2s', boxShadow: config.speed === s ? '0 4px 12px rgba(245,158,11,.4)' : 'none' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* format summary card - matching screenshot exactly */}
        <div style={{ background: '#3d7a1f', borderRadius: 24, padding: '22px 24px', boxShadow: '0 4px 16px rgba(61,122,31,.2)' }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'white', fontSize: 18, margin: '0 0 16px' }}>Current Match Format</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { l: 'Overs', v: config.overs },
              { l: 'Balls', v: config.overs * 6 },
              { l: 'Wickets', v: config.wickets }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,.18)', borderRadius: 16, padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 32 }}>{item.v}</div>
                <div style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.85)', fontSize: 12, marginTop: 2 }}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onback} 
          style={{ width: '100%', padding: '18px', background: '#b91c1c', border: 'none', borderRadius: 24, color: 'white', fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 22, cursor: 'pointer', boxShadow: '0 6px 20px rgba(185,28,28,.35)', marginTop: 10, transition: 'transform 0.2s', letterSpacing: 1 }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          Save and Back
        </button>
      </div>
    </div>
  )
}
