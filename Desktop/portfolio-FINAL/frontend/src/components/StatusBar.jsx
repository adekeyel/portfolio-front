import { Link } from 'react-router-dom'

export default function StatusBar({ profile }) {
  const isAvailable = profile.availability === 'available'
  return (
    <div style={barStyle} className="mono">
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, overflow: 'hidden' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: isAvailable ? 'var(--status-green)' : 'var(--danger)' }} />
            {isAvailable ? 'Available for new builds' : 'Currently booked'}
          </span>
          <span style={{ color: 'var(--slate)', display: 'none' }} className="statusbar-sep">·</span>
          <span style={{ color: 'var(--slate)' }} className="statusbar-tz">{profile.location} · {profile.timezone}</span>
        </div>
        <Link to="/booking" style={{ color: 'var(--mint)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Book a call →
        </Link>
      </div>
      <style>{`
        @media (max-width: 560px) { .statusbar-tz { display: none; } }
      `}</style>
    </div>
  )
}

const barStyle = {
  position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
  background: 'var(--ink-soft)', borderTop: '1px solid var(--line)',
  fontSize: 13
}
