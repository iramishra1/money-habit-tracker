const API_URL = 'https://api.anthropic.com/v1/messages'

/**
 * Builds the analysis prompt for Claude.
 * Includes recent purchase history for RL-style behavioral calibration.
 */
function buildPrompt(fields, history) {
  const { name, price, category, income, urgency, duration, reason } = fields

  const historyCtx = history.length > 0
    ? `\n\nUser purchase history (use for behavioral calibration):\n${JSON.stringify(
        history.slice(0, 6).map(p => ({
          item: p.name,
          price: p.price,
          score: p.score,
          category: p.category,
          outcome: p.outcome,
        }))
      )}`
    : ''

  return `You are a behavioral finance AI called the Regret Minimizer. Predict the probability of future emotional and financial regret for this potential purchase with rigorous analysis.

Purchase details:
- Item: ${name}
- Price: $${price}
- Category: ${category}
- Monthly income: ${income ? '$' + income : 'not provided'}
- Urgency (1-10): ${urgency}/10
- How long wanted: ${duration}
- User's stated reason: ${reason || 'Not provided'}${historyCtx}

Consider factors like: impulse vs deliberate purchase, price-to-income ratio, category regret rates, duration of want, hedonic adaptation, opportunity cost, decision fatigue, and behavioral patterns from history.

Respond ONLY with a valid JSON object. No markdown fences, no extra text. Exact structure:
{
  "regret_score": <integer 0-100>,
  "verdict_short": "<4-7 word verdict>",
  "analysis": "<2-3 sentence specific honest analysis of likely regret for THIS item>",
  "emotional_regret": <integer 0-100>,
  "financial_regret": <integer 0-100>,
  "factors": [
    { "name": "<factor>", "impact": "high|medium|low", "note": "<one sentence explanation>" },
    { "name": "<factor>", "impact": "high|medium|low", "note": "<one sentence explanation>" },
    { "name": "<factor>", "impact": "high|medium|low", "note": "<one sentence explanation>" },
    { "name": "<factor>", "impact": "high|medium|low", "note": "<one sentence explanation>" }
  ],
  "alternatives": [
    { "title": "<alternative>", "description": "<actionable suggestion>", "savings": "<$ or value note>" },
    { "title": "<alternative>", "description": "<actionable suggestion>", "savings": "<$ or value note>" },
    { "title": "<alternative>", "description": "<actionable suggestion>", "savings": "<$ or value note>" }
  ],
  "behavioral_tag": "<one of: impulse_buyer|rational_spender|lifestyle_inflator|experience_seeker|tech_addict|status_driven|practical_buyer>",
  "wait_recommendation_days": <integer, how many days to wait before deciding>
}`
}

/**
 * Calls Claude to analyze a potential purchase.
 * @param {Object} fields - Purchase form data
 * @param {Array}  history - Past purchases for RL calibration
 * @returns {Promise<Object>} Parsed analysis result
 */
export async function analyzePurchase(fields, history = []) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: buildPrompt(fields, history) }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data.content.map(b => b.text || '').join('')
  const clean = raw.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error('Invalid JSON from model. Try again.')
  }
}
