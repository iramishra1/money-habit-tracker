import React from 'react'

const PAGES = {
  analyze:  { title: 'Analyze a Purchase',   sub: 'Get your regret probability before you buy'       },
  history:  { title: 'Purchase History',      sub: 'Track your financial decisions over time'         },
  insights: { title: 'My Spending Patterns',  sub: 'AI-detected behavioral patterns from your history' },
}

const TABS = ['analyze', 'history', 'insights']
const TAB_LABELS = { analyze: 'Analyze', history: 'History', insights: 'Insights' }

export default function Topbar({ activeTab, onTabChange }) {
  const { title, sub } = PAGES[activeTab]

  return (
    <div style={styles.bar}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.sub}>{sub}</p>
      </div>
      <div style={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t}
            style={{ ...styles.tab, ...(activeTab === t ? styles.tabActive : {}) }}
            onClick={() => onTabChange(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  bar: {
    padding: '18px 32px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexShrink: 0,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text)',
  },
  sub: {
    fontSize: 12,
    color: 'var(--muted)',
    marginTop: 2,
  },
  tabBar: {
    display: 'flex',
    gap: 2,
    background: 'var(--surface2)',
    borderRadius: 9,
    padding: 3,
  },
  tab: {
    padding: '6px 16px',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: 'var(--muted)',
    transition: 'all 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  tabActive: {
    background: 'var(--surface3)',
    color: 'var(--text)',
  },
}
