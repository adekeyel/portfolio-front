import { Outlet, NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import { API_URL } from '../data/api.js'
import StatusBar from './StatusBar.jsx'

const FALLBACK_PROFILE = {
  name: 'Site', tagline: '', company: '', location: '', timezone: '',
  availability: 'available', stack: []
}

export default function Layout() {
  const { data: profile, loading, error } = useStoreData(() => store.getProfile())
  const [menuOpen, setMenuOpen] = useState(false)
  const p = profile || FALLBACK_PROFILE

  const links = [
    { to: '/about', label: 'About' },
    { to: '/portfolio', label: 'Work' },
    { to: '/careers', label: 'Careers' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: 44 }}>
      {error && (
        <div style={errorBannerStyle} className="mono">
          <div className="wrap" style={{ padding: '10px 24px' }}>
            ⚠ Can't reach the backend at <strong>{API_URL}</strong> — {error}.
            Check that your backend is running and that <code>VITE_API_URL</code> is set correctly.
          </div>
        </div>
      )}
      <header style={headerStyle}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={logoBoxStyle}>&lt;/&gt;</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600 }}>{p.name}</span>
          </Link>

          <nav className="mono" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <div className="nav-desktop" style={{ display: 'flex', gap: 28 }}>
              {links.map(l => (
                <NavLink key={l.to} to={l.to} style={({isActive}) => ({
                  fontSize: 13.5, letterSpacing: '0.02em', color: isActive ? 'var(--mint)' : 'var(--slate)', transition: 'color .15s'
                })}>{l.label}</NavLink>
              ))}
            </div>
            <Link to="/booking" className="btn btn-primary btn-sm">Book a Call →</Link>
            <button className="nav-toggle" onClick={() => setMenuOpen(m => !m)} aria-label="Toggle menu" style={toggleStyle}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </nav>
        </div>

        {menuOpen && (
          <div className="wrap mono" style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 20 }}>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={({isActive}) => ({
                padding: '12px 0', fontSize: 15, color: isActive ? 'var(--mint)' : 'var(--paper)', borderTop: '1px solid rgba(237,239,247,0.08)'
              })}>{l.label}</NavLink>
            ))}
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer profile={p} />
      <StatusBar profile={p} />

      <style>{`
        @media (min-width: 780px) { .nav-toggle { display: none; } }
        @media (max-width: 779px) { .nav-desktop { display: none !important; } }
      `}</style>
    </div>
  )
}

function Footer({ profile }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(237,239,247,0.08)', padding: '56px 0 40px' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 10 }}>{profile.name}</div>
          <p style={{ color: 'var(--slate)', fontSize: 14, maxWidth: 320 }}>{profile.tagline}</p>
          <p className="mono" style={{ color: 'var(--slate-dim)', fontSize: 12.5, marginTop: 14 }}>{profile.company}</p>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 12, letterSpacing: '0.05em' }}>SITE</div>
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/portfolio">Work</FooterLink>
          <FooterLink to="/booking">Book a Call</FooterLink>
          <FooterLink to="/careers">Careers</FooterLink>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 12, letterSpacing: '0.05em' }}>LEGAL</div>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </div>
      </div>
      <div className="wrap mono" style={{ marginTop: 40, fontSize: 12, color: 'var(--slate-dim)' }}>
        © {new Date().getFullYear()} {profile.company}. All rights reserved.
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return <Link to={to} style={{ display: 'block', fontSize: 14, color: 'var(--slate)', marginBottom: 10 }}>{children}</Link>
}

const headerStyle = {
  position: 'sticky', top: 0, zIndex: 50,
  background: 'rgba(11,16,36,0.82)', backdropFilter: 'blur(10px)',
  borderBottom: '1px solid var(--line)'
}

const errorBannerStyle = {
  background: '#3A1414', color: '#FFB4B4', fontSize: 12.5,
  borderBottom: '1px solid rgba(255,92,92,0.3)'
}

const logoBoxStyle = {
  width: 32, height: 32, borderRadius: 6, background: 'var(--blue)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'white'
}

const toggleStyle = { fontSize: 20, padding: 4 }
