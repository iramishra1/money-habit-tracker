import React from 'react'
import {
  Brain, ClipboardList, BarChart2, TrendingDown,
  DollarSign, Target, Zap
} from 'lucide-react'
import { computeStats, scoreColor } from '../lib/scoring'

const NAV = [
  { id: 'analyze',  label: 'Analyze Purchase', Icon: Brain        },
  { id: 'history',  label: 'Purchase History',  Icon: ClipboardList },
  { id: 'insights', label: 'My Patterns',       Icon: BarChart2    },
]

export default function Sidebar({ activeTab, onTabChange, purchases }) {
  const { avg, saved, accuracy, count } = computeStats(purchases)

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <TrendingDown size={18} color="#1a1206" strokeWidth={2.5} />
        </div>
        <div>
          <div style={styles.logoText}>Regret Minimizer</div>
          <div style={styles.logoSub}>AI Spending Oracle</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>Navigation</div>
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            style={{
              ...styles.navItem,
              ...(activeTab === id ? styles.navItemActive : {}),
            }}
            onClick={() => onTabChange(id)}
          >
            <Icon size={15} strokeWidth={activeTab === id ? 2.5 : 2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Stats mini */}
      <div style={styles.statsMini}>
        <div style={styles.statsMiniLabel}>Your profile</div>

        <StatRow
          Icon={Target}
          label="Analyzed"
          value={count}
          valueColor="var(--safe)"
        />
        <StatRow
          Icon={Brain}
          label="Avg regret risk"
          value={avg !== null ? `${avg}%` : '—'}
          valueColor={avg !== null ? scoreColor(avg) : 'var(--muted)'}
        />
        <StatRow
          Icon={DollarSign}
          label="Saved (avoided)"
          value={`$${saved.toLocaleString()}`}
          valueColor="var(--safe)"
        />
        <StatRow
          Icon={Zap}
          label="AI accuracy"
          value={accuracy !== null ? `${accuracy}%` : '—'}
          valueColor="var(--accent)"
        />
      </div>
    </aside>
  )
}

function StatRow({ Icon, label, value, valueColor }) {
  return (
    <div style={styles.statRow}>
      <div style={styles.statLeft}>
        <Icon size={12} color="var(--muted)" strokeWidth={2} />
        <span style={styles.statLabel}>{label}</span>
      </div>
      <span style={{ ...styles.statVal, color: valueColor }}>{value}</span>
    </div>
  )
}

const styles = {
  sidebar: {
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    width: 256,
    minWidth: 256,
    padding: '28px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    height: '100vh',
    overflowY: 'auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--accent)',
    lineHeight: 1.15,
  },
  logoSub: {
    fontSize: 10,
    color: 'var(--muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navLabel: {
    fontSize: 10,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    padding: '0 8px',
    marginBottom: 6,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '9px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--muted)',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'var(--accent-bg)',
    color: 'var(--accent)',
    fontWeight: 500,
  },
  statsMini: {
    marginTop: 'auto',
    padding: '16px',
    background: 'var(--surface2)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  statsMiniLabel: {
    fontSize: 10,
    color: 'var(--muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: 'var(--muted)',
  },
  statVal: {
    fontSize: 13,
    fontWeight: 600,
  },
}
