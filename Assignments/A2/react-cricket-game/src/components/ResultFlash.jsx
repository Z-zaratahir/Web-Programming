export default function resultflash({ result, commentary, visible }) {
  if (!visible || !result) return null
  const isw = result.runs === null
  const is6 = result.runs === 6
  const is4 = result.runs === 4
  const bg  = isw ? 'linear-gradient(135deg,#7f1d1d,#b91c1c)' : is6 || is4 ? 'linear-gradient(135deg,#78350f,#d97706)' : 'linear-gradient(135deg,#14532d,#16a34a)'
  const bd  = isw ? '#fca5a5' : is6 || is4 ? '#fcd34d' : '#86efac'
  const glow = isw ? 'rgba(239,68,68,.5)' : is6 || is4 ? 'rgba(251,191,36,.5)' : 'rgba(74,222,128,.4)'
  const txt = isw ? 'OUT!' : is6 ? 'SIX!' : is4 ? 'FOUR!' : result.runs === 0 ? 'DOT' : `+${result.runs}`

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 30 }}>
      <div style={{ background: bg, border: `3px solid ${bd}`, borderRadius: 22, padding: '18px 38px', textAlign: 'center', boxShadow: `0 0 45px ${glow},0 8px 28px rgba(0,0,0,.28)`, minWidth: 180, animation: 'bouncein .5s cubic-bezier(0.36,0.07,0.19,0.97) both' }}>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 54, lineHeight: 1, textShadow: '0 3px 10px rgba(0,0,0,.35)' }}>{txt}</div>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.92)', fontSize: 14, margin: '7px 0 0', lineHeight: 1.4 }}>{commentary}</p>
      </div>
      <style>{`@keyframes bouncein{0%{transform:scale(0.2);opacity:0}65%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}
