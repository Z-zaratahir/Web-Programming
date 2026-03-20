import { useState, useCallback } from 'react'

import SplashScreen  from './pages/SplashScreen.jsx'
import HomeScreen    from './pages/HomeScreen.jsx'
import Instructions  from './pages/Instructions.jsx'
import Settings      from './pages/Settings.jsx'
import GameScreen    from './pages/GameScreen.jsx'

// screens: splash | home | instructions | settings | game
export default function app() {
  const [screen, setscreen] = useState('splash')
  const [config, setconfig] = useState({ overs: 2, wickets: 2, speed: 'normal' })

  const gotohome         = useCallback(() => setscreen('home'), [])
  const gotoinstructions = useCallback(() => setscreen('instructions'), [])
  const gotosettings     = useCallback(() => setscreen('settings'), [])
  const gotogame         = useCallback(() => setscreen('game'), [])

  if (screen === 'splash')       return <SplashScreen ondone={gotohome} />
  if (screen === 'instructions') return <Instructions onback={gotohome} />
  if (screen === 'settings')     return <Settings config={config} onchange={setconfig} onback={gotohome} />
  if (screen === 'game')         return <GameScreen onback={gotohome} config={config} />

  return (
    <HomeScreen
      onplay={gotogame}
      oninstructions={gotoinstructions}
      onsettings={gotosettings}
    />
  )
}
