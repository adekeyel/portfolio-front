import { Outlet, NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'

const NAV = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/profile', label: 'Profile & About' },
  { to: '/admin/portfolio', label: 'Portfolio' },
  { to: '/admin/services', label: 'Services & Pricing' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/jobs', label: 'Careers / Jobs' },
  { to: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--font-body)', display: 'flex' }}>
      <aside className="admin-sidebar" style={sidebarStyle}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(237,239,247,0.08)' }}>
          <Link to="/" className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>← Back to site</Link>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, marginTop: 10 }}>Admin</div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'block', padding: '11px 14px', borderRadius: 8, fontSize: 14.5,
                color: isActive ? 'var(--ink)' : 'var(--paper)',
                background: isActive ? 'var(--mint)' : 'transparent',
                marginBottom: 3, fontWeight: isActive ? 600 : 400
              })}
            >{item.label}</NavLink>
          ))}
        </nav>
        <div style={{ padding: 16, borderTop: '1px solid rgba(237,239,247,0.08)' }}>
          <button onClick={logout} className="btn btn-secondary btn-block btn-sm">Log Out</button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="admin-topbar" style={topbarStyle}>
          <button onClick={() => setMobileOpen(o => !o)} className="admin-menu-btn" style={{ fontSize: 20 }}>☰</button>
          <span className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>Admin Dashboard</span>
        </div>
        <div style={{ padding: '32px 28px' }}>
          <Outlet />
        </div>
      </div>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }} onClick={() => setMobileOpen(false)}>
          <div style={{ ...sidebarStyle, position: 'absolute', left: 0, top: 0, bottom: 0 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(237,239,247,0.08)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>Admin</div>
            </div>
            <nav style={{ padding: '16px 12px' }}>
              {NAV.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: 'block', padding: '11px 14px', borderRadius: 8, fontSize: 14.5,
                    color: isActive ? 'var(--ink)' : 'var(--paper)',
                    background: isActive ? 'var(--mint)' : 'transparent', marginBottom: 3
                  })}
                >{item.label}</NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .admin-sidebar { display: none !important; }
          .admin-menu-btn { display: block !important; }
        }
        @media (min-width: 861px) {
          .admin-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}

const sidebarStyle = {
  width: 240, borderRight: '1px solid rgba(237,239,247,0.08)',
  display: 'flex', flexDirection: 'column', background: 'var(--ink-soft)',
  zIndex: 101
}

const topbarStyle = {
  height: 56, borderBottom: '1px solid rgba(237,239,247,0.08)',
  display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px'
}
