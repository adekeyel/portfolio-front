import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'

const STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

export default function AdminBookings() {
  const { data: bookings, loading } = useStoreData(() => store.getBookings())
  const [filter, setFilter] = useState('all')
  const [busyId, setBusyId] = useState(null)

  const list = bookings || []
  const shown = filter === 'all' ? list : list.filter(b => b.status === filter)

  async function setStatus(id, status) {
    setBusyId(id)
    try { await store.updateBooking(id, { status }) } finally { setBusyId(null) }
  }

  async function setPayment(id, paymentStatus) {
    setBusyId(id)
    try { await store.updateBooking(id, { paymentStatus }) } finally { setBusyId(null) }
  }

  async function remove(id) {
    if (!confirm('Delete this booking?')) return
    setBusyId(id)
    try { await store.removeBooking(id) } finally { setBusyId(null) }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 6 }}>Bookings</h1>
      <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 20 }}>Requests submitted through the public booking form.</p>

      <div className="mono" style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 999, fontSize: 12.5,
            background: filter === f ? 'var(--mint)' : 'transparent',
            color: filter === f ? 'var(--ink)' : 'var(--slate)',
            border: filter === f ? 'none' : '1px solid rgba(237,239,247,0.15)'
          }}>{f.replace('_', ' ')}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--slate)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shown.length === 0 && <p style={{ color: 'var(--slate)' }}>No bookings in this view.</p>}
          {shown.slice().reverse().map(b => (
            <div key={b.id} className="card" style={{ padding: 20, opacity: busyId === b.id ? 0.6 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{b.name}</div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>{b.email} {b.phone && `· ${b.phone}`}</div>
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--slate-dim)' }}>{new Date(b.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--slate)', marginBottom: 6 }}><strong style={{ color: 'var(--paper)' }}>Service:</strong> {b.service}</div>
              {b.budget && <div style={{ fontSize: 13.5, color: 'var(--slate)', marginBottom: 6 }}><strong style={{ color: 'var(--paper)' }}>Budget:</strong> {b.budget}</div>}
              {b.details && <div style={{ fontSize: 13.5, color: 'var(--slate)', marginBottom: 14 }}><strong style={{ color: 'var(--paper)' }}>Details:</strong> {b.details}</div>}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={b.status} onChange={e => setStatus(b.id, e.target.value)} style={selectStyle} disabled={busyId === b.id}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <select value={b.paymentStatus || 'unpaid'} onChange={e => setPayment(b.id, e.target.value)} style={selectStyle} disabled={busyId === b.id}>
                  <option value="unpaid">Unpaid</option>
                  <option value="deposit_paid">Deposit paid</option>
                  <option value="paid">Paid in full</option>
                </select>
                <button className="btn btn-danger btn-sm" onClick={() => remove(b.id)} disabled={busyId === b.id}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const selectStyle = {
  background: 'rgba(237,239,247,0.05)', border: '1px solid rgba(237,239,247,0.15)',
  borderRadius: 8, padding: '8px 10px', color: 'var(--paper)', fontSize: 13
}
