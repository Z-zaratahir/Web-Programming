// power bar - slider is purely positional, no randomness
export default function powerbar({ probs, sliderpos, onshot, gamephase }) {
  let cum = 0
  const segs = probs.map(p => { const s = cum; cum += p.prob; return { ...p, start: s } })
  const canclick = gamephase === 'bowling'

  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: '#92400e', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>Power Bar</span>
        <span style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 10 }}>
          {canclick ? 'Click bar to play shot!' : gamephase === 'idle' ? 'Bowl first' : 'Wait...'}
        </span>
      </div>

      {/* slider indicator arrow */}
      <div style={{ position: 'relative', height: 10, marginBottom: 2 }}>
        <div style={{ position: 'absolute', left: `${sliderpos}%`, transform: 'translateX(-50%)' }}>
          <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '8px solid #92400e' }} />
        </div>
      </div>

      {/* bar */}
      <div onClick={canclick ? onshot : undefined}
        style={{ position: 'relative', display: 'flex', height: 48, borderRadius: 13, overflow: 'hidden', border: '2px solid #fde68a', cursor: canclick ? 'pointer' : 'not-allowed', boxShadow: '0 3px 12px rgba(0,0,0,.1),inset 0 2px 0 rgba(255,255,255,.35)' }}>

        {segs.map((seg, i) => (
          <div key={i} style={{ width: `${seg.prob * 100}%`, background: seg.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRight: i < segs.length - 1 ? '1.5px solid rgba(255,255,255,.28)' : 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(255,255,255,.2) 0%,transparent 55%)', pointerEvents: 'none' }} />
            <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: seg.prob >= .1 ? 13 : 10, textShadow: '0 1px 3px rgba(0,0,0,.45)', zIndex: 1 }}>{seg.label}</span>
            {seg.prob >= .08 && <span style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.85)', fontSize: 9, zIndex: 1 }}>{Math.round(seg.prob * 100)}%</span>}
          </div>
        ))}

        {/* moving slider line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${sliderpos}%`, transform: 'translateX(-50%)', width: 3, background: 'white', boxShadow: '0 0 9px 2px rgba(255,255,255,.9)', zIndex: 20, pointerEvents: 'none' }} />
      </div>

      {/* probability scale */}
      <div style={{ position: 'relative', height: 14, marginTop: 3 }}>
        {segs.map((seg, i) => (
          <span key={i} style={{ position: 'absolute', left: `${seg.start * 100}%`, transform: 'translateX(-50%)', fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 8.5, top: 1 }}>
            {seg.start === 0 ? '0' : seg.start.toFixed(2)}
          </span>
        ))}
        <span style={{ position: 'absolute', right: 0, fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 8.5, top: 1 }}>1.00</span>
      </div>
    </div>
  )
}
