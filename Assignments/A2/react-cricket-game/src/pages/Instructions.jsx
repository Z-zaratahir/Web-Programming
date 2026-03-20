import { aggressiveprobs } from '../utils/constants.js'

const IArrow = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>

export default function instructions({ onback }) {
  const steps = [
    { n: '1', t: 'Pick Batting Style',   d: 'Aggressive or Defensive before each ball' },
    { n: '2', t: 'Press Bowl',           d: 'Bowler runs in and delivers' },
    { n: '3', t: 'Watch the Slider',     d: 'It bounces left and right on the Power Bar' },
    { n: '4', t: 'Click the Bar',        d: 'The zone it stops in becomes your result' },
    { n: '5', t: '12 Balls / 2 Overs',  d: 'Score max runs before overs or wickets finish' },
  ]

  return (
    <div style={{ height: '100%', background: 'linear-gradient(180deg,#fef3c7 0%,#fffbeb 100%)', overflowY: 'auto' }}>

      {/* sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#f59e0b', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 11, boxShadow: '0 3px 14px rgba(245,158,11,.3)' }}>
        <button onClick={onback} style={{ width: 38, height: 38, borderRadius: 11, background: '#d97706', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IArrow />
        </button>
        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 24, margin: 0 }}>How To Play</h1>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* overview */}
        <div style={{ background: '#f59e0b', borderRadius: 20, padding: '18px 22px' }}>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 22, margin: '0 0 8px' }}>Gully Cricket Rules</h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,.92)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            You are the batsman playing in the neighbourhood maidan. Pick your style, time your shots on the Power Bar, and score as many runs as possible before overs or wickets finish!
          </p>
        </div>

        {/* power bar explainer */}
        <div style={{ background: 'white', borderRadius: 18, padding: '16px 18px', border: '1px solid #fde68a' }}>
          <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400e', fontSize: 17, margin: '0 0 10px' }}>The Power Bar</h3>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 13, lineHeight: 1.55, margin: '0 0 12px' }}>
            A slider bounces left and right. Click when it is in the zone you want. Wider zone means more likely. The outcome is purely positional, never random.
          </p>
          <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', height: 46, border: '2px solid #fde68a' }}>
            {aggressiveprobs.map((p, i) => (
              <div key={i} style={{ width: `${p.prob * 100}%`, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: i < aggressiveprobs.length - 1 ? '1px solid rgba(255,255,255,.3)' : 'none' }}>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: p.prob >= .1 ? 13 : 10, textShadow: '0 1px 3px rgba(0,0,0,.4)' }}>{p.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 11, marginTop: 6, textAlign: 'center', opacity: .8 }}>Aggressive batting probabilities</p>
        </div>

        {/* rule cards */}
        {[
          { color: '#ef4444', title: 'Aggressive', pts: ['Wicket probability: 30%', 'Six: 20%, Four: 15%', 'High risk, big rewards'] },
          { color: '#3d7a1f', title: 'Defensive',  pts: ['Wicket probability: only 15%', 'Six: 2%, very safe', 'Mostly singles and twos'] },
          { color: '#f59e0b', title: 'Ratings',    pts: ['0-19: Needs Practice', '20-39: Decent Knock', '40-59: Good Innings', '60+: Excellent or Legendary!'] },
        ].map(r => (
          <div key={r.title} style={{ background: 'white', borderRadius: 18, padding: '15px 18px', borderLeft: `5px solid ${r.color}`, boxShadow: '0 3px 12px rgba(0,0,0,.06)' }}>
            <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400e', fontSize: 16, margin: '0 0 8px' }}>{r.title}</h3>
            {r.pts.map((p, i) => <p key={i} style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 13, margin: '0 0 3px', lineHeight: 1.4 }}>• {p}</p>)}
          </div>
        ))}

        {/* steps */}
        <div style={{ background: 'white', borderRadius: 18, padding: '16px 18px', border: '1px solid #fde68a' }}>
          <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400e', fontSize: 17, margin: '0 0 14px' }}>Step by Step</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map(s => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 13 }}>{s.n}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: '#92400e', fontSize: 14, margin: 0 }}>{s.t}</p>
                  <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 12, margin: '1px 0 0', opacity: .85 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onback} style={{ width: '100%', padding: '14px', background: '#f59e0b', border: 'none', borderRadius: 16, color: 'white', fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 19, cursor: 'pointer' }}>
          Got it! Let's Play
        </button>
      </div>
    </div>
  )
}
