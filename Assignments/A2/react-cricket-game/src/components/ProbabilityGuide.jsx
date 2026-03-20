// small probability guide panel toggled from game screen
export default function probabilityguide({ probs, style }) {
  return (
    <div style={{ background: 'rgba(255,251,235,.93)', backdropFilter: 'blur(8px)', borderRadius: 16, border: '1px solid rgba(245,158,11,.3)', overflow: 'hidden', width: 158, boxShadow: '0 4px 20px rgba(0,0,0,.18)' }}>
      <div style={{ background: style === 'aggressive' ? '#b91c1c' : '#3d7a1f', padding: '6px 12px' }}>
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'white', fontSize: 11, letterSpacing: 2 }}>
          {style === 'aggressive' ? 'AGGRESSIVE' : 'DEFENSIVE'}
        </span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        {probs.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: '#92400e', fontSize: 11, flex: 1 }}>{p.display}</span>
            <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 11, color: p.color }}>{Math.round(p.prob * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
