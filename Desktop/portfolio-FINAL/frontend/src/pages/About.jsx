import { Link } from 'react-router-dom'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import SectionHeading from '../components/SectionHeading.jsx'

export default function About() {
  const { data: profile, loading } = useStoreData(() => store.getProfile())

  if (loading || !profile) return <div style={{ minHeight: '60vh' }} />

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="wrap about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 56 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>About</div>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 46px)', marginBottom: 20 }}>{profile.name}</h1>
          <p className="mono" style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 24 }}>{profile.title}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 30 }}>
            <InfoRow label="Company" value={profile.company} />
            <InfoRow label="Location" value={profile.location} />
            <InfoRow label="Experience" value={`${profile.yearsExperience}+ years`} />
            <InfoRow label="Status" value={profile.availability === 'available' ? 'Available for work' : 'Currently booked'} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30 }}>
            {profile.stack.map(s => <span key={s} className="tag">{s}</span>)}
          </div>

          <Link to="/booking" className="btn btn-primary">Book a Call →</Link>
        </div>

        <div>
          {profile.about.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--paper)', marginBottom: 24 }}>{para}</p>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .about-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(237,239,247,0.08)', paddingBottom: 10 }}>
      <span className="mono" style={{ fontSize: 12.5, color: 'var(--slate)' }}>{label}</span>
      <span style={{ fontSize: 14 }}>{value}</span>
    </div>
  )
}
