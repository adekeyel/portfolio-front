import { Fragment } from 'react'

export default function BlueprintHero({ profile }) {
  const stackLine = (profile.stack || []).slice(0, 3).join(' · ') || 'React · Node · Postgres'
  const isAvailable = profile.availability === 'available'

  const nodes = [
    { label: 'Frontend', detail: 'React', time: '1wk' },
    { label: 'API', detail: 'Node / Express', time: '1wk' },
    { label: 'Database', detail: 'PostgreSQL', time: '<1wk' },
    { label: 'Payments', detail: 'Paystack', time: null },
  ]

  return (
    <div>
      <div className="card" style={titleBlockStyle}>
        <Field label="Client" value={profile.company || 'Your business'} />
        <Field label="Status" value={isAvailable ? 'Available for work' : 'Currently booked'} dot={isAvailable ? 'var(--status-green)' : 'var(--danger)'} />
        <Field label="Delivery" value="From 3 weeks" />
        <Field label="Stack" value={stackLine} />
      </div>

      <div className="card" style={diagramStyle}>
        <div className="mono diagram-row" style={diagramRowStyle}>
          {nodes.map((n, i) => (
            <Fragment key={n.label}>
              <div style={nodeStyle}>
                <b style={{ display: 'block', fontSize: 12.5, marginBottom: 3, color: 'var(--paper)' }}>{n.label}</b>
                {n.detail}
              </div>
              {i < nodes.length - 1 && (
                <div data-connector style={connectorStyle}>
                  <div style={dimLineStyle} />
                  {n.time && <small style={{ fontSize: 9.5, marginTop: 4 }}>{n.time}</small>}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 520px) {
          .diagram-row { flex-direction: column; }
          .diagram-row > div[data-connector] { display: none; }
        }
      `}</style>
    </div>
  )
}

function Field({ label, value, dot }) {
  return (
    <div>
      <span style={{ display: 'block', fontSize: 10, color: 'var(--slate)', marginBottom: 3 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
        {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flex: 'none' }} />}
        {value}
      </span>
    </div>
  )
}

const titleBlockStyle = {
  padding: '20px 22px', marginBottom: 20,
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px',
}

const diagramStyle = { padding: '26px 20px 20px' }

const diagramRowStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap',
}

const nodeStyle = {
  border: '1.5px solid rgba(237,239,247,0.35)', background: 'rgba(11,16,36,0.4)',
  padding: '13px 10px', textAlign: 'center', fontSize: 11, flex: '1 1 90px', minWidth: 84,
  borderRadius: 6, color: 'var(--slate)',
}

const connectorStyle = {
  flex: '0 0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--slate)',
}

const dimLineStyle = { width: '100%', borderTop: '1px dashed var(--blue)', marginTop: 8 }
