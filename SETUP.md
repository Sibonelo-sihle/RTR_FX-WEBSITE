# RTR FX — Chart + AI Insights Setup Guide

## Files to add to your project

Copy these files exactly into your project:

```
components/TradingViewChart.jsx   ← Live TradingView chart
components/FXInsightsPanel.jsx    ← AI insights panel  
app/api/fx-insights/route.js      ← Backend API route (Anthropic)
app/analysis/[pair]/AnalysisPageExample.jsx  ← Reference for wiring them together
```

---

## Step 1 — Add your Anthropic API key

Create or open `.env.local` in your project root:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> ⚠️ Never commit this file to GitHub. Make sure `.env.local` is in your `.gitignore`

---

## Step 2 — Add TradingView script to layout

Open `app/layout.tsx` and add the TradingView script to `<head>`:

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://s3.tradingview.com/tv.js" async />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## Step 3 — Use the components in your analysis page

Open `app/analysis/[pair]/page.jsx` (or wherever your analysis page lives) and import:

```jsx
import TradingViewChart from "@/components/TradingViewChart"
import FXInsightsPanel from "@/components/FXInsightsPanel"
```

Then in your JSX (see `AnalysisPageExample.jsx` for full layout):

```jsx
const [insights, setInsights] = useState(null)
const [pair, setPair] = useState("EUR/USD")

// In JSX:
<TradingViewChart pair={pair} insights={insights} />
<FXInsightsPanel pair={pair} onInsightsLoaded={setInsights} />
```

The `onInsightsLoaded` callback passes the AI data up so the chart can display the zone legend and key levels bar.

---

## Step 4 — Run locally

```bash
npm run dev
```

Then visit: http://localhost:3000/analysis/EURUSD

---

## Step 5 — Deploy to Vercel

```bash
# Push to GitHub first
git add .
git commit -m "Add TradingView chart + AI insights"
git push

# Then on Vercel:
# 1. Import your GitHub repo at vercel.com
# 2. Add Environment Variable: ANTHROPIC_API_KEY = your key
# 3. Deploy
```

---

## What you get

| Feature | Component |
|---|---|
| Live TradingView chart (all pairs) | `TradingViewChart.jsx` |
| Timeframe switcher (15m/1H/4H/1D/1W) | `TradingViewChart.jsx` |
| Supply & demand zone count overlay | `TradingViewChart.jsx` |
| Key S/R levels bar below chart | `TradingViewChart.jsx` |
| Market bias with strength meter | `FXInsightsPanel.jsx` |
| Supply zones with strength ratings | `FXInsightsPanel.jsx` |
| Demand zones with strength ratings | `FXInsightsPanel.jsx` |
| Trade setup (entry/SL/TP/RR) | `FXInsightsPanel.jsx` |
| Market structure classification | `FXInsightsPanel.jsx` |
| Weekly high/low levels | `FXInsightsPanel.jsx` |
| AI-powered via Claude (Anthropic) | `app/api/fx-insights/route.js` |

---

## Supported Pairs

EUR/USD · GBP/USD · USD/JPY · AUD/USD · USD/CHF · NZD/USD · USD/CAD  
EUR/GBP · EUR/JPY · GBP/JPY · XAU/USD · US100 · US30 · SPX500

To add more pairs, edit the `toTVSymbol()` map in `TradingViewChart.jsx`.
