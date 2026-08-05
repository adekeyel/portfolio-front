import { useState } from 'react'
import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'
import SectionHeading from '../components/SectionHeading.jsx'
import PortfolioCard from '../components/PortfolioCard.jsx'

export default function Portfolio() {
  const { data: items, loading } = useStoreData(() => store.getPortfolio())
  const [filter, setFilter] = useState('all')

  const list = items || []
  const shown = filter === 'featured' ? list.filter(i => i.featured) : list

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="wrap">
        <SectionHeading eyebrow="Portfolio" title="Selected work" sub="Full-stack platforms built end to end — from architecture to launch." />

        <div className="mono" style={{ display: 'flex', gap: 10, marginBottom: 36 }}>
          {['all', 'featured'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13,
              background: filter === f ? 'var(--mint)' : 'transparent',
              color: filter === f ? 'var(--ink)' : 'var(--slate)',
              border: filter === f ? 'none' : '1px solid rgba(237,239,247,0.15)'
            }}>{f === 'all' ? 'All Work' : 'Featured'}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--slate)' }}>Loading…</p>
        ) : shown.length === 0 ? (
          <p style={{ color: 'var(--slate)' }}>No projects to show yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {shown.map(item => <PortfolioCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </section>
  )
}
