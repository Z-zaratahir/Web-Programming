const ITrophy = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
const IHome   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IRotate = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>

export default function gameover({ runs, wickets, ballsbowled, totalballs, totalwickets, bestscore, onrestart, onhome }) {
  const sr     = ballsbowled > 0 ? ((runs / ballsbowled) * 100).toFixed(1) : '0.0'
  const allout = wickets >= totalwickets
  const isnb   = runs > bestscore
  let rating, rc
  if      (runs >= 80) { rating = 'Legendary Batsman!'; rc = '#fbbf24' }
  else if (runs >= 60) { rating = 'Excellent Knock!';   rc = '#86efac' }
  else if (runs >= 40) { rating = 'Good Innings!';      rc = '#fde68a' }
  else if (runs >= 20) { rating = 'Decent Knock';       rc = '#fca5a5' }
  else                 { rating = 'Needs Practice';     rc = '#f87171' }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(92,40,5,.78)', backdropFilter: 'blur(5px)' }}>
      <div style={{ width: '100%', maxWidth: 380, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(160deg,#92400e 0%,#b45309 55%,#d97706 100%)', boxShadow: '0 18px 50px rgba(0,0,0,.4)', animation: 'bouncein .5s cubic-bezier(0.36,0.07,0.19,0.97) both' }}>

        <div style={{ padding: '24px 24px 14px', textAlign: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <ITrophy />
          </div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 36, margin: 0, lineHeight: 1 }}>INNINGS OVER</h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,224,178,.9)', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', margin: '5px 0 0' }}>
            {allout ? 'All Out!' : 'Overs Completed'}
          </p>
        </div>

        <div style={{ margin: '0 20px 14px', background: 'rgba(255,255,255,.15)', borderRadius: 18, border: '1px solid rgba(255,255,255,.2)', padding: '16px 18px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 66, lineHeight: 1 }}>{runs}</div>
          <div style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.8)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginTop: 3 }}>Total Runs</div>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 17, color: rc, marginTop: 7 }}>{rating}</div>
          {isnb && <div style={{ display: 'inline-block', marginTop: 7, background: 'rgba(255,251,235,.9)', borderRadius: 99, padding: '3px 13px', fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400e', fontSize: 11 }}>NEW BEST SCORE!</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '0 20px 18px' }}>
          {[['Wickets', `${wickets}/${totalwickets}`], ['Balls', ballsbowled], ['SR', sr]].map(([l, v]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.15)', borderRadius: 14, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 20 }}>{v}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.72)', fontSize: 10, marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 9, padding: '0 20px 22px' }}>
          <button onClick={onhome} style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,.18)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IHome />
          </button>
          <button onClick={onrestart} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '12px', borderRadius: 15, background: 'white', border: 'none', cursor: 'pointer', fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: '#92400e', fontSize: 17, boxShadow: '0 3px 12px rgba(0,0,0,.14)' }}>
            <IRotate /> Play Again
          </button>
        </div>
      </div>
      <style>{`@keyframes bouncein{0%{transform:scale(0.2);opacity:0}65%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}
