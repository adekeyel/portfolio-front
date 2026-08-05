import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import SectionHeading from '../components/SectionHeading.jsx'

export default function Contact() {
  const { data: profile, loading } = useStoreData(() => store.getProfile())
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !form.message.trim()) {
      setError('Please fill in all fields with a valid email.')
      return
    }
    setError('')
    setSending(true)
    try {
      await store.sendContactMessage(form)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (loading || !profile) return <div style={{ minHeight: '60vh' }} />

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="wrap contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56 }}>
        <div>
          <SectionHeading eyebrow="Contact" title="Get in touch" sub="Prefer email or phone? Reach out directly — I respond within a business day." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <ContactRow label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <ContactRow label="Phone" value={profile.phone} href={`tel:${profile.phone}`} />
            <ContactRow label="Location" value={profile.location} />
            <ContactRow label="Company" value={profile.company} />
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 32, color: 'var(--mint)', marginBottom: 14 }}>✓</div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>Message sent</h3>
              <p style={{ color: 'var(--slate)', fontSize: 14 }}>Thanks for reaching out — I'll reply soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="cname">Name</label>
                <input id="cname" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div className="form-field">
                <label htmlFor="cemail">Email</label>
                <input id="cemail" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@company.com" />
              </div>
              <div className="form-field">
                <label htmlFor="cmessage">Message</label>
                <textarea id="cmessage" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="How can I help?" />
              </div>
              {error && <p style={{ color: 'var(--danger)', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}
              <button type="submit" className="btn btn-primary btn-block" disabled={sending}>{sending ? 'Sending…' : 'Send Message →'}</button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

function ContactRow({ label, value, href }) {
  const content = href ? <a href={href} style={{ color: 'var(--mint)' }}>{value}</a> : value
  return (
    <div style={{ borderBottom: '1px solid rgba(237,239,247,0.08)', paddingBottom: 14 }}>
      <div className="mono" style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16 }}>{content}</div>
    </div>
  )
}
