import React from 'react'
import { BarChart2, TrendingDown, Zap, DollarSign } from 'lucide-react'
import { computeStats, scoreColor, derivePatterns } from '../lib/scoring'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts'

export default function InsightsPage({ purchases }) {
  const { avg, saved, accuracy, count } = computeStats(purchases)
  const patterns = derivePatterns(purchases)

  // Category breakdown
  const catData = Object.entries(
    purchases.reduce((acc, p) => {
      const short = p.category?.split(' & ')[0] || p.category || 'Other'
      if (!acc[short]) acc[short] = { name: short, avg: 0, count: 0 }
      acc[short].avg   += p.score
      acc[short].count += 1
      return acc
    }, {})
  ).map(([, v]) => ({ name: v.name, avg: Math.round(v.avg / v.count), count: v.count }))
   .sort((a, b) => b.avg - a.avg)

  // Score trend
  const trendData = [...purchases]
    .reverse()
    .map((p, i) => ({ index: i + 1, score: p.score, name: p.name }))

  if (purchases.length === 0) {
    return (
      <div style={styles.empty}>
        <BarChart2 size={32} color="var(--muted)" strokeWidth={1.5} />
        <div style={styles.emptyTitle}>No data yet</div>
        <p style={styles.emptyDesc}>
          Analyze at least 3 purchases to unlock your behavioral pattern dashboard.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Stat cards */}
      <div style={styles.statGrid}>
        <StatCard Icon={BarChart2} label="Purchases analyzed" value={count}              color="var(--accent)" />
        <StatCard Icon={TrendingDown} label="Avg regret score"  value={avg !== null ? avg + '%' : '—'} color={avg !== null ? scoreColor(avg) : 'var(--muted)'} />
        <StatCard Icon={DollarSign}  label="Value protected"   value={'$' + saved.toLocaleString()} color="var(--safe)" />
        <StatCard Icon={Zap}         label="Prediction accuracy" value={accuracy !== null ? accuracy + '%' : 'Need outcomes'} color="var(--accent2)" />
      </div>

      {/* Charts row */}
      {purchases.length >= 2 && (
        <div style={styles.chartsRow}>
          {catData.length > 1 && (
            <div style={styles.chartCard}>
              <div style={styles.cardTitle}>Avg regret by category</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={catData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'var(--text)' }}
                    itemStyle={{ color: 'var(--accent)' }}
                  />
                  <Bar dataKey="avg" fill="var(--accent)" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {trendData.length >= 2 && (
            <div style={styles.chartCard}>
              <div style={styles.cardTitle}>Regret score trend</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={trendData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="index" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'purchase #', position: 'insideBottom', fill: 'var(--muted)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'var(--text)' }}
                    itemStyle={{ color: 'var(--accent)' }}
                    formatter={(v, _, props) => [v + '%', props?.payload?.name || 'Score']}
                  />
                  <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Behavioral patterns */}
      {patterns.length > 0 ? (
        <div>
          <div style={styles.sectionLabel}>Behavioral patterns</div>
          {patterns.map((p, i) => (
            <div key={i} style={styles.patternCard}>
              <div style={styles.patternTitle}>{p.title}</div>
              <p style={styles.patternDesc}>{p.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.patternCard}>
          <div style={styles.patternTitle}>Analyzing patterns...</div>
          <p style={styles.patternDesc}>Analyze at least 3 purchases to unlock personalized behavioral insights.</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ Icon, label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>
        <Icon size={14} color={color} strokeWidth={2} />
      </div>
      <div style={{ ...styles.statNum, color }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  )
}

const styles = {
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '80px 40px',
    textAlign: 'center',
    color: 'var(--muted)',
  },
  emptyTitle: { fontSize: 16, fontWeight: 500, color: 'var(--text)' },
  emptyDesc:  { fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 300 },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  statIcon: { marginBottom: 2 },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1,
  },
  statLabel: { fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
    marginBottom: 20,
  },
  chartCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
  },
  cardTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.09em',
    color: 'var(--muted)',
    marginBottom: 14,
    fontWeight: 500,
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.09em',
    color: 'var(--muted)',
    marginBottom: 12,
    fontWeight: 500,
  },
  patternCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    marginBottom: 10,
  },
  patternTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 6,
  },
  patternDesc: {
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.65,
  },
}
