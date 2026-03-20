import { useEffect, useState, useRef } from 'react'
import { Target } from 'lucide-react'
import { speedmap } from '../utils/constants'

export default function PowerBar({ probs, sliderRef, onshot, gamephase, speed = 'normal' }) {
  const [sliderpos, setSliderpos] = useState(0)
  const dirRef = useRef(1)
  const animFrame = useRef(null)

  useEffect(() => {
    if (gamephase !== 'bowling') {
      if (gamephase === 'idle') {
        setSliderpos(0)
        if (sliderRef) sliderRef.current = 0
      }
      return
    }

    const spd = speedmap[speed] || 0.52
    const tick = () => {
      setSliderpos(prev => {
        let next = prev + dirRef.current * spd
        if (next >= 100) { next = 100; dirRef.current = -1 }
        if (next <= 0)   { next = 0;   dirRef.current = 1  }
        if (sliderRef) sliderRef.current = next
        return next
      })
      animFrame.current = requestAnimationFrame(tick)
    }

    animFrame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame.current)
  }, [gamephase, speed, sliderRef])

  const cum = 0;
  let runningCum = 0;
  const segs = probs.map(p => { 
    const s = runningCum; 
    runningCum += p.prob; 
    return { ...p, start: s }; 
  });

  const canclick = gamephase === 'bowling';

  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: '#92400e', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>Power Bar</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#b45309', fontSize: 11, fontFamily: "'Nunito', sans-serif" }}>
          <Target size={11} color="#b45309" strokeWidth={3} />
          <span>{canclick ? 'Click bar to play shot!' : gamephase === 'idle' ? 'Bowl first' : 'Wait...'}</span>
        </div>
      </div>

      {/* slider indicator arrow */}
      <div style={{ position: 'relative', height: 12, marginBottom: 2 }}>
        <div style={{ position: 'absolute', left: `${sliderpos}%`, transform: 'translateX(-50%)', zIndex: 30 }}>
          <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #92400e' }} />
        </div>
      </div>

      {/* bar */}
      <div onClick={canclick ? onshot : undefined}
        style={{ position: 'relative', display: 'flex', height: 44, borderRadius: 12, overflow: 'hidden', border: '2px solid #fde68a', cursor: canclick ? 'pointer' : 'not-allowed', boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.4)' }}>

        {segs.map((seg, i) => (
          <div key={i} style={{ width: `${seg.prob * 100}%`, background: seg.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRight: i < segs.length - 1 ? '1.5px solid rgba(255,255,255,0.3)' : 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, transparent 55%)', pointerEvents: 'none' }} />
            <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: seg.prob >= 0.1 ? 13 : 9, textShadow: '0 1px 4px rgba(0,0,0,0.5)', zIndex: 1 }}>{seg.label}</span>
          </div>
        ))}

        {/* slider line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${sliderpos}%`, transform: 'translateX(-50%)', width: 3, background: 'white', boxShadow: '0 0 10px 3px rgba(255,255,255,0.9)', zIndex: 20, pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

