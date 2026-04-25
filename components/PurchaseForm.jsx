import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'

const CATEGORIES = [
  'Electronics & Gadgets',
  'Clothing & Fashion',
  'Home & Furniture',
  'Fitness & Health',
  'Entertainment & Media',
  'Food & Dining',
  'Travel & Experiences',
  'Software & Subscriptions',
  'Books & Education',
  'Hobbies & Collectibles',
]

const DURATIONS = [
  'Just saw it today',
  'A few days',
  'A week or two',
  'A month or more',
  'Over 3 months',
]

const DEFAULT = {
  name: '', price: '', category: '', income: '',
  urgency: 5, duration: DURATIONS[0], reason: '',
}

export default function PurchaseForm({ onSubmit, loading }) {
  const [fields, setFields] = useState(DEFAULT)

  function set(key, val) {
    setFields(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmit() {
    if (!fields.name.trim() || !fields.price || !fields.category) return
    onSubmit(fields)
  }

  const canSubmit = fields.name.trim() && fields.price && fields.category && !loading

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>Purchase details</div>

      <Field label="What are you buying?">
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. Sony WH-1000XM5 headphones"
          value={fields.name}
          onChange={e => set('name', e.target.value)}
        />
      </Field>

      <div style={styles.row}>
        <Field label="Price ($)" style={{ flex: 1 }}>
          <input
            style={styles.input}
            type="number"
            min="0"
            placeholder="349"
            value={fields.price}
            onChange={e => set('price', e.target.value)}
          />
        </Field>
        <Field label="Monthly income ($)" style={{ flex: 1 }}>
          <input
            style={styles.input}
            type="number"
            min="0"
            placeholder="5000"
            value={fields.income}
            onChange={e => set('income', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Category">
        <select style={styles.input} value={fields.category} onChange={e => set('category', e.target.value)}>
          <option value="">Select category...</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label={`How urgent? ${fields.urgency}/10`}>
        <input
          style={styles.range}
          type="range"
          min={1}
          max={10}
          step={1}
          value={fields.urgency}
          onChange={e => set('urgency', Number(e.target.value))}
        />
        <div style={styles.rangeTicks}>
          <span>Not urgent</span>
          <span>Must have now</span>
        </div>
      </Field>

      <Field label="How long have you wanted it?">
        <select style={styles.input} value={fields.duration} onChange={e => set('duration', e.target.value)}>
          {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>

      <Field label="Why do you want it? (optional)">
        <textarea
          style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
          placeholder="Tell the AI your reasoning — the more detail, the better the prediction..."
          value={fields.reason}
          onChange={e => set('reason', e.target.value)}
        />
      </Field>

      <button
        style={{ ...styles.btn, ...(!canSubmit ? styles.btnDisabled : {}) }}
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {loading
          ? <><Loader2 size={15} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} /> Consulting the oracle...</>
          : 'Analyze my future regret'}
      </button>
    </div>
  )
}

function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.09em',
    color: 'var(--muted)',
    marginBottom: 18,
    fontWeight: 500,
  },
  label: {
    display: 'block',
    fontSize: 12,
    color: 'var(--text2)',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)',
    padding: '9px 13px',
    fontSize: 13,
    color: 'var(--text)',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.15s',
    appearance: 'none',
  },
  range: {
    width: '100%',
    appearance: 'none',
    height: 4,
    borderRadius: 2,
    background: 'var(--surface3)',
    outline: 'none',
    cursor: 'pointer',
    accentColor: 'var(--accent)',
  },
  rangeTicks: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 10,
    color: 'var(--muted)',
    marginTop: 5,
  },
  row: {
    display: 'flex',
    gap: 12,
  },
  btn: {
    marginTop: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: 'var(--accent)',
    color: '#1a1206',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '13px 20px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'background 0.15s, opacity 0.15s',
    width: '100%',
  },
  btnDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
}
