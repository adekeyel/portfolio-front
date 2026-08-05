import { useLocation, Link } from 'react-router-dom'

export default function BookingConfirmed() {
  const location = useLocation()
  const name = location.state?.name || 'there'
  const bookingId = location.state?.bookingId

  return (
    <section className="section" style={{ paddingTop: 96, minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,217,163,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          fontSize: 28, color: 'var(--mint)'
        }}>✓</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', marginBottom: 16 }}>Thanks, {name.split(' ')[0]}.</h1>
        <p style={{ color: 'var(--slate)', fontSize: 16, marginBottom: 8 }}>
          Your booking request has been received. I'll review the details and follow up by email within 24 hours to confirm a call time and next steps — including a secure payment link once scope is agreed.
        </p>
        {bookingId && (
          <p className="mono" style={{ color: 'var(--slate-dim)', fontSize: 12.5, marginBottom: 32 }}>
            Reference: {bookingId}
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
          <Link to="/portfolio" className="btn btn-primary">See More Work →</Link>
        </div>
      </div>
    </section>
  )
}
