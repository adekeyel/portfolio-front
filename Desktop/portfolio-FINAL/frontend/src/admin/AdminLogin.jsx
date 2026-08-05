import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLogin() {
  const { login, isAuthed, checking } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (checking) return null
  if (isAuthed) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const result = await login(email, password)
    setSubmitting(false)
    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--font-body)', padding: 20 }}>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 36, width: 380, maxWidth: '100%' }}>
        <div className="mono" style={{ color: 'var(--mint)', fontSize: 12, marginBottom: 8, textAlign: 'center' }}>ADMIN</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 24, textAlign: 'center' }}>Sign in</h1>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
        </div>
        <div className="form-field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
