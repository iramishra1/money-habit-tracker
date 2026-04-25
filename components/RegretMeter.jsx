import React, { useEffect, useState } from 'react'
import { scoreColor, scoreVerdict } from '../lib/scoring'

export default function RegretMeter({ score }) {
  const [displayed, setDisplayed] = useState(0)
  const color = scoreColor(score)
  const { label } = scoreVerdict(score)

  // Animate score on mount
  useEffect(() => {
    const start = performance.now()
    const duration = 900
    function frame(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayed(Math.round(eased * score))
      if (t < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [score])

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div>
          <div style={styles.metaLabel}>Regret probability</div>
          <div style={{ ...styles.scoreNum, color }}>{displayed}%</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={styles.metaLabel}>Verdict</div>
          <div style={{ ...styles.verdict, color }}>{label}</div>
        </div>
      </div>

      {/* Bar */}
      <div style={styles.barTrack}>
        <div
          style={{
            ...styles.barFill,
            width: `${score}%`,
            background: color,
            transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      <div style={styles.ticks}>
        <span>No regret</span>
        <span>Maybe</span>
        <span>Risky</span>
        <span>Certain regret</span>
      </div>

      {/* Dual bars */}
    </div>
  )
}

const styles = {
  wrap: {
    padding: '20px 24px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: 16,
    animation: 'fadeIn 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  metaLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    marginBottom: 4,
  },
  scoreNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 58,
    fontWeight: 700,
    lineHeight: 1,
  },
  verdict: {
    fontSize: 16,
    fontWeight: 600,
  },
  barTrack: {
    height: 8,
    background: 'var(--surface3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    width: '0%',
  },
  ticks: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 10,
    color: 'var(--muted)',
  },
}
