export default function SectionHeading({ eyebrow, fig, title, sub, align = 'left', action }) {
  return (
    <div style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ textAlign: align, maxWidth: align === 'center' ? 640 : 620, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>
        {(eyebrow || fig) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: align === 'center' ? 'center' : 'flex-start', marginBottom: 14 }}>
            {fig && <span className="fig">{fig}</span>}
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          </div>
        )}
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: sub ? 14 : 0 }}>{title}</h2>
        {sub && <p style={{ color: 'var(--slate)', fontSize: 16, maxWidth: 480 }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}
