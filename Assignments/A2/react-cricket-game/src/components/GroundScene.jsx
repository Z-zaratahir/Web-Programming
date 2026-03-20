// full viewport desi maidan - no manicured grass, muddy patches, chalk boundary

function bowler(running) {
  return (
    <g transform={`translate(${running ? 448 : 430},315)`} style={{ transition: 'transform .3s' }}>
      <ellipse cx={0} cy={86} rx={16} ry={4} fill="rgba(0,0,0,.1)" />
      <circle cx={0} cy={-22} r={10} fill="#d4a574" />
      <rect x={-11} y={-12} width={22} height={32} rx={6} fill="#3d7a1f" />
      <rect x={9} y={running ? -28 : -12} width={9} height={22} rx={4.5} fill="#3d7a1f" style={{ transition: 'y .2s' }} />
      <rect x={-11} y={20} width={9} height={26} rx={4} fill="#1c1917" />
      <rect x={2} y={20} width={9} height={26} rx={4} fill="#1c1917" />
      <ellipse cx={0} cy={-34} rx={12} ry={7} fill="#3d7a1f" />
      <rect x={-10} y={-30} width={20} height={7} rx={2} fill="#3d7a1f" />
      <rect x={-12} y={-26} width={9} height={6} rx={2} fill="#2a5714" />
    </g>
  )
}

function batsman(swinging, style) {
  const jc = style === 'aggressive' ? '#ef4444' : '#3d7a1f'
  const jt = style === 'aggressive' ? '#b91c1c' : '#1a4d0e'
  return (
    <g transform="translate(665,370)">
      <ellipse cx={0} cy={100} rx={28} ry={7} fill="rgba(0,0,0,.14)" />
      <rect x={-14} y={58} width={13} height={38} rx={5} fill="white" />
      <g transform={swinging ? 'rotate(-15,5,58)' : ''} style={{ transition: 'transform .15s' }}>
        <rect x={4} y={58} width={13} height={38} rx={5} fill="white" />
      </g>
      <ellipse cx={-7} cy={96} rx={14} ry={5} fill="#1c1917" />
      <ellipse cx={11} cy={96} rx={14} ry={5} fill="#1c1917" />
      <rect x={-22} y={20} width={44} height={42} rx={9} fill={jc} />
      <rect x={-22} y={20} width={10} height={42} rx={6} fill={jt} />
      <rect x={12} y={20} width={10} height={42} rx={6} fill={jt} />
      <text x={0} y={46} textAnchor="middle" fill="white" fontSize={14} fontWeight={900} fontFamily="Baloo 2">10</text>
      <rect x={-31} y={24} width={11} height={26} rx={5.5} fill={jc} />
      <circle cx={-26} cy={50} r={9} fill="#d97706" />
      <g transform={swinging ? 'rotate(-50,25,28)' : ''} style={{ transition: 'transform .15s ease-out' }}>
        <rect x={23} y={24} width={11} height={26} rx={5.5} fill={jc} />
        <circle cx={28} cy={50} r={9} fill="#d97706" />
        <rect x={24} y={26} width={8} height={8} rx={3} fill="#92400e" />
        <rect x={22} y={34} width={13} height={56} rx={5} fill="#d4a96a" />
        <rect x={22} y={34} width={13} height={16} rx={4} fill="#b45309" />
        <rect x={24} y={40} width={5} height={46} rx={2} fill="rgba(255,255,255,.22)" />
      </g>
      <rect x={-7} y={9} width={14} height={15} rx={4} fill="#d4a574" />
      <circle cx={0} cy={-3} r={13} fill="#d4a574" />
      <ellipse cx={0} cy={-10} rx={17} ry={13} fill={jc} />
      <rect x={-17} y={-8} width={34} height={12} rx={3} fill={jc} />
      <rect x={-19} y={-4} width={15} height={8} rx={3} fill={jt} />
      {[-14, -10, -6, -2].map((x, i) => <rect key={i} x={x} y={0} width={2} height={8} rx={1} fill="#92400e" opacity=".65" />)}
      <circle cx={-4} cy={-5} r={2.5} fill="#1c1917" />
      <circle cx={4} cy={-5} r={2.5} fill="#1c1917" />
    </g>
  )
}

export default function groundscene({ ballx, bally, ballvisible, swinging, battingstyle, running, ballscale = 1 }) {
  const cc = ['#ef4444', '#f59e0b', '#3d7a1f', '#b45309', '#92400e', '#5aad30', '#d97706', '#b91c1c']

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 1400 720" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="45%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#e8f5d0" />
          </linearGradient>
          <linearGradient id="groundg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fba5e" />
            <stop offset="35%" stopColor="#7aaa45" />
            <stop offset="70%" stopColor="#6b9b3a" />
            <stop offset="100%" stopColor="#4a7a20" />
          </linearGradient>
          <linearGradient id="pitchg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a05a" />
            <stop offset="50%" stopColor="#b88a40" />
            <stop offset="100%" stopColor="#9a6e28" />
          </linearGradient>
          <radialGradient id="sung" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffde7" />
            <stop offset="55%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <filter id="bglow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fsd">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity=".15" />
          </filter>
        </defs>

        {/* sky */}
        <rect width="1400" height="720" fill="url(#skyg)" />
        <circle cx="1250" cy="60" r="52" fill="url(#sung)" opacity=".95" />
        <circle cx="1250" cy="60" r="80" fill="#fbbf24" opacity=".12" />

        {/* clouds */}
        <ellipse cx="200" cy="58" rx="128" ry="44" fill="white" opacity=".82" />
        <ellipse cx="310" cy="44" rx="100" ry="38" fill="white" opacity=".88" />
        <ellipse cx="105" cy="68" rx="82" ry="32" fill="white" opacity=".7" />
        <ellipse cx="740" cy="34" rx="148" ry="40" fill="white" opacity=".68" />
        <ellipse cx="870" cy="24" rx="108" ry="36" fill="white" opacity=".8" />

        {/* compound wall + bricks */}
        <rect x="0" y="90" width="1400" height="28" fill="#c4793a" opacity=".75" />
        <rect x="0" y="82" width="1400" height="14" fill="#d98a48" opacity=".5" />
        {[...Array(50)].map((_, i) => <rect key={i} x={i * 29} y="84" width={24} height={11} rx={2} fill="#b86828" opacity=".5" />)}

        {/* trees behind wall */}
        {[60, 180, 340, 480, 620, 760, 900, 1060, 1200, 1340].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={80} rx={i % 3 === 0 ? 38 : 28} ry={i % 3 === 0 ? 32 : 24} fill={['#3d7a1f', '#2a5714', '#5aad30'][i % 3]} opacity=".75" />
            <ellipse cx={x + 8} cy={74} rx={22} ry={18} fill="#4a8c22" opacity=".5" />
          </g>
        ))}

        {/* crowd stands top */}
        <rect x="0" y="36" width="1400" height="62" fill="#fef3c7" opacity=".5" />
        {[...Array(42)].map((_, i) => {
          const x = i * 34 + 6, y = 62, c = cc[i % cc.length]
          return (
            <g key={i} style={{ animation: `crowdwave ${1.1 + (i % 3) * .14}s ease-in-out ${(i % 6) * .18}s infinite` }}>
              <circle cx={x} cy={y - 12} r={6.5} fill={c} />
              <rect x={x - 5} y={y - 5} width={10} height={14} rx={3} fill={c} />
            </g>
          )
        })}

        {/* flag kids */}
        {[{ x: 85, bc: '#92400e', fc: '#ef4444' }, { x: 210, bc: '#3d7a1f', fc: '#fbbf24' }, { x: 1200, bc: '#b45309', fc: '#3d7a1f' }, { x: 1310, bc: '#ef4444', fc: '#fbbf24' }].map((f, i) => (
          <g key={i}>
            <circle cx={f.x} cy={50} r={6.5} fill={f.bc} />
            <rect x={f.x - 4.5} y={57} width={9} height={14} rx={3} fill={f.bc} />
            <rect x={f.x + 4.5} y={30} width={2} height={20} fill="#92400e" />
            <polygon points={`${f.x + 6.5},30 ${f.x + 17},35 ${f.x + 6.5},40`} fill={f.fc} />
          </g>
        ))}

        {/* side crowd */}
        {[...Array(7)].map((_, i) => {
          const y = 150 + i * 56, c1 = cc[(i + 2) % 8], c2 = cc[(i + 5) % 8]
          return (
            <g key={i}>
              <g style={{ animation: `crowdwave 1.3s ease-in-out ${i * .22}s infinite` }}>
                <circle cx={24} cy={y - 13} r={6.5} fill={c1} /><rect x={19} y={y - 6} width={10} height={15} rx={3} fill={c1} />
              </g>
              <g style={{ animation: `crowdwave 1.3s ease-in-out ${i * .2}s infinite` }}>
                <circle cx={1376} cy={y - 13} r={6.5} fill={c2} /><rect x={1371} y={y - 6} width={10} height={15} rx={3} fill={c2} />
              </g>
            </g>
          )
        })}

        {/* side boundary strips */}
        <rect x="0" y="112" width="60" height="608" fill="#fef3c7" opacity=".45" />
        <rect x="1340" y="112" width="60" height="608" fill="#fef3c7" opacity=".45" />

        {/* main ground - desi maidan patchy uneven */}
        <rect x="60" y="112" width="1280" height="608" fill="url(#groundg)" />

        {/* uneven grass patches */}
        <ellipse cx="350" cy="430" rx="200" ry="90" fill="#5a9030" opacity=".38" />
        <ellipse cx="950" cy="360" rx="240" ry="110" fill="#6aaa3a" opacity=".3" />
        <ellipse cx="700" cy="560" rx="280" ry="85" fill="#528825" opacity=".28" />
        <ellipse cx="180" cy="340" rx="150" ry="75" fill="#4a8020" opacity=".32" />
        <ellipse cx="1150" cy="530" rx="190" ry="90" fill="#5a9030" opacity=".28" />

        {/* mud patches - worn spots like real gully ground */}
        <ellipse cx="700" cy="350" rx="100" ry="45" fill="#a07840" opacity=".5" />
        <ellipse cx="550" cy="480" rx="65" ry="30" fill="#8a6632" opacity=".38" />
        <ellipse cx="870" cy="470" rx="58" ry="24" fill="#9a7438" opacity=".35" />
        <ellipse cx="290" cy="510" rx="75" ry="32" fill="#8a6632" opacity=".28" />
        <ellipse cx="1080" cy="420" rx="70" ry="28" fill="#a07840" opacity=".3" />
        <ellipse cx="700" cy="280" rx="55" ry="24" fill="#9a7438" opacity=".32" />

        {/* rough grass tufts */}
        {[[180, 285], [340, 405], [490, 335], [820, 300], [960, 430], [1110, 350], [1190, 490], [210, 470], [400, 540], [1060, 550], [770, 610], [610, 630]].map(([x, y], i) => (
          <g key={i} opacity=".5">
            <line x1={x} y1={y} x2={x - 5} y2={y - 12} stroke="#3d6e18" strokeWidth="1.5" strokeLinecap="round" />
            <line x1={x + 4} y1={y} x2={x + 8} y2={y - 10} stroke="#4a7a20" strokeWidth="1.5" strokeLinecap="round" />
            <line x1={x + 8} y1={y + 2} x2={x + 5} y2={y - 8} stroke="#3d6e18" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ))}

        {/* faded chalk boundary */}
        <rect x="72" y="120" width="1256" height="2" fill="white" opacity=".42" />
        <rect x="72" y="715" width="1256" height="2" fill="white" opacity=".42" />
        <rect x="72" y="120" width="2" height="595" fill="white" opacity=".42" />
        <rect x="1326" y="120" width="2" height="595" fill="white" opacity=".42" />
        <ellipse cx="700" cy="420" rx="400" ry="210" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="8,7" opacity=".22" />

        {/* pitch - cracked muddy dirt */}
        <rect x="600" y="235" width="200" height="290" rx="10" fill="url(#pitchg)" filter="url(#fsd)" />
        <ellipse cx="700" cy="385" rx="42" ry="22" fill="#8a6632" opacity=".52" />
        <path d="M625 255 Q650 295 640 355" fill="none" stroke="#7a5828" strokeWidth="1.5" opacity=".58" />
        <path d="M660 250 Q680 305 670 398" fill="none" stroke="#7a5828" strokeWidth="1" opacity=".42" />
        <path d="M720 260 Q740 325 735 420" fill="none" stroke="#7a5828" strokeWidth="1.2" opacity=".48" />
        <path d="M755 270 Q760 325 750 408" fill="none" stroke="#7a5828" strokeWidth="1" opacity=".38" />
        <ellipse cx="700" cy="270" rx="24" ry="11" fill="#9a7438" opacity=".48" />
        <ellipse cx="700" cy="500" rx="24" ry="11" fill="#9a7438" opacity=".48" />

        {/* creases */}
        <line x1="582" y1="252" x2="818" y2="252" stroke="white" strokeWidth="2.5" />
        <line x1="582" y1="468" x2="818" y2="468" stroke="white" strokeWidth="2.5" />
        <line x1="650" y1="235" x2="650" y2="480" stroke="white" strokeWidth="1.2" opacity=".38" strokeDasharray="4,5" />
        <line x1="750" y1="235" x2="750" y2="480" stroke="white" strokeWidth="1.2" opacity=".38" strokeDasharray="4,5" />

        {/* stumps bowler end */}
        {[684, 694, 704].map((x, i) => <rect key={i} x={x} y={233} width={5} height={24} rx={1.5} fill="#fffde7" />)}
        <rect x="683" y="232" width="27" height="3" rx="1.5" fill="#fbbf24" />

        {/* stumps batter end */}
        {[684, 694, 704].map((x, i) => <rect key={i} x={x} y={456} width={5} height={24} rx={1.5} fill="#fffde7" />)}
        <rect x="683" y="455" width="27" height="3" rx="1.5" fill="#fbbf24" />

        {/* outfield fielders */}
        {[{ x: 200, y: 340, c: '#3d7a1f' }, { x: 1060, y: 330, c: '#b45309' }, { x: 215, y: 500, c: '#ef4444' }, { x: 1130, y: 490, c: '#3d7a1f' }, { x: 470, y: 570, c: '#92400e' }, { x: 890, y: 575, c: '#d97706' }, { x: 700, y: 620, c: '#b91c1c' }].map((f, i) => (
          <g key={i} transform={`translate(${f.x},${f.y})`}>
            <ellipse cx={0} cy={28} rx={10} ry={3} fill="rgba(0,0,0,.1)" />
            <rect x={-5} y={8} width={10} height={18} rx={3} fill={f.c} />
            <circle cx={0} cy={1} r={8} fill="#d4a574" />
            <ellipse cx={0} cy={-5} rx={9} ry={6} fill={f.c} />
            <rect x={-7} y={-2} width={6} height={5} rx={2} fill={['#5aad30', '#92400e', '#b91c1c', '#d97706', '#3d7a1f', '#f59e0b', '#ef4444'][i]} />
            <rect x={-4} y={26} width={4} height={12} rx={2} fill="#1c1917" />
            <rect x={0} y={26} width={4} height={12} rx={2} fill="#1c1917" />
          </g>
        ))}

        {/* bowler */}
        {bowler(running)}

        {/* batsman */}
        {batsman(swinging, battingstyle)}

        {/* cricket ball */}
        {ballvisible && (
          <g transform={`translate(${ballx},${bally}) scale(${ballscale})`} filter="url(#bglow)">
            <circle r={11} fill="#c0392b" />
            <circle r={11} fill="none" stroke="#7f1d1d" strokeWidth="1.5" />
            <path d="M-5,-8 Q0,-2 -5,8" fill="none" stroke="rgba(255,200,200,.8)" strokeWidth="1.5" />
            <path d="M5,-8 Q0,-2 5,8" fill="none" stroke="rgba(255,200,200,.8)" strokeWidth="1.5" />
            <ellipse cx={-2} cy={-4} rx={3} ry={2} fill="rgba(255,255,255,.45)" transform="rotate(-20)" />
          </g>
        )}

        <style>{`@keyframes crowdwave{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>
      </svg>
    </div>
  )
}
