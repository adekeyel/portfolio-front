import { useState, useEffect, useRef } from 'react'

export default function TerminalHero({ lines }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [charIndex, setCharIndex] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!lines || lines.length === 0) return
    let lineIdx = 0
    let charIdx = 0
    let current = []
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setVisibleLines(lines)
      doneRef.current = true
      return
    }

    const interval = setInterval(() => {
      if (lineIdx >= lines.length) {
        clearInterval(interval)
        doneRef.current = true
        return
      }
      const line = lines[lineIdx]
      charIdx++
      const partial = [...current, line.slice(0, charIdx)]
      setVisibleLines(partial)

      if (charIdx >= line.length) {
        current = [...current, line]
        lineIdx++
        charIdx = 0
      }
    }, 22)

    return () => clearInterval(interval)
  }, [lines])

  return (
    <div className="mono" style={termStyle}>
      <div style={dotsRow}>
        <span style={{ ...dot, background: '#FF5F56' }} />
        <span style={{ ...dot, background: '#FFBD2E' }} />
        <span style={{ ...dot, background: '#27C93F' }} />
        <span style={{ marginLeft: 12, color: 'var(--slate-dim)', fontSize: 12 }}>terminal — zsh</span>
      </div>
      <div style={{ padding: '20px 22px', minHeight: 180 }}>
        {visibleLines.map((line, i) => (
          <div key={i} style={{ fontSize: 14.5, lineHeight: 1.9, color: line.startsWith('$') ? 'var(--mint)' : 'var(--paper)' }}>
            {line}
            {i === visibleLines.length - 1 && <span className="cursor-blink">▌</span>}
          </div>
        ))}
      </div>
      <style>{`
        .cursor-blink { animation: blink 1s step-start infinite; color: var(--mint); }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}

const termStyle = {
  background: '#080A0F',
  border: '1px solid rgba(245,243,234,0.12)',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 30px 80px rgba(0,0,0,0.5)'
}

const dotsRow = {
  display: 'flex', alignItems: 'center', gap: 7,
  padding: '12px 16px', borderBottom: '1px solid rgba(245,243,234,0.08)'
}

const dot = { width: 11, height: 11, borderRadius: '50%' }
