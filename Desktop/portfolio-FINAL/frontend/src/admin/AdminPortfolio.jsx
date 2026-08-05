import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import Field from './Field.jsx'

const EMPTY = { title: '', subtitle: '', description: '', stack: '', mediaType: 'image', mediaUrl: '', link: '', featured: false }

export default function AdminPortfolio() {
  const { data: items, loading } = useStoreData(() => store.getPortfolio())
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function startNew() {
    setForm(EMPTY)
    setError('')
    setEditing('new')
  }

  function startEdit(item) {
    setForm({ ...item, stack: (item.stack || []).join(', ') })
    setError('')
    setEditing(item.id)
  }

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { url, mediaType } = await store.uploadFile(file)
      setForm(f => ({ ...f, mediaUrl: url, mediaType }))
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    if (!form.title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    setError('')
    const payload = { ...form, stack: form.stack.split(',').map(s => s.trim()).filter(Boolean) }
    try {
      if (editing === 'new') {
        await store.addPortfolioItem(payload)
      } else {
        await store.updatePortfolioItem(editing, payload)
      }
      setEditing(null)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this portfolio item?')) return
    try {
      await store.removePortfolioItem(id)
    } catch (err) {
      alert(err.message || 'Failed to delete')
    }
  }

  if (editing) {
    return (
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 20 }}>
          {editing === 'new' ? 'New Portfolio Item' : 'Edit Portfolio Item'}
        </h1>
        <Field label="Title"><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></Field>
        <Field label="Subtitle"><input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} /></Field>
        <Field label="Description"><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
        <Field label="Tech stack (comma-separated)"><input value={form.stack} onChange={e => setForm(f => ({ ...f, stack: e.target.value }))} /></Field>
        <Field label="Project link (optional)"><input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." /></Field>
        <Field label="Upload image or short video">
          <input type="file" accept="image/*,video/*" onChange={handleFile} disabled={uploading} />
          {uploading && <span className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>Uploading…</span>}
        </Field>
        {form.mediaUrl && (
          <div style={{ marginBottom: 18 }}>
            {form.mediaType === 'video' ? (
              <video src={form.mediaUrl} controls style={{ maxWidth: '100%', borderRadius: 8 }} />
            ) : (
              <img src={form.mediaUrl} alt="preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
            )}
          </div>
        )}
        <div className="form-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: 'auto' }} />
          <label style={{ margin: 0 }}>Featured on homepage</label>
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={save} disabled={saving || uploading}>{saving ? 'Saving…' : 'Save'}</button>
          <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Portfolio</h1>
        <button className="btn btn-primary btn-sm" onClick={startNew}>+ Add Project</button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--slate)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(items || []).map(item => (
            <div key={item.id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.title} {item.featured && <span className="tag" style={{ marginLeft: 8 }}>Featured</span>}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>{item.subtitle}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
          ))}
          {(items || []).length === 0 && <p style={{ color: 'var(--slate)' }}>No portfolio items yet.</p>}
        </div>
      )}
    </div>
  )
}
