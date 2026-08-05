import { useState, useEffect } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import Field from './Field.jsx'

export default function AdminProfile() {
  const { data: loadedProfile, loading } = useStoreData(() => store.getProfile())
  const [profile, setProfile] = useState(null)
  const [stackInput, setStackInput] = useState('')
  const [heroCommandsInput, setHeroCommandsInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loadedProfile) {
      setProfile(loadedProfile)
      setStackInput((loadedProfile.stack || []).join(', '))
      setHeroCommandsInput((loadedProfile.heroCommands || []).join('\n'))
    }
  }, [loadedProfile])

  function update(key, value) {
    setProfile(p => ({ ...p, [key]: value }))
  }

  async function save() {
    const stack = stackInput.split(',').map(s => s.trim()).filter(Boolean)
    const heroCommands = heroCommandsInput.split('\n').map(s => s.trim()).filter(Boolean)
    setSaving(true)
    setError('')
    try {
      await store.updateProfile({ ...profile, stack, heroCommands })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) return <div style={{ minHeight: 300 }} />

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 24 }}>Profile & About</h1>

      <Field label="Name"><input value={profile.name} onChange={e => update('name', e.target.value)} /></Field>
      <Field label="Title"><input value={profile.title} onChange={e => update('title', e.target.value)} /></Field>
      <Field label="Company"><input value={profile.company} onChange={e => update('company', e.target.value)} /></Field>
      <Field label="Hero tagline"><input value={profile.tagline} onChange={e => update('tagline', e.target.value)} /></Field>
      <Field label="Hero subheading"><textarea value={profile.subhead} onChange={e => update('subhead', e.target.value)} /></Field>
      <Field label="Hero terminal text (one line each — this is the animated $ whoami box on your homepage)">
        <textarea
          style={{ minHeight: 140, fontFamily: 'var(--font-mono)', fontSize: 13.5 }}
          value={heroCommandsInput}
          onChange={e => setHeroCommandsInput(e.target.value)}
          placeholder={'$ whoami\nyour name — your title\n$ status --check\n✓ available for new builds'}
        />
      </Field>
      <Field label="About (paragraphs — separate with a blank line)">
        <textarea style={{ minHeight: 180 }} value={profile.about} onChange={e => update('about', e.target.value)} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Location"><input value={profile.location} onChange={e => update('location', e.target.value)} /></Field>
        <Field label="Timezone"><input value={profile.timezone} onChange={e => update('timezone', e.target.value)} /></Field>
        <Field label="Email"><input value={profile.email} onChange={e => update('email', e.target.value)} /></Field>
        <Field label="Phone"><input value={profile.phone} onChange={e => update('phone', e.target.value)} /></Field>
        <Field label="Years of experience"><input type="number" value={profile.yearsExperience} onChange={e => update('yearsExperience', Number(e.target.value))} /></Field>
        <Field label="Availability">
          <select value={profile.availability} onChange={e => update('availability', e.target.value)}>
            <option value="available">Available</option>
            <option value="booked">Currently booked</option>
          </select>
        </Field>
      </div>

      <Field label="Tech stack (comma-separated)">
        <input value={stackInput} onChange={e => setStackInput(e.target.value)} />
      </Field>

      <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
      {saved && <span className="mono" style={{ color: 'var(--mint)', marginLeft: 14, fontSize: 13 }}>✓ Saved</span>}
      {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginTop: 12 }}>{error}</p>}
    </div>
  )
}
