import { Link } from 'react-router-dom'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'

export default function AdminDashboard() {
  const { data: portfolio } = useStoreData(() => store.getPortfolio())
  const { data: services } = useStoreData(() => store.getServices())
  const { data: bookings } = useStoreData(() => store.getBookings())
  const { data: jobs } = useStoreData(() => store.getJobs())

  const bookingList = bookings || []
  const pendingBookings = bookingList.filter(b => b.status === 'pending').length

  const stats = [
    { label: 'Portfolio Items', value: (portfolio || []).length, to: '/admin/portfolio' },
    { label: 'Services', value: (services || []).length, to: '/admin/services' },
    { label: 'Pending Bookings', value: pendingBookings, to: '/admin/bookings' },
    { label: 'Open Jobs', value: (jobs || []).filter(j => j.active).length, to: '/admin/jobs' },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 6 }}>Overview</h1>
      <p style={{ color: 'var(--slate)', fontSize: 14.5, marginBottom: 32 }}>Manage everything shown on your public site from here.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <Link key={s.label} to={s.to} className="card" style={{ padding: 22, display: 'block' }}>
            <div className="mono" style={{ fontSize: 32, color: 'var(--mint)', marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 13.5, color: 'var(--slate)' }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, marginBottom: 16 }}>Recent Bookings</h2>
      {bookingList.length === 0 ? (
        <p style={{ color: 'var(--slate)', fontSize: 14 }}>No bookings yet — they'll show up here as soon as someone submits the booking form.</p>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {bookingList.slice().reverse().slice(0, 6).map(b => (
            <div key={b.id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(237,239,247,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 14.5 }}>{b.name}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>{b.service}</div>
              </div>
              <span className="tag">{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
