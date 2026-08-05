import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import SectionHeading from '../components/SectionHeading.jsx'

export default function Booking() {
  const { data: services } = useStoreData(() => store.getServices())
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', budget: '', details: '', preferredDate: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function update(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function validate() {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email.'
    if (!form.service) return 'Please choose a service.'
    if (!form.details.trim()) return 'Tell me briefly what you need built.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setSubmitting(true)

    try {
      const booking = await store.addBooking({ ...form })

      // NOTE: Payment integration. For a fixed-price service you could
      // call store.initializePayment() right here and redirect the
      // visitor to the returned checkout URL instead of the confirmation
      // page. Left as a manual admin step by default, since bespoke
      // project pricing is usually confirmed on the discovery call —
      // see BACKEND_GUIDE.md for the full automatic-checkout version.
      navigate('/booking/confirmed', { state: { bookingId: booking.id, name: form.name } })
    } catch (err) {
      setError(err.message || 'Something went wrong submitting your booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="wrap booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56 }}>
        <div>
          <SectionHeading eyebrow="Book a call" title="Let's scope your project" sub="Fill this in and I'll get back to you within 24 hours to confirm a time." />
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>What happens next</h3>
            {[
              'You submit your project details below',
              'I review and confirm a call time by email',
              'We scope the build together on the call',
              'You receive a quote and payment link to begin'
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 14, color: 'var(--slate)' }}>
                <span className="mono" style={{ color: 'var(--mint)' }}>{String(i + 1).padStart(2, '0')}</span>
                {step}
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <p className="mono" style={{ fontSize: 12, color: 'var(--slate)' }}>SECURE PAYMENTS VIA</p>
            <p style={{ fontSize: 15, marginTop: 8 }}>Paystack · Flutterwave</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
          <div className="form-field">
            <label htmlFor="name">Full name</label>
            <input id="name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234..." />
          </div>
          <div className="form-field">
            <label htmlFor="service">Service</label>
            <select id="service" value={form.service} onChange={e => update('service', e.target.value)}>
              <option value="">Select a service</option>
              {(services || []).map(s => <option key={s.id} value={s.name}>{s.name} — from {s.priceFrom}</option>)}
              <option value="Other">Something else</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="budget">Estimated budget (optional)</label>
            <input id="budget" value={form.budget} onChange={e => update('budget', e.target.value)} placeholder="e.g. ₦500,000 – ₦1,000,000" />
          </div>
          <div className="form-field">
            <label htmlFor="date">Preferred call date (optional)</label>
            <input id="date" type="date" value={form.preferredDate} onChange={e => update('preferredDate', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="details">Project details</label>
            <textarea id="details" value={form.details} onChange={e => update('details', e.target.value)} placeholder="What are you looking to build?" />
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Request Booking →'}
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 860px) { .booking-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
