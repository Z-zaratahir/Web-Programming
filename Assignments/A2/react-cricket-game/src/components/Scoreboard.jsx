// compact floating scoreboard for game screen overlay
const ITrophy = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>

export default function scoreboard({ runs, wickets, ballsbowled, bestscore, totalballs, totalwickets }) {
  const oc  = Math.floor(ballsbowled / 6)
  const bio = ballsbowled % 6
  const bl  = totalballs - ballsbowled
  const sr  = ballsbowled > 0 ? ((runs / ballsbowled) * 100).toFixed(1) : '0.0'

  const statbox = (label, value) => (
    <div style={{ background: '#fffbeb', borderRadius: 9, padding: '6px 4px', textAlign: 'center', border: '1px solid #fde68a' }}>
      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: '#92400e', fontSize: 16, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 8, marginTop: 2, textTransform: 'uppercase', letterSpacing: .7 }}>{label}</div>
    </div>
  )

  return (
    <div style={{ background: 'rgba(255,251,235,.93)', backdropFilter: 'blur(8px)', borderRadius: 18, border: '1px solid rgba(245,158,11,.3)', boxShadow: '0 4px 20px rgba(0,0,0,.18)', overflow: 'hidden' }}>

      {/* header */}
      <div style={{ background: '#f59e0b', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <ITrophy />
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'white', fontSize: 10, letterSpacing: 2.5 }}>SCOREBOARD</span>
      </div>

      {/* main score */}
      <div style={{ padding: '10px 14px 8px', textAlign: 'center', borderBottom: '1px solid #fde68a', background: 'linear-gradient(135deg,#fffbeb,#fef3c7)' }}>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: '#92400e', fontSize: 42, lineHeight: 1 }}>
          {runs}<span style={{ fontSize: 19, color: '#d97706' }}>/{wickets}</span>
        </div>
        <div style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 8.5, letterSpacing: 2.5, marginTop: 1, textTransform: 'uppercase' }}>Runs / Wickets</div>
      </div>

      {/* stats */}
      <div style={{ padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
        {statbox('Overs', `${oc}.${bio}`)}
        {statbox('Balls Left', bl)}
        {statbox('Strike Rate', sr)}
        {statbox('Best', bestscore)}
      </div>

      {/* ball tracker */}
      <div style={{ padding: '0 10px 9px' }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Balls</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[...Array(totalballs)].map((_, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: i < ballsbowled ? '#c0392b' : '#fde68a', border: `1.5px solid ${i < ballsbowled ? '#991b1b' : '#fcd34d'}`, transition: 'background .3s' }} />
          ))}
        </div>
      </div>

      {/* wickets remaining dots */}
      <div style={{ padding: '0 10px 10px' }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Wickets Left</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[...Array(totalwickets)].map((_, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i < (totalwickets - wickets) ? '#ef4444' : 'rgba(0,0,0,.12)', border: `2px solid ${i < (totalwickets - wickets) ? '#b91c1c' : 'rgba(0,0,0,.12)'}` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
