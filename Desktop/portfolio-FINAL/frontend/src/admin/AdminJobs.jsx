import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import Field from './Field.jsx'

const EMPTY = { title: '', type: 'Contract', location: 'Remote', description: '', active: true }

export default function AdminJobs() {
  const { data: items, loading } = useStoreData(() => store.getJobs())
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  function startNew() { setForm(EMPTY); setError(''); setEditing('new') }
  function startEdit(item) { setForm(item); setError(''); setEditing(item.id) }

  async function save() {
    if (!form.title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    setError('')
    try {
      if (editing === 'new') await store.addJob(form)
      else await store.updateJob(editing, form)
      setEditing(null)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this job listing?')) return
    setBusyId(id)
    try { await store.removeJob(id) } finally { setBusyId(null) }
  }

  async function toggleActive(item) {
    setBusyId(item.id)
    try { await store.updateJob(item.id, { active: !item.active }) } finally { setBusyId(null) }
  }

  if (editing) {
    return (
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 20 }}>
          {editing === 'new' ? 'New Job Listing' : 'Edit Job Listing'}
        </h1>
        <Field label="Job title"><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Type"><input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="Full-time / Contract" /></Field>
          <Field label="Location"><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></Field>
        </div>
        <Field label="Description"><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
        <div className="form-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ width: 'auto' }} />
          <label style={{ margin: 0 }}>Active (visible on Careers page)</label>
        </div>
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Careers / Jobs</h1>
        <button className="btn btn-primary btn-sm" onClick={startNew}>+ Add Job</button>
      </div>
      {loading ? (
        <p style={{ color: 'var(--slate)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(items || []).map(item => (
            <div key={item.id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', opacity: busyId === item.id ? 0.6 : 1 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.title} {!item.active && <span className="tag" style={{ marginLeft: 8, background: 'rgba(255,92,92,0.15)', color: '#FF9B9B' }}>Inactive</span>}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>{item.type} · {item.location}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => toggleActive(item)} disabled={busyId === item.id}>{item.active ? 'Deactivate' : 'Activate'}</button>
                <button className="btn btn-secondary btn-sm" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)} disabled={busyId === item.id}>Delete</button>
              </div>
            </div>
          ))}
          {(items || []).length === 0 && <p style={{ color: 'var(--slate)' }}>No job listings yet.</p>}
        </div>
      )}
    </div>
  )
}
