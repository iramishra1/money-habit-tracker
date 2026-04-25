# Regret Minimizer — AI Spending Oracle

> **Know the emotional + financial cost of any purchase _before_ you make it.**

Regret Minimizer is an AI-powered web app that predicts your future regret probability for any potential purchase. It combines behavioral finance principles with Claude AI to give you a data-driven answer to the question: _"Will I actually use this?"_

---

## What makes it different

Most finance apps track what you _did_ spend. Regret Minimizer predicts what you'll _wish_ you hadn't — before the damage is done.

| Feature | Regret Minimizer | Budgeting apps |
|---|---|---|
| Predicts future regret | Yes | No |
| Emotional + financial split | Yes | No |
| Behavioral pattern detection | Yes | No |
| Reinforcement learning from outcomes | Yes | No |
| Tells you to wait N days | Yes | No |

---

## Features

### Analyze a purchase
- Enter item, price, category, income, urgency, and reason
- Claude AI returns a **regret probability score (0–100%)**
- Splits into **emotional regret** vs **financial regret**
- Shows 4 risk factors with impact levels (high / medium / low)
- Suggests 3 smarter alternatives
- Recommends how many days to wait before deciding
- Tags your behavioral type (impulse buyer, rational spender, etc.)

### Purchase history
- Every analyzed purchase is saved locally
- Mark outcomes: **Kept** or **Regretted**
- Outcome data feeds back into future AI calibration

### My Patterns (Insights)
- Avg regret score across all purchases
- Category breakdown chart
- Score trend line over time
- Behavioral pattern cards (unlocks after 3+ purchases)
- AI prediction accuracy (unlocks after recording outcomes)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| AI | Anthropic Claude (claude-sonnet-4) |
| Icons | Lucide React (Figma's icon library) |
| Charts | Recharts |
| Storage | localStorage (client-side, no backend required) |
| Fonts | Playfair Display + DM Sans (Google Fonts) |
| Deployment | Vercel / Netlify (static) |

---

## Project structure

```
regret-minimizer/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx         # Nav + live stats sidebar
│   │   ├── Topbar.jsx          # Page header + tab switcher
│   │   ├── PurchaseForm.jsx    # Input form for purchase details
│   │   ├── RegretMeter.jsx     # Animated score gauge
│   │   └── AnalysisResult.jsx  # Full AI result panel
│   ├── hooks/
│   │   └── usePurchases.js     # Central purchase state + localStorage sync
│   ├── lib/
│   │   ├── api.js              # Anthropic API caller + prompt builder
│   │   ├── scoring.js          # Score colors, verdicts, pattern detection
│   │   └── storage.js          # localStorage read/write helpers
│   ├── pages/
│   │   ├── AnalyzePage.jsx     # Main analyze tab
│   │   ├── HistoryPage.jsx     # Purchase history tab
│   │   └── InsightsPage.jsx    # Behavioral insights + charts tab
│   ├── styles/
│   │   └── globals.css         # Design tokens + global resets
│   ├── App.jsx                 # Root layout + routing
│   └── main.jsx                # React entry point
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

---

## Getting started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install

```bash
git clone https://github.com/YOUR_USERNAME/regret-minimizer.git
cd regret-minimizer
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Note:** The app calls the Anthropic API directly from the browser. When running inside Claude.ai, the API key is injected automatically. For standalone local use, you'll need to add a lightweight backend proxy (see below).

### Build for production

```bash
npm run build
npm run preview
```

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Both platforms serve this as a fully static app with no server required.

---

## Adding a backend proxy (for standalone deployment)

To use your own Anthropic API key without exposing it in the browser:

1. Create a simple Express or FastAPI endpoint that forwards requests to Anthropic
2. Set `VITE_API_PROXY_URL` in your `.env`
3. Update `src/lib/api.js` to use `import.meta.env.VITE_API_PROXY_URL` as the fetch target

Example Express proxy (Node.js):

```js
import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.use(express.json())

app.post('/api/analyze', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  })
  const data = await response.json()
  res.json(data)
})

app.listen(3001)
```

---

## How the AI works

### Prompt engineering
The prompt (`src/lib/api.js`) instructs Claude to act as a behavioral finance AI. It passes:
- Purchase metadata (item, price, category, income, urgency, duration, reason)
- The last 6 purchases from history for **behavioral calibration**

Claude returns structured JSON with the regret score, factor breakdown, alternatives, and behavioral tag.

### Reinforcement learning loop
When you mark a purchase outcome as "Kept" or "Regretted":
1. The outcome is stored in localStorage alongside the prediction
2. On the next analysis, past outcomes are included in the prompt context
3. Claude calibrates its predictions based on whether your past high-score items actually led to regret

This creates a feedback loop that improves accuracy over time — the more outcomes you record, the more personalized the predictions become.

### Behavioral tagging
Each analysis produces a `behavioral_tag` (e.g. `impulse_buyer`, `rational_spender`, `tech_addict`). Over time these reveal your spending personality and inform pattern detection in the Insights tab.

---

## Metrics tracked

| Metric | Where |
|---|---|
| Total purchases analyzed | Sidebar + Insights |
| Average regret score | Sidebar + Insights |
| Value protected (avoided high-risk spend) | Sidebar + Insights |
| AI prediction accuracy % | Sidebar + Insights |
| Regret by category (bar chart) | Insights |
| Score trend over time (line chart) | Insights |
| Behavioral pattern cards | Insights |

---

