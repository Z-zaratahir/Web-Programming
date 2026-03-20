const IMic = ({ color }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>

export default function commentarybox({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: text ? '#fffbeb' : '#fafafa', borderRadius: 11, border: `1px solid ${text ? '#fde68a' : '#e5e7eb'}`, padding: '6px 11px', minHeight: 32, transition: 'all .3s' }}>
      <IMic color={text ? '#f59e0b' : '#9ca3af'} />
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: text ? 700 : 400, color: text ? '#92400e' : '#9ca3af', fontSize: 12, margin: 0, lineHeight: 1.3, fontStyle: text ? 'normal' : 'italic' }}>
        {text || 'Commentary will appear here...'}
      </p>
    </div>
  )
}
