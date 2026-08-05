import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--font-body)' }}>
      <div className="mono" style={{ color: 'var(--mint)', fontSize: 14, marginBottom: 12 }}>404</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 20 }}>Page not found</h1>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  )
}
