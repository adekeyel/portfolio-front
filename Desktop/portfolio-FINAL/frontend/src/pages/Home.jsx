import { Link } from 'react-router-dom'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import BlueprintHero from '../components/BlueprintHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import PortfolioCard from '../components/PortfolioCard.jsx'

export default function Home() {
  const { data: profile, loading: profileLoading } = useStoreData(() => store.getProfile())
  const { data: portfolio } = useStoreData(() => store.getPortfolio())
  const { data: services } = useStoreData(() => store.getServices())
  const { data: testimonials } = useStoreData(() => store.getTestimonials())

  if (profileLoading || !profile) {
    return <div style={{ minHeight: '60vh' }} />
  }

  const featured = (portfolio || []).filter(p => p.featured).slice(0, 4)

  return (
    <>
      {/* HERO */}
      <section style={{ padding: '76px 0 96px' }}>
        <div className="wrap hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>{profile.yearsExperience}+ years · full-stack development</div>
            <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 62px)', marginBottom: 22 }}>
              {profile.tagline}
            </h1>
            <p style={{ fontSize: 18, color: 'var(--slate)', maxWidth: 480, marginBottom: 34 }}>
              {profile.subhead}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-primary">Book a Free Discovery Call →</Link>
              <Link to="/portfolio" className="btn btn-secondary">See the Work</Link>
            </div>
          </div>
          <BlueprintHero profile={profile} />
        </div>
      </section>

      {/* TRUST STRIP */}
      <div style={{ borderTop: '1px solid rgba(237,239,247,0.08)', borderBottom: '1px solid rgba(237,239,247,0.08)', padding: '22px 0' }}>
        <div className="wrap mono" style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', fontSize: 13, color: 'var(--slate)' }}>
          {profile.stack.map(s => <span key={s}>{s}</span>)}
        </div>
      </div>

      {/* FEATURED WORK */}
      {featured.length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHeading
              fig="FIG. 01"
              eyebrow="Selected work"
              title="Recently shipped"
              sub="A sample of platforms built end to end — architecture through launch, across fintech, e-commerce and logistics."
              action={<Link to="/portfolio" className="btn btn-secondary">View all work →</Link>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {featured.map(item => <PortfolioCard key={item.id} item={item} />)}
            </div>
          </div>
        </section>
      )}

      {/* WHAT YOU GET */}
      <section className="section">
        <div className="wrap">
          <SectionHeading
            fig="FIG. 02"
            eyebrow="What you get"
            title="A website that works as hard as your business does"
            sub="Not a template. A platform built around what your customers actually need to do — browse, order, pay, and reach you."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              ['View products anytime', 'A catalog that\'s always open, on any device.'],
              ['Order easily', 'A checkout flow with no friction and no confusion.'],
              ['Pay securely', 'Paystack and Flutterwave integration, done right.'],
              ['Reach you directly', 'Contact and booking built into every page.'],
              ['Manage it yourself', 'An admin dashboard to add or remove anything, anytime.'],
              ['Built to last', 'Clean architecture that scales as your business grows.'],
            ].map(([title, desc]) => (
              <div key={title} className="card" style={{ padding: 24 }}>
                <div style={{ color: 'var(--mint)', fontSize: 20, marginBottom: 10 }}>✓</div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--slate)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES / PRICING */}
      <section className="section">
        <div className="wrap">
          <SectionHeading fig="FIG. 03" eyebrow="Services" title="Pick your starting point" sub="Every engagement starts with a free discovery call to scope exactly what you need." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
            {(services || []).map(s => (
              <div key={s.id} className="card" style={{ padding: 30, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 21, marginBottom: 8 }}>{s.name}</h3>
                <div className="mono" style={{ color: 'var(--mint)', fontSize: 22, marginBottom: 4 }}>{s.priceFrom}</div>
                <div className="mono" style={{ color: 'var(--slate)', fontSize: 12.5, marginBottom: 18 }}>from · {s.duration}</div>
                <p style={{ fontSize: 14.5, color: 'var(--slate)', marginBottom: 20, flex: 1 }}>{s.description}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.features.map(f => (
                    <li key={f} style={{ fontSize: 13.5, color: 'var(--paper)', display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--mint)' }}>—</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to="/booking" className="btn btn-primary btn-block">Get Started →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHeading eyebrow="Client feedback" title="What clients say" align="center" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
              {testimonials.map(t => (
                <div key={t.id} className="card" style={{ padding: 26 }}>
                  <div style={{ color: 'var(--mint)', marginBottom: 12 }}>{'★'.repeat(t.rating)}</div>
                  <p style={{ fontSize: 15, color: 'var(--paper)', marginBottom: 16, fontStyle: 'italic' }}>"{t.quote}"</p>
                  <p className="mono" style={{ fontSize: 12.5, color: 'var(--slate)' }}>{t.name} · {t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section style={{ padding: '110px 0' }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', marginBottom: 18, maxWidth: 640, marginInline: 'auto' }}>
            Your business deserves a website that actually works.
          </h2>
          <p style={{ color: 'var(--slate)', fontSize: 17, marginBottom: 34 }}>
            Delivery in as little as 3 weeks. Let's scope it on a free call.
          </p>
          <Link to="/booking" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: 16 }}>
            Book Your Free Discovery Call →
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
