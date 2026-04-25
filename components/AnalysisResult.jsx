import React from 'react'
import {
  AlertTriangle, TrendingDown, Clock, Lightbulb,
  ArrowRight, CheckCircle, XCircle
} from 'lucide-react'
import RegretMeter from './RegretMeter'
import { impactColor } from '../lib/scoring'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const FACTOR_ICONS = {
  high:   AlertTriangle,
  medium: TrendingDown,
  low:    CheckCircle,
}

export default function AnalysisResult({ result, itemName, itemPrice }) {
  if (!result) return null

  const {
    regret_score,
    analysis,
    emotional_regret,
    financial_regret,
    factors,
    alternatives,
    wait_recommendation_days,
    behavioral_tag,
  } = result

  const radarData = [
    { axis: 'Emotional',  value: emotional_regret  || regret_score },
    { axis: 'Financial',  value: financial_regret  || regret_score },
    { axis: 'Impulse',    value: factors?.filter(f=>f.impact==='high').length * 33 || 30 },
    { axis: 'Necessity',  value: 100 - (result.urgency_penalty || regret_score) },
    { axis: 'Long-term',  value: wait_recommendation_days > 7 ? 70 : 30 },
  ]

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <RegretMeter score={regret_score} />

      {/* Analysis text */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <Lightbulb size={13} color="var(--accent)" strokeWidth={2} />
          Oracle's verdict
        </div>
        <p style={styles.analysisText}>{analysis}</p>

        {wait_recommendation_days > 0 && (
          <div style={styles.waitBox}>
            <Clock size={14} color="var(--warn)" strokeWidth={2} />
            <span>Wait <strong>{wait_recommendation_days} days</strong> before deciding. Hedonic adaptation is real.</span>
          </div>
        )}

        {behavioral_tag && (
          <div style={styles.tagRow}>
            <span style={styles.behaviorTag}>{behavioral_tag.replace(/_/g, ' ')}</span>
          </div>
        )}
      </div>

      {/* Dual regret split + radar */}
      <div style={styles.splitRow}>
        <div style={{ ...styles.card, flex: 1 }}>
          <div style={styles.cardTitle}>Regret dimensions</div>
          <DualBar label="Emotional regret" value={emotional_regret || regret_score} color="var(--danger)" />
          <DualBar label="Financial regret" value={financial_regret || regret_score} color="var(--warn)" />
        </div>
        <div style={{ ...styles.card, flex: 1, minHeight: 160 }}>
          <div style={styles.cardTitle}>Risk profile</div>
          <ResponsiveContainer width="100%" height={140}>
            <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: 'var(--muted)', fontSize: 10 }} />
              <Radar dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.15} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Factors */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <AlertTriangle size={13} color="var(--warn)" strokeWidth={2} />
          Regret risk factors
        </div>
        {factors?.map((f, i) => {
          const { bg, text } = impactColor(f.impact)
          const Icon = FACTOR_ICONS[f.impact] || TrendingDown
          return (
            <div key={i} style={styles.factorRow}>
              <Icon size={14} color={text} strokeWidth={2} style={{ flexShrink: 0 }} />
              <div style={styles.factorBody}>
                <span style={styles.factorName}>{f.name}</span>
                <span style={styles.factorNote}>{f.note}</span>
              </div>
              <span style={{ ...styles.impactBadge, background: bg, color: text }}>
                {f.impact}
              </span>
            </div>
          )
        })}
      </div>

      {/* Alternatives */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <ArrowRight size={13} color="var(--safe)" strokeWidth={2} />
          Smarter alternatives
        </div>
        <div style={styles.altGrid}>
          {alternatives?.map((a, i) => (
            <div key={i} style={styles.altCard}>
              <div style={styles.altTitle}>{a.title}</div>
              <div style={styles.altDesc}>{a.description}</div>
              <div style={styles.altSaving}>{a.savings}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DualBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${value}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
    marginBottom: 14,
    animation: 'fadeIn 0.3s ease',
  },
  cardTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.09em',
    color: 'var(--muted)',
    marginBottom: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontWeight: 500,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 1.75,
    color: 'var(--text)',
  },
  waitBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    padding: '10px 14px',
    background: 'var(--warn-bg)',
    borderRadius: 'var(--radius)',
    fontSize: 13,
    color: 'var(--text2)',
  },
  tagRow: {
    marginTop: 12,
  },
  behaviorTag: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 20,
    background: 'var(--accent-bg)',
    color: 'var(--accent)',
    textTransform: 'capitalize',
    letterSpacing: '0.04em',
  },
  splitRow: {
    display: 'flex',
    gap: 14,
    marginBottom: 0,
  },
  factorRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  },
  factorBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  factorName: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text)',
  },
  factorNote: {
    fontSize: 12,
    color: 'var(--muted)',
    lineHeight: 1.5,
  },
  impactBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: '3px 9px',
    borderRadius: 20,
    textTransform: 'capitalize',
    letterSpacing: '0.04em',
    flexShrink: 0,
  },
  altGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  altCard: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  altTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
  },
  altDesc: {
    fontSize: 12,
    color: 'var(--muted)',
    lineHeight: 1.55,
    flex: 1,
  },
  altSaving: {
    fontSize: 12,
    color: 'var(--safe)',
    fontWeight: 500,
    marginTop: 4,
  },
}
