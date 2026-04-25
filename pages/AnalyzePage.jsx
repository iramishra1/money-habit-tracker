import React, { useState } from 'react'
import { Eye } from 'lucide-react'
import PurchaseForm from '../components/PurchaseForm'
import AnalysisResult from '../components/AnalysisResult'
import { analyzePurchase } from '../lib/api'

export default function AnalyzePage({ purchases, onAdd }) {
  const [loading, setLoading]   = useState(false)
  const [result,  setResult]    = useState(null)
  const [error,   setError]     = useState(null)
  const [current, setCurrent]   = useState(null)

  async function handleSubmit(fields) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await analyzePurchase(fields, purchases)
      setResult(res)
      setCurrent(fields)

      const entry = {
        id:       crypto.randomUUID(),
        name:     fields.name,
        price:    parseFloat(fields.price),
        category: fields.category,
        score:    res.regret_score,
        result:   res,
        date:     new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        outcome:  'pending',
        duration: fields.duration,
      }
      onAdd(entry)
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.grid}>
      {/* Left: form */}
      <div>
        <PurchaseForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Right: result */}
      <div style={styles.resultCol}>
        {!result && !loading && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Eye size={32} color="var(--muted)" strokeWidth={1.5} />
            </div>
            <div style={styles.emptyTitle}>Your oracle awaits</div>
            <p style={styles.emptyDesc}>
              Fill in the purchase details and the AI will predict whether you'll
              regret it — emotionally and financially — before you spend a dime.
            </p>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <strong>Analysis failed:</strong> {error}
          </div>
        )}

        {result && (
          <AnalysisResult
            result={result}
            itemName={current?.name}
            itemPrice={current?.price}
          />
        )}
      </div>
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '420px 1fr',
    gap: 20,
    alignItems: 'start',
  },
  resultCol: {
    minHeight: 400,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '72px 32px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    height: '100%',
    minHeight: 400,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    background: 'var(--surface2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 10,
  },
  emptyDesc: {
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.7,
    maxWidth: 300,
  },
  errorBox: {
    background: 'var(--danger-bg)',
    border: '1px solid rgba(226,75,74,0.25)',
    borderRadius: 'var(--radius)',
    padding: '14px 18px',
    fontSize: 13,
    color: 'var(--danger)',
  },
}
