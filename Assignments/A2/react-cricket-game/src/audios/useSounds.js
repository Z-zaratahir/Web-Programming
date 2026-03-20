import { useRef, useCallback } from 'react'
import crowdAudio from './dragon-studio-crowd-cheer-and-applause-406644.mp3'

// web audio sound engine - no external files needed
export function useSounds() {
  const ctx = useRef(null)
  const crowdRef = useRef(null)

  function getCtx() {
    if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)()
    return ctx.current
  }

  function tone(freq, duration, type = 'sine', gain = 0.3) {
    try {
      const ac = getCtx()
      const osc = ac.createOscillator()
      const gn  = ac.createGain()
      osc.connect(gn); gn.connect(ac.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, ac.currentTime)
      gn.gain.setValueAtTime(gain, ac.currentTime)
      gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
      osc.start(ac.currentTime); osc.stop(ac.currentTime + duration)
    } catch (e) {}
  }

  function chord(freqs, duration, type = 'triangle') {
    freqs.forEach(f => tone(f, duration, type, 0.16))
  }

  // play the crowd mp3
  const playCrowd = useCallback((vol = 0.5) => {
    try {
      if (!crowdRef.current) {
        crowdRef.current = new Audio(crowdAudio)
      }
      crowdRef.current.currentTime = 0
      crowdRef.current.volume = vol
      crowdRef.current.play().catch(e => console.log('Audio play failed:', e))
    } catch (e) {}
  }, [])

  const playSix = useCallback(() => {
    playCrowd(0.6)
    setTimeout(() => chord([523, 659, 784, 1047], 0.6), 80)
    setTimeout(() => chord([659, 784, 1047, 1319], 0.5), 270)
  }, [playCrowd])

  const playFour = useCallback(() => {
    playCrowd(0.4)
    setTimeout(() => chord([440, 554, 659], 0.5), 70)
  }, [playCrowd])

  const playWicket = useCallback(() => {
    tone(330, 0.28, 'sawtooth', 0.25)
    setTimeout(() => tone(277, 0.28, 'sawtooth', 0.22), 190)
    setTimeout(() => tone(220, 0.45, 'sawtooth', 0.18), 380)
  }, [])

  const playDot  = useCallback(() => tone(220, 0.15, 'square', 0.1), [])
  const playRuns = useCallback((r) => tone({ 1: 392, 2: 440, 3: 494 }[r] || 392, 0.32, 'triangle', 0.2), [])

  const playBowl = useCallback(() => {
    tone(110, 0.1, 'sawtooth', 0.15)
    setTimeout(() => tone(80, 0.15, 'sawtooth', 0.1), 90)
  }, [])

  const playWin = useCallback(() => {
    playCrowd(0.7)
    ;[523, 659, 784, 1047, 784, 659, 784, 1047].forEach((n, i) =>
      setTimeout(() => tone(n, 0.25, 'triangle', 0.25), 100 + i * 105)
    )
  }, [playCrowd])

  const playLose = useCallback(() => {
    ;[392, 349, 330, 294].forEach((n, i) =>
      setTimeout(() => tone(n, 0.35, 'sawtooth', 0.18), i * 180)
    )
  }, [])

  const playSplash = useCallback(() => {
    ;[261, 329, 392, 523, 659].forEach((n, i) =>
      setTimeout(() => tone(n, 0.3, 'triangle', 0.2), i * 90)
    )
  }, [])

  return { playSix, playFour, playWicket, playDot, playRuns, playBowl, playWin, playLose, playSplash }
}
