import { store } from '../data/store.js'
import { useStoreData } from '../hooks/useStoreData.js'

export default function Terms() {
  const { data: legal, loading } = useStoreData(() => store.getLegal())

  if (loading || !legal) return <div style={{ minHeight: '60vh' }} />

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="container-narrow">
        <div className="eyebrow" style={{ marginBottom: 16 }}>Legal</div>
        <h1 style={{ fontSize: 'clamp(30px, 4vw, 40px)', marginBottom: 32 }}>Terms of Service</h1>
        <div style={{ fontSize: 15.5, lineHeight: 1.9, color: 'var(--slate)', whiteSpace: 'pre-line' }}>
          {legal?.termsOfService}
        </div>
      </div>
    </section>
  )
}
