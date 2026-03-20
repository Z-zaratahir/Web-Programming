import { useState, useEffect, useRef, useCallback } from 'react'

import GroundScene        from '../components/GroundScene.jsx'
import ResultFlash        from '../components/ResultFlash.jsx'
import GameOver           from '../components/GameOver.jsx'
import PowerBar           from '../components/PowerBar.jsx'
import BattingStylePicker from '../components/BattingStylePicker.jsx'
import CommentaryBox      from '../components/CommentaryBox.jsx'
import Scoreboard         from '../components/Scoreboard.jsx'
import ProbabilityGuide   from '../components/ProbabilityGuide.jsx'

import { aggressiveprobs, defensiveprobs, commentary, speedmap } from '../utils/constants.js'
import { useSounds } from '../audios/useSounds.js'

// inline icons - no external deps
const IArrow  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
const IPlay   = () => <svg width="21" height="21" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const IRotate = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>

function getoutcome(pos, probs) {
  const r = pos / 100; let c = 0
  for (const s of probs) { c += s.prob; if (r <= c + 0.0001) return s }
  return probs[probs.length - 1]
}

function pickline(label) {
  const ls = commentary[label] || commentary['0']
  return ls[Math.floor(Math.random() * ls.length)]
}

export default function gamescreen({ onback, config }) {
  const totalballs   = config.overs * 6
  const totalwickets = config.wickets

  const [runs,         setruns]         = useState(0)
  const [wickets,      setwickets]      = useState(0)
  const [ballsbowled,  setballsbowled]  = useState(0)
  const [bestscore,    setbestscore]    = useState(0)
  const [style,        setstyle]        = useState('aggressive')
  const [phase,        setphase]        = useState('idle')
  const [ballx,        setballx]        = useState(700)
  const [bally,        setbally]        = useState(252)
  const [ballvisible,  setballvisible]  = useState(false)
  const [swinging,     setswinging]     = useState(false)
  const [running,      setrunning]      = useState(false)
  const [lastresult,   setlastresult]   = useState(null)
  const [comtext,      setcomtext]      = useState('')
  const [showresult,   setshowresult]   = useState(false)
  const [showprobguide,setshowprobguide]= useState(false)
  const [ballscale,    setballscale]    = useState(1)

  const slideref = useRef(0)
  const sounds = useSounds()

  const startbowling = useCallback(() => {
    if (phase !== 'idle') return
    sounds.playBowl()
    setrunning(true); setballvisible(true); setballscale(1)
    setballx(700); setbally(252)
    setshowresult(false); setlastresult(null)

    // Delivery Phase Animation (RAF)
    let start = null
    const dur = 400 
    const step = (now) => {
      if (!start) start = now
      const p = Math.min((now - start) / dur, 1)
      setballx(700 + Math.sin(p * Math.PI) * 15) // slight curve
      setbally(252 + p * (468 - 252))
      if (p < 1) requestAnimationFrame(step)
      else { setrunning(false); setphase('bowling') }
    }
    requestAnimationFrame(step)
  }, [phase, sounds])

  const handleshot = useCallback(() => {
    if (phase !== 'bowling') return
    const probs   = style === 'aggressive' ? aggressiveprobs : defensiveprobs
    const outcome = getoutcome(slideref.current, probs)
    const line    = pickline(outcome.label)

    setphase('animating'); setswinging(true)

    // Outcome Trajectory Logic
    let targetX = 700, targetY = 468, targetScale = 1
    const run = outcome.runs
    
    if (run === 6) { 
      targetX = 400 + Math.random() * 600; targetY = -150; targetScale = 0.4
    } else if (run === 4) {
      targetX = Math.random() > 0.5 ? 1500 : -100; targetY = 300 + Math.random() * 300; targetScale = 0.8
    } else if (run === 0 || run === null) {
       targetX = 690 + Math.random() * 20; targetY = 485; // hits stumps or near
    } else {
       targetX = 200 + Math.random() * 1000; targetY = 200 + Math.random() * 400; targetScale = 0.7
    }

    let start = null
    const dur = run === 6 ? 1200 : run === 4 ? 800 : 500
    const ox = 700, oy = 468

    const step = (now) => {
      if (!start) start = now
      const p = Math.min((now - start) / dur, 1)
      
      // smoothly move to target
      setballx(ox + p * (targetX - ox))
      setbally(oy + p * (targetY - oy))
      
      // simulated height for 6s
      if (run === 6) {
        const height = Math.sin(p * Math.PI) * 1.2
        setballscale(1 + height)
      } else {
        setballscale(1 + p * (targetScale - 1))
      }

      if (p < 1) {
        requestAnimationFrame(step)
      } else {
        setswinging(false)
        setballvisible(false)
        setlastresult(outcome); setcomtext(line); setshowresult(true)

        if (outcome.runs === null)   sounds.playWicket()
        else if (outcome.runs === 6) sounds.playSix()
        else if (outcome.runs === 4) sounds.playFour()
        else if (outcome.runs === 0) sounds.playDot()
        else                         sounds.playRuns(outcome.runs)

        const nb = ballsbowled + 1
        setballsbowled(nb)
        let nr = runs, nw = wickets

        if (outcome.runs !== null) {
          nr = runs + outcome.runs; setruns(nr)
          if (nr > bestscore) setbestscore(nr)
        } else {
          nw = wickets + 1; setwickets(nw)
        }

        const isover = nb >= totalballs || nw >= totalwickets
        if (isover) {
          if (nr >= bestscore) sounds.playWin(); else sounds.playLose()
          setTimeout(() => { setshowresult(false); setphase('gameover') }, 2400)
        } else {
          setTimeout(() => {
            setshowresult(false)
            slideref.current = 0
            setphase('idle')
          }, 2400)
        }
      }
    }
    
    // small delay for swing to "connect"
    setTimeout(() => requestAnimationFrame(step), 100)
  }, [phase, style, ballsbowled, runs, wickets, bestscore, totalballs, totalwickets, sounds])

  const handlerestart = () => {
    setruns(0); setwickets(0); setballsbowled(0)
    setphase('idle'); slideref.current = 0
    setshowresult(false); setlastresult(null)
    setballvisible(false); setswinging(false); setcomtext('')
    setstyle('aggressive')
  }

  const canbowl    = phase === 'idle'
  const canbat     = phase === 'bowling'
  const isgameover = phase === 'gameover'
  const curprobs   = style === 'aggressive' ? aggressiveprobs : defensiveprobs

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* FULL SCREEN FIELD - fills entire viewport */}
      <GroundScene
        ballx={ballx} bally={bally} ballvisible={ballvisible} ballscale={ballscale}
        swinging={swinging} battingstyle={style} running={running}
      />

      <ResultFlash result={lastresult} commentary={comtext} visible={showresult} />

      {isgameover && (
        <GameOver
          runs={runs} wickets={wickets} ballsbowled={ballsbowled}
          totalballs={totalballs} totalwickets={totalwickets}
          bestscore={bestscore} onrestart={handlerestart} onhome={onback}
        />
      )}

      {/* top bar - transparent, floats over field */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', zIndex: 20, background: 'linear-gradient(180deg,rgba(0,0,0,.38) 0%,transparent 100%)' }}>
        <button onClick={onback} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IArrow />
        </button>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 20, letterSpacing: 3, textShadow: '0 2px 8px rgba(0,0,0,.45)' }}>
          BAT-TER UP
        </div>
        <button onClick={handlerestart} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IRotate />
        </button>
      </div>

      {/* LEFT FLOATING SCOREBOARD - compact overlay */}
      <div style={{ position: 'absolute', top: 58, left: 12, zIndex: 20, width: 168 }}>
        <Scoreboard
          runs={runs} wickets={wickets} ballsbowled={ballsbowled}
          bestscore={bestscore} totalballs={totalballs} totalwickets={totalwickets}
        />
      </div>

      {/* RIGHT - probability guide toggle */}
      <div style={{ position: 'absolute', top: 58, right: 12, zIndex: 20 }}>
        <button onClick={() => setshowprobguide(p => !p)}
          style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 14 }}>%</span>
        </button>
        {showprobguide && <ProbabilityGuide probs={curprobs} style={style} />}
      </div>

      {/* BOTTOM HUD - compact floating panel */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, background: 'rgba(255,251,235,.95)', backdropFilter: 'blur(10px)', borderTop: '2px solid rgba(245,158,11,.3)', boxShadow: '0 -4px 24px rgba(0,0,0,.15)' }}>
        <div style={{ padding: '9px 14px 11px', display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* batting style + bowl button */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <div style={{ flex: 1 }}>
              <BattingStylePicker style={style} onchange={setstyle} disabled={!canbowl} />
            </div>
            <button
              onClick={canbowl ? startbowling : canbat ? handleshot : undefined}
              disabled={phase === 'animating' || isgameover}
              style={{ flexShrink: 0, width: 95, borderRadius: 14, border: 'none', cursor: (phase === 'animating' || isgameover) ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: canbowl ? 'linear-gradient(135deg,#f59e0b,#d97706)' : canbat ? 'linear-gradient(135deg,#3d7a1f,#2a5714)' : '#e5e7eb', opacity: (phase === 'animating' || isgameover) ? .55 : 1, transition: 'all .18s', boxShadow: canbowl ? '0 3px 14px rgba(245,158,11,.45)' : canbat ? '0 3px 14px rgba(61,122,31,.4)' : 'none' }}>
              {canbowl ? (
                <><IPlay /><span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 14 }}>BOWL!</span></>
              ) : canbat ? (
                <><span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, color: 'white', fontSize: 22, lineHeight: 1 }}>HIT!</span><span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, color: 'rgba(255,255,255,.85)' }}>tap bar too</span></>
              ) : (
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: '#9ca3af' }}>...</span>
              )}
            </button>
          </div>

          {/* power bar */}
          <PowerBar probs={curprobs} sliderRef={slideref} onshot={handleshot} gamephase={phase} speed={config.speed} />

          {/* commentary */}
          <CommentaryBox text={comtext} />
        </div>
      </div>
    </div>
  )
}
