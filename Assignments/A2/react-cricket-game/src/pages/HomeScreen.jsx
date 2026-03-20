import { useState } from 'react'

// inline icon components - no emoji
const IPlay   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const IBook   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const IGear   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const IChev   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>

export default function homescreen({ onplay, oninstructions, onsettings }) {
  const [hov, sethov] = useState(null)
  const colors = ['#ef4444', '#f59e0b', '#3d7a1f', '#b45309', '#92400e', '#5aad30', '#d97706', '#b91c1c']

  const nav = [
    { id: 'play', label: 'Play Now',    sub: 'Start batting!',   Icon: IPlay, bg: '#f59e0b', hbg: '#d97706', fn: onplay },
    { id: 'how',  label: 'How to Play', sub: 'Learn the rules',  Icon: IBook, bg: '#3d7a1f', hbg: '#2a5714', fn: oninstructions },
    { id: 'set',  label: 'Settings',    sub: 'Overs & wickets',  Icon: IGear, bg: '#b91c1c', hbg: '#991b1b', fn: onsettings },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg,#fbbf24 0%,#fef9e7 38%,#86c849 68%,#3d7a1f 100%)', overflow: 'hidden', position: 'relative' }}>

      {/* clouds */}
      <svg viewBox="0 0 1400 160" style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex: 1 }} preserveAspectRatio="xMidYMin slice">
        <ellipse cx="180" cy="58" rx="128" ry="48" fill="white" opacity=".8" />
        <ellipse cx="290" cy="44" rx="98" ry="42" fill="white" opacity=".9" />
        <ellipse cx="100" cy="68" rx="84" ry="34" fill="white" opacity=".65" />
        <ellipse cx="900" cy="40" rx="145" ry="44" fill="white" opacity=".72" />
        <ellipse cx="1055" cy="28" rx="110" ry="38" fill="white" opacity=".82" />
        <ellipse cx="1300" cy="54" rx="116" ry="42" fill="white" opacity=".65" />
      </svg>

      {/* sun */}
      <div style={{ position: 'absolute', top: 18, right: 76, width: 88, height: 88, borderRadius: '50%', background: 'radial-gradient(circle,#fffde7 20%,#fbbf24 60%,#f59e0b 100%)', boxShadow: '0 0 72px rgba(251,191,36,.7)', zIndex: 1 }} />

      {/* header */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 32px 0' }}>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: '#92400e', fontSize: 24, letterSpacing: 3 }}>BAT-TER UP</div>
      </div>

      {/* hero */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 'clamp(42px,7.5vw,80px)', color: '#92400e', lineHeight: 1, margin: 0, textShadow: '2px 4px 0 rgba(255,255,255,.5)' }}>
          BAT-TER UP!
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: '#b45309', fontSize: 13, letterSpacing: 5, opacity: .75, marginTop: 4, marginBottom: 12 }}>
          INTER-SCHOOL CHAMPIONSHIP
        </p>

        {/* mascot + quote */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginBottom: 6 }}>
          <div style={{ animation: 'floatanim 3.5s ease-in-out infinite' }}>
            <svg viewBox="0 0 140 200" style={{ width: 108, height: 155, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.2))' }}>
              <ellipse cx="70" cy="196" rx="30" ry="5" fill="rgba(0,0,0,.12)" />
              <rect x="50" y="138" width="16" height="42" rx="5" fill="#3d7a1f" />
              <rect x="72" y="138" width="16" height="42" rx="5" fill="#3d7a1f" />
              <ellipse cx="58" cy="180" rx="14" ry="5.5" fill="#1c1917" />
              <ellipse cx="80" cy="180" rx="14" ry="5.5" fill="#1c1917" />
              <rect x="40" y="82" width="60" height="60" rx="11" fill="#f59e0b" />
              <rect x="40" y="82" width="11" height="60" rx="6" fill="#d97706" />
              <rect x="89" y="82" width="11" height="60" rx="6" fill="#d97706" />
              <text x="70" y="117" textAnchor="middle" fill="white" fontSize="19" fontWeight="900" fontFamily="Baloo 2">7</text>
              <rect x="12" y="87" width="28" height="13" rx="6.5" fill="#f59e0b" />
              <rect x="100" y="87" width="28" height="13" rx="6.5" fill="#f59e0b" />
              <circle cx="20" cy="93" r="9" fill="#d97706" />
              <circle cx="120" cy="93" r="9" fill="#d97706" />
              <rect x="62" y="70" width="16" height="15" rx="4" fill="#d4a574" />
              <circle cx="70" cy="52" r="26" fill="#d4a574" />
              <ellipse cx="70" cy="38" rx="26" ry="18" fill="#ef4444" />
              <rect x="44" y="38" width="52" height="14" rx="3" fill="#ef4444" />
              <rect x="40" y="43" width="18" height="7" rx="3" fill="#b91c1c" />
              {[-12, -8, -4, 0].map((x, i) => <rect key={i} x={70 + x} y="46" width="2" height="7" rx="1" fill="#92400e" opacity=".7" />)}
              <circle cx="58" cy="54" r="4" fill="white" />
              <circle cx="82" cy="54" r="4" fill="white" />
              <circle cx="59" cy="55" r="2.2" fill="#1c1917" />
              <circle cx="83" cy="55" r="2.2" fill="#1c1917" />
              <path d="M58 65 Q70 74 82 65" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="112" y="62" width="9" height="50" rx="3" fill="#b45309" />
              <rect x="109" y="62" width="15" height="16" rx="4" fill="#d97706" />
            </svg>
          </div>
          <div style={{ marginBottom: 28, padding: '11px 18px', background: 'rgba(255,255,255,.88)', borderRadius: 14, border: '2px solid #fde68a', maxWidth: 185 }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#92400e', fontSize: 13, lineHeight: 1.4, margin: 0 }}>
              "Chhakka maaro, champion bano!"
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: '#b45309', fontSize: 11, margin: '3px 0 0', opacity: .7 }}>
              - School Cricket Proverb
            </p>
          </div>
        </div>

        {/* nav buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px', maxWidth: 500, width: '100%' }}>
          {nav.map(it => {
            const h = hov === it.id
            return (
              <button key={it.id} onClick={it.fn}
                onMouseEnter={() => sethov(it.id)} onMouseLeave={() => sethov(null)}
                style={{ flex: '1 1 130px', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 16, border: '2px solid rgba(255,255,255,.35)', background: h ? it.hbg : it.bg, color: 'white', cursor: 'pointer', transition: 'all .18s', transform: h ? 'translateY(-3px)' : 'none', boxShadow: h ? '0 7px 20px rgba(0,0,0,.18)' : '0 3px 10px rgba(0,0,0,.12)', fontFamily: "'Nunito', sans-serif" }}>
                <it.Icon />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 15, lineHeight: 1 }}>{it.label}</div>
                  <div style={{ fontSize: 10, opacity: .8, marginTop: 1 }}>{it.sub}</div>
                </div>
                <IChev />
              </button>
            )
          })}
        </div>
      </div>

      {/* crowd + ground bottom */}
      <div style={{ marginTop: 'auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, padding: '0 8px 2px' }}>
          {[...Array(36)].map((_, i) => {
            const c = colors[i % colors.length]
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: `crowdwave 1.3s ease-in-out ${(i % 6) * .18}s infinite` }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />
                <div style={{ width: 11, height: 20, background: c, borderRadius: '5px 5px 0 0', marginTop: 2 }} />
              </div>
            )
          })}
        </div>
        <div style={{ height: 48, background: 'linear-gradient(180deg,#5aad30,#2a5714)', width: '100%' }} />
      </div>

      <style>{`
        @keyframes floatanim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes crowdwave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  )
}
