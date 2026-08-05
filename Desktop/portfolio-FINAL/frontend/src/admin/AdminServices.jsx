import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import Field from './Field.jsx'

const EMPTY = { name: '', priceFrom: '', duration: '', description: '', features: '' }

export default function AdminServices() {
  const { data: items, loading } = useStoreData(() => store.getServices())
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function startNew() { setForm(EMPTY); setError(''); setEditing('new') }
  function startEdit(item) { setForm({ ...item, features: (item.features || []).join(', ') }); setError(''); setEditing(item.id) }

  async function save() {
    if (!form.name.trim()) { setError('Name is required.'); return }
    setSaving(true)
    setError('')
    const payload = { ...form, features: form.features.split(',').map(s => s.trim()).filter(Boolean) }
    try {
      if (editing === 'new') await store.addService(payload)
      else await store.updateService(editing, payload)
      setEditing(null)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this service?')) return
    try {
      await store.removeService(id)
    } catch (err) {
      alert(err.message || 'Failed to delete')
    }
  }

  if (editing) {
    return (
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 20 }}>
          {editing === 'new' ? 'New Service' : 'Edit Service'}
        </h1>
        <Field label="Service name"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
        <Field label="Starting price"><input value={form.priceFrom} onChange={e => setForm(f => ({ ...f, priceFrom: e.target.value }))} placeholder="₦350,000" /></Field>
        <Field label="Typical duration"><input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="2–3 weeks" /></Field>
        <Field label="Description"><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
        <Field label="Features (comma-separated)"><textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} /></Field>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Services & Pricing</h1>
        <button className="btn btn-primary btn-sm" onClick={startNew}>+ Add Service</button>
      </div>
      {loading ? (
        <p style={{ color: 'var(--slate)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(items || []).map(item => (
            <div key={item.id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>{item.priceFrom} · {item.duration}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
          ))}
          {(items || []).length === 0 && <p style={{ color: 'var(--slate)' }}>No services yet.</p>}
        </div>
      )}
    </div>
  )
}
