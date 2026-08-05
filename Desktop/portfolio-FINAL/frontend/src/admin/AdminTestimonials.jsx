import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import Field from './Field.jsx'

const EMPTY = { name: '', role: '', quote: '', rating: 5 }

export default function AdminTestimonials() {
  const { data: items, loading } = useStoreData(() => store.getTestimonials())
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  function startNew() { setForm(EMPTY); setError(''); setEditing('new') }
  function startEdit(item) { setForm(item); setError(''); setEditing(item.id) }

  async function save() {
    if (!form.name.trim() || !form.quote.trim()) { setError('Name and quote are required.'); return }
    setSaving(true)
    setError('')
    try {
      if (editing === 'new') await store.addTestimonial(form)
      else await store.updateTestimonial(editing, form)
      setEditing(null)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this testimonial?')) return
    setBusyId(id)
    try { await store.removeTestimonial(id) } finally { setBusyId(null) }
  }

  if (editing) {
    return (
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 20 }}>
          {editing === 'new' ? 'New Testimonial' : 'Edit Testimonial'}
        </h1>
        <Field label="Client name"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
        <Field label="Role / Business"><input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></Field>
        <Field label="Quote"><textarea value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} /></Field>
        <Field label="Rating (1–5)">
          <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Testimonials</h1>
        <button className="btn btn-primary btn-sm" onClick={startNew}>+ Add Testimonial</button>
      </div>
      {loading ? (
        <p style={{ color: 'var(--slate)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(items || []).map(item => (
            <div key={item.id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', opacity: busyId === item.id ? 0.6 : 1 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.name} · {'★'.repeat(item.rating)}</div>
                <div style={{ fontSize: 13, color: 'var(--slate)', maxWidth: 420 }}>"{item.quote}"</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)} disabled={busyId === item.id}>Delete</button>
              </div>
            </div>
          ))}
          {(items || []).length === 0 && <p style={{ color: 'var(--slate)' }}>No testimonials yet.</p>}
        </div>
      )}
    </div>
  )
}
