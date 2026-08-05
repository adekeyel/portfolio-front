import { useState, useEffect } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import { useAuth } from '../context/AuthContext.jsx'
import Field from './Field.jsx'

export default function AdminSettings() {
  const { changePassword, adminEmail } = useAuth()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSaving, setPwSaving] = useState(false)

  const { data: loadedLegal } = useStoreData(() => store.getLegal())
  const [legal, setLegal] = useState(null)
  const [legalSaved, setLegalSaved] = useState(false)
  const [legalSaving, setLegalSaving] = useState(false)
  const [legalError, setLegalError] = useState('')

  useEffect(() => {
    if (loadedLegal) setLegal(loadedLegal)
  }, [loadedLegal])

  async function savePassword() {
    if (!currentPw || newPw.length < 8) {
      setPwError('Current password is required, and new password must be at least 8 characters.')
      return
    }
    setPwSaving(true)
    setPwError('')
    const result = await changePassword(currentPw, newPw)
    setPwSaving(false)
    if (result.success) {
      setPwSaved(true)
      setCurrentPw('')
      setNewPw('')
      setTimeout(() => setPwSaved(false), 2000)
    } else {
      setPwError(result.error || 'Failed to change password')
    }
  }

  async function saveLegal() {
    setLegalSaving(true)
    setLegalError('')
    try {
      await store.updateLegal(legal)
      setLegalSaved(true)
      setTimeout(() => setLegalSaved(false), 2000)
    } catch (err) {
      setLegalError(err.message || 'Failed to save legal text')
    } finally {
      setLegalSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 24 }}>Settings</h1>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, marginBottom: 4 }}>Change Admin Password</h2>
        <p className="mono" style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 16 }}>Signed in as {adminEmail}</p>
        <Field label="Current password">
          <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
        </Field>
        <Field label="New password">
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="At least 8 characters" />
        </Field>
        {pwError && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 12 }}>{pwError}</p>}
        <button className="btn btn-primary btn-sm" onClick={savePassword} disabled={pwSaving}>{pwSaving ? 'Updating…' : 'Update Password'}</button>
        {pwSaved && <span className="mono" style={{ color: 'var(--mint)', marginLeft: 12, fontSize: 13 }}>✓ Updated</span>}
      </div>

      {legal && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, marginBottom: 16 }}>Legal Pages</h2>
          <Field label="Privacy Policy">
            <textarea style={{ minHeight: 140 }} value={legal.privacyPolicy} onChange={e => setLegal(l => ({ ...l, privacyPolicy: e.target.value }))} />
          </Field>
          <Field label="Terms of Service">
            <textarea style={{ minHeight: 140 }} value={legal.termsOfService} onChange={e => setLegal(l => ({ ...l, termsOfService: e.target.value }))} />
          </Field>
          {legalError && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 12 }}>{legalError}</p>}
          <button className="btn btn-primary btn-sm" onClick={saveLegal} disabled={legalSaving}>{legalSaving ? 'Saving…' : 'Save Legal Text'}</button>
          {legalSaved && <span className="mono" style={{ color: 'var(--mint)', marginLeft: 12, fontSize: 13 }}>✓ Saved</span>}
        </div>
      )}

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 17, marginBottom: 8 }}>Backups</h2>
        <p style={{ fontSize: 13.5, color: 'var(--slate)' }}>
          Your content now lives in a real PostgreSQL database on Railway. Set up Railway's automatic daily backups
          for your database from the Railway dashboard (Database service → Settings → Backups) — this is the
          recommended way to protect your data going forward.
        </p>
      </div>
    </div>
  )
}
