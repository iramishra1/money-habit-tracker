/**
 * Returns CSS color variable for a regret score.
 */
export function scoreColor(score) {
  if (score < 30) return 'var(--safe)'
  if (score < 60) return 'var(--warn)'
  return 'var(--danger)'
}

/**
 * Returns a human verdict object for a score.
 */
export function scoreVerdict(score) {
  if (score < 20) return { label: 'Buy it',            color: 'var(--safe)'   }
  if (score < 40) return { label: 'Consider carefully', color: 'var(--safe)'   }
  if (score < 60) return { label: 'Risky purchase',    color: 'var(--warn)'   }
  if (score < 80) return { label: 'High regret risk',  color: 'var(--danger)' }
  return           { label: 'Skip it',             color: 'var(--danger)' }
}

/**
 * Returns bg variable for impact level.
 */
export function impactColor(impact) {
  if (impact === 'high')   return { bg: 'var(--danger-bg)', text: 'var(--danger)' }
  if (impact === 'medium') return { bg: 'var(--warn-bg)',   text: 'var(--warn)'   }
  return                          { bg: 'var(--safe-bg)',   text: 'var(--safe)'   }
}

/**
 * Computes aggregate stats from purchase array.
 */
export function computeStats(purchases) {
  if (!purchases.length) return { avg: null, saved: 0, accuracy: null, count: 0 }

  const avg = Math.round(purchases.reduce((s, p) => s + p.score, 0) / purchases.length)
  const saved = purchases.filter(p => p.score > 60).reduce((s, p) => s + (p.price || 0), 0)

  const decided = purchases.filter(p => p.outcome !== 'pending')
  const correct = decided.filter(
    p => (p.outcome === 'regretted' && p.score > 60) || (p.outcome === 'kept' && p.score <= 60)
  )
  const accuracy = decided.length > 0 ? Math.round((correct.length / decided.length) * 100) : null

  return { avg, saved, accuracy, count: purchases.length }
}

/**
 * Returns behavioral patterns from purchase history.
 */
export function derivePatterns(purchases) {
  if (purchases.length < 3) return []

  const patterns = []
  const { avg, saved, accuracy } = computeStats(purchases)

  // Category pattern
  const catCounts = purchases.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]
  patterns.push({
    title: `Top category: ${topCat[0]}`,
    description: `You've analyzed ${topCat[1]} purchase${topCat[1] > 1 ? 's' : ''} in this category. Consider whether ${topCat[0]} spending aligns with your stated priorities.`,
    type: 'category',
  })

  // Regret profile
  const profileLabel = avg < 40 ? 'Thoughtful Spender' : avg < 65 ? 'Risk-Aware Buyer' : 'Impulse-Prone'
  const profileDesc  = avg < 40
    ? 'Your average regret score is low — you tend to make deliberate, considered purchases. Keep it up.'
    : avg < 65
    ? `Your avg regret score is ${avg}%. You show some risky patterns but good self-awareness. Focus on the high-risk purchases.`
    : `Your avg regret score is ${avg}%. You frequently evaluate high-regret purchases. Consider a 48-hour rule before deciding.`
  patterns.push({ title: `Profile: ${profileLabel}`, description: profileDesc, type: 'profile' })

  // Impulse detection
  const impulse = purchases.filter(p => p.duration === 'Just saw it today' || p.duration === 'A few days')
  if (impulse.length >= 2) {
    const impulseAvg = Math.round(impulse.reduce((s, p) => s + p.score, 0) / impulse.length)
    patterns.push({
      title: 'Impulse pattern detected',
      description: `${impulse.length} of your analyzed purchases were things you'd wanted for less than a week, averaging a ${impulseAvg}% regret score. Short desire duration is the #1 regret predictor.`,
      type: 'impulse',
    })
  }

  // Accuracy
  if (accuracy !== null) {
    patterns.push({
      title: `AI accuracy: ${accuracy}%`,
      description: `Based on your confirmed outcomes, the oracle has predicted your regret correctly ${accuracy}% of the time. The model calibrates with each outcome you record.`,
      type: 'accuracy',
    })
  }

  return patterns
}
