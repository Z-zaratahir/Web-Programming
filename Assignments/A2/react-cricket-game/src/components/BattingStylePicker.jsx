const IZap    = ({ color }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IShield = ({ color }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>

export default function battingstylepicker({ style, onchange, disabled }) {
  const opts = [
    { val: 'aggressive', label: 'Aggressive', sub: 'High risk', Icon: IZap,    ac: '#b91c1c', bc: '#fee2e2' },
    { val: 'defensive',  label: 'Defensive',  sub: 'Safe',      Icon: IShield, ac: '#3d7a1f', bc: '#dcfce7' },
  ]
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {opts.map(o => {
        const sel = style === o.val
        return (
          <button key={o.val} onClick={() => !disabled && onchange(o.val)} disabled={disabled}
            style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 12, border: `2px solid ${sel ? o.ac : o.bc}`, background: sel ? o.ac : o.bc, cursor: disabled ? 'default' : 'pointer', opacity: !disabled || sel ? 1 : .55, transition: 'all .15s' }}>
            <o.Icon color={sel ? 'white' : o.ac} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: sel ? 'white' : o.ac, fontSize: 13, lineHeight: 1 }}>{o.label}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: sel ? 'rgba(255,255,255,.8)' : o.ac, marginTop: 1 }}>{o.sub}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
