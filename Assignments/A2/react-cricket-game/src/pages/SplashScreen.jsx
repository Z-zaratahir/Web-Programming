import { useEffect, useState } from 'react'
import { useSounds } from '../hooks/useSounds.js'

export default function splashscreen({ ondone }) {
  const [progress, setprogress] = useState(0)
  const sounds = useSounds()
  const colors = ['#ef4444', '#f59e0b', '#3d7a1f', '#b45309', '#92400e', '#5aad30', '#d97706']

  useEffect(() => {
    sounds.playSplash()
    const iv = setInterval(() => {
      setprogress(p => {
        if (p >= 100) { clearInterval(iv); setTimeout(ondone, 600); return 100 }
        return p + 2
      })
    }, 40)
    return () => clearInterval(iv)
  }, [ondone])

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'linear-gradient(180deg,#fbbf24 0%,#fef3c7 45%,#7ec850 72%,#3d7a1f 100%)' }}>

      {/* clouds */}
      <svg viewBox="0 0 1200 130" style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none' }} preserveAspectRatio="xMidYMin slice">
        <ellipse cx="170" cy="52" rx="120" ry="42" fill="white" opacity=".86" />
        <ellipse cx="270" cy="40" rx="94" ry="37" fill="white" opacity=".9" />
        <ellipse cx="80" cy="63" rx="76" ry="31" fill="white" opacity=".7" />
        <ellipse cx="760" cy="36" rx="138" ry="40" fill="white" opacity=".72" />
        <ellipse cx="880" cy="26" rx="104" ry="35" fill="white" opacity=".82" />
        <ellipse cx="1110" cy="48" rx="113" ry="39" fill="white" opacity=".66" />
      </svg>

      {/* sun */}
      <div style={{ position: 'absolute', top: 22, right: 80, width: 76, height: 76, borderRadius: '50%', background: 'radial-gradient(circle,#fffde7 20%,#fbbf24 60%,#f59e0b 100%)', boxShadow: '0 0 55px rgba(251,191,36,.8)' }} />

      {/* center content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ marginBottom: 18, animation: 'floatanim 3.5s ease-in-out infinite' }}>
          <svg viewBox="0 0 60 130" style={{ width: 56, height: 126, filter: 'drop-shadow(0 5px 10px rgba(0,0,0,.2))' }}>
            <rect x="22" y="0" width="16" height="12" rx="4" fill="#92400e" />
            <rect x="18" y="12" width="24" height="88" rx="7" fill="#d97706" />
            <rect x="16" y="76" width="28" height="34" rx="9" fill="#b45309" />
            <rect x="24" y="20" width="8" height="65" rx="2" fill="rgba(255,255,255,.22)" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 'clamp(52px,9vw,86px)', color: 'white', lineHeight: 1, textShadow: '4px 5px 0 #92400e', margin: 0 }}>
          BAT-TER UP
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: '#92400e', fontSize: 13, letterSpacing: 5, marginTop: 5, opacity: .85 }}>
          THE DESI CRICKET GAME
        </p>

        {/* loading bar */}
        <div style={{ marginTop: 32, width: 240, height: 12, background: 'rgba(255,255,255,.4)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#92400e,#d97706)', borderRadius: 99, transition: 'width .06s linear' }} />
        </div>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: '#92400e', fontSize: 11, fontWeight: 700, marginTop: 7 }}>
          {progress < 100 ? 'Setting up the ground...' : 'Ready!'}
        </p>
      </div>

      {/* crowd at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, paddingBottom: 3 }}>
          {[...Array(34)].map((_, i) => {
            const c = colors[i % colors.length]
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: `crowdwave 1.3s ease-in-out ${(i % 6) * .18}s infinite` }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />
                <div style={{ width: 11, height: 20, background: c, borderRadius: '5px 5px 0 0', marginTop: 2 }} />
              </div>
            )
          })}
        </div>
        <div style={{ height: 44, background: 'linear-gradient(180deg,#5aad30,#2a5714)', width: '100%' }} />
      </div>

      <style>{`
        @keyframes floatanim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes crowdwave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  )
}
