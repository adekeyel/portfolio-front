import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import SectionHeading from '../components/SectionHeading.jsx'

export default function Careers() {
  const { data: jobs, loading } = useStoreData(() => store.getJobs())
  const [applyingTo, setApplyingTo] = useState(null)

  const active = (jobs || []).filter(j => j.active)

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="wrap">
        <SectionHeading eyebrow="Careers" title="Work with 4GO Technology" sub="We take on collaborators for client builds when scope calls for it. Open roles below." />

        {loading ? (
          <p style={{ color: 'var(--slate)' }}>Loading…</p>
        ) : active.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <p style={{ color: 'var(--slate)' }}>No open roles right now — check back soon, or send a general enquiry via the Contact page.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {active.map(job => (
              <div key={job.id} className="card" style={{ padding: 26 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 19 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="tag">{job.type}</span>
                    <span className="tag">{job.location}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--slate)', fontSize: 14.5, marginBottom: 18 }}>{job.description}</p>
                {applyingTo === job.id ? (
                  <ApplyForm jobId={job.id} jobTitle={job.title} onDone={() => setApplyingTo(null)} />
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => setApplyingTo(job.id)}>Apply Now →</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ApplyForm({ jobId, jobTitle, onDone }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter your name and a valid email.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await store.applyToJob(jobId, form)
      setSent(true)
      setTimeout(onDone, 1800)
    } catch (err) {
      setError(err.message || 'Failed to submit application.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) return <p style={{ color: 'var(--mint)', fontSize: 14 }}>✓ Application received — thank you.</p>

  return (
    <form onSubmit={submit} style={{ marginTop: 16, borderTop: '1px solid rgba(237,239,247,0.08)', paddingTop: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
      </div>
      <textarea placeholder="Brief note / portfolio link" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ ...inputStyle, width: '100%', minHeight: 80, marginBottom: 14 }} />
      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Application'}</button>
    </form>
  )
}

const inputStyle = {
  background: 'rgba(237,239,247,0.04)', border: '1px solid rgba(237,239,247,0.15)',
  borderRadius: 8, padding: '10px 12px', color: 'var(--paper)'
}
