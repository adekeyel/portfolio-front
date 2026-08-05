import { useRef } from 'react'

export default function PortfolioCard({ item }) {
  const videoRef = useRef(null)

  function handleEnter() {
    if (item.mediaType === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }
  function handleLeave() {
    if (item.mediaType === 'video' && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const hasLink = Boolean(item.link && item.link.trim())
  const Wrapper = hasLink ? 'a' : 'div'
  const wrapperProps = hasLink
    ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="card"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
        cursor: hasLink ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, border-color 0.15s ease'
      }}
      onMouseOver={e => { if (hasLink) e.currentTarget.style.borderColor = 'var(--blue)' }}
      onMouseOut={e => { if (hasLink) e.currentTarget.style.borderColor = 'var(--line)' }}
    >
      <div style={{
        position: 'relative', aspectRatio: '16/10', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1B2450, #0B1024)',
        backgroundImage: 'linear-gradient(rgba(237,239,247,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(237,239,247,0.06) 1px, transparent 1px), linear-gradient(135deg, #1B2450, #0B1024)',
        backgroundSize: '20px 20px, 20px 20px, 100% 100%',
      }}>
        {item.mediaUrl && item.mediaType === 'video' ? (
          <video ref={videoRef} src={item.mediaUrl} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : item.mediaUrl && item.mediaType === 'image' ? (
          <img src={item.mediaUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="mono" style={{ color: 'var(--slate-dim)', fontSize: 13 }}>preview / {item.title.toLowerCase().replace(/\s/g, '-')}.mp4</span>
          </div>
        )}
        {item.featured && (
          <span className="badge-status" style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(11,14,20,0.75)' }}>
            Featured
          </span>
        )}
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: 20 }}>{item.title}</h3>
          {hasLink && <span className="mono" style={{ fontSize: 12, color: 'var(--mint)', whiteSpace: 'nowrap' }}>Visit ↗</span>}
        </div>
        <p className="mono" style={{ fontSize: 12.5, color: 'var(--blue)', marginBottom: 12 }}>{item.subtitle}</p>
        <p style={{ fontSize: 14.5, color: 'var(--slate)', flex: 1, marginBottom: 16 }}>{item.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(item.stack || []).map(s => <span key={s} className="tag">{s}</span>)}
        </div>
      </div>
    </Wrapper>
  )
}
