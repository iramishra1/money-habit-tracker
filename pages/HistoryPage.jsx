import React from 'react'
import { CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react'
import { scoreColor } from '../lib/scoring'

const OUTCOME_CONFIG = {
  kept:      { label: 'Kept it',   Icon: CheckCircle, color: 'var(--safe)',   bg: 'var(--safe-bg)'   },
  regretted: { label: 'Regretted', Icon: XCircle,     color: 'var(--danger)', bg: 'var(--danger-bg)' },
  pending:   { label: 'Pending',   Icon: Clock,       color: 'var(--muted)',  bg: 'rgba(112,110,104,0.12)' },
}

export default function HistoryPage({ purchases, onUpdateOutcome, onClearAll }) {
  if (purchases.length === 0) {
    return (
      <div style={styles.empty}>
        <Clock size={32} color="var(--muted)" strokeWidth={1.5} />
        <div style={styles.emptyTitle}>No history yet</div>
        <p style={styles.emptyDesc}>Analyze your first purchase to start building your decision history.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={styles.header}>
        <span style={styles.count}>{purchases.length} purchase{purchases.length !== 1 ? 's' : ''} analyzed</span>
        <button style={styles.clearBtn} onClick={() => { if (window.confirm('Clear all history?')) onClearAll() }}>
          <Trash2 size={13} strokeWidth={2} />
          Clear all
        </button>
      </div>

      <div style={styles.list}>
        {purchases.map(p => {
          const { label, Icon, color, bg } = OUTCOME_CONFIG[p.outcome] || OUTCOME_CONFIG.pending
          const scoreCol = scoreColor(p.score)
          return (
            <div key={p.id} style={styles.item}>
              <div style={styles.itemMain}>
                <div style={styles.itemName}>{p.name}</div>
                <div style={styles.itemMeta}>{p.category} · {p.date}</div>
              </div>
              <div style={styles.itemPrice}>${p.price?.toLocaleString()}</div>
              <div style={{ ...styles.scoreChip, color: scoreCol, borderColor: scoreCol + '40' }}>
                {p.score}%
              </div>
              <div style={{ ...styles.outcomeBadge, background: bg, color }}>
                <Icon size={11} strokeWidth={2.5} />
                {label}
              </div>
              {p.outcome === 'pending' && (
                <div style={styles.outcomeActions}>
                  <button
                    style={{ ...styles.actionBtn, color: 'var(--safe)' }}
                    onClick={() => onUpdateOutcome(p.id, 'kept')}
                  >
                    <CheckCircle size={13} strokeWidth={2} /> Kept
                  </button>
                  <button
                    style={{ ...styles.actionBtn, color: 'var(--danger)' }}
                    onClick={() => onUpdateOutcome(p.id, 'regretted')}
                  >
                    <XCircle size={13} strokeWidth={2} /> Regret
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '80px 40px',
    textAlign: 'center',
    color: 'var(--muted)',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: 'var(--text)',
  },
  emptyDesc: {
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.6,
    maxWidth: 300,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  count: {
    fontSize: 12,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--muted)',
    background: 'none',
    border: '1px solid var(--border2)',
    borderRadius: 6,
    padding: '5px 10px',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'color 0.15s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '14px 18px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    animation: 'fadeIn 0.25s ease',
  },
  itemMain: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemMeta: {
    fontSize: 11,
    color: 'var(--muted)',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
    whiteSpace: 'nowrap',
  },
  scoreChip: {
    fontSize: 13,
    fontWeight: 600,
    padding: '3px 10px',
    border: '1px solid',
    borderRadius: 20,
    whiteSpace: 'nowrap',
  },
  outcomeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    whiteSpace: 'nowrap',
  },
  outcomeActions: {
    display: 'flex',
    gap: 6,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    fontWeight: 500,
    padding: '4px 10px',
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    borderRadius: 6,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: 'nowrap',
    transition: 'background 0.15s',
  },
}
