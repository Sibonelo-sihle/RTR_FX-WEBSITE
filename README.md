# RTR FX — Supply & Demand Trading Platform

Institutional-grade supply & demand analysis platform with real-time signals across Forex and major indices.

## Features

- **Live Signals** — BUY/SELL signals for 8 Forex pairs + 5 Indices (US30, US100, GER30, SP500, FTSE100)
- **Supply & Demand Zones** — Demand zones, supply zones, key levels, and trade setups per pair
- **AI Market Analysis** — Claude-powered supply & demand breakdown per pair
- **TradingView Charts** — Live chart embed per pair
- **Economic Calendar** — High-impact events (NFP, CPI, FOMC, etc.)
- **Risk Calculator** — Lot size, SL pips, TP pips, and R:R ratio
- **Trade Journal** — Log and track all your trades with P&L stats
- **Watchlist** — Star and track your favourite pairs
- **Community** — Discussions feed and member join form
- **Mobile Responsive** — Works on all screen sizes

---

## Project Structure

```
rtr-fx-website/
├── app/
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Main entry page
│   └── globals.css       # Global styles
├── components/
│   └── RTRApp.jsx        # Full application component
├── .env.example          # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/rtr-fx-website.git
cd rtr-fx-website
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Get your key at: https://console.anthropic.com

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## TradingView Chart Setup

To enable live charts, add this script to `app/layout.tsx` inside `<head>`:

```html
<script src="https://s3.tradingview.com/tv.js"></script>
```

Then in `components/RTRApp.jsx`, find the `TradingViewWidget` component and replace the placeholder with:

```jsx
useEffect(() => {
  new window.TradingView.widget({
    container_id: "tv-chart-" + symbol,
    symbol: tvSymbol,
    interval: "H4",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#0f1410",
    enable_publishing: false,
    hide_top_toolbar: false,
    save_image: false,
    height: 420,
    width: "100%",
  })
}, [symbol])
```

---

## Deployment

### Option 1: Vercel (Recommended — Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** → select your `rtr-fx-website` repo
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key
5. Click **Deploy** — done. Vercel auto-deploys on every push to `main`

**Your site will be live at:** `https://rtr-fx-website.vercel.app`

### Option 2: Netlify (Free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add `ANTHROPIC_API_KEY` under **Site Settings → Environment Variables**
6. Deploy

### Option 3: Cloudflare Pages (Free — Fastest globally)

1. Push to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. **Create a project** → connect GitHub repo
4. Framework preset: **Next.js**
5. Add environment variables
6. Deploy

---

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit — RTR FX Supply & Demand Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rtr-fx-website.git
git push -u origin main
```

---

## Roadmap / Next Steps

- [ ] Connect real-time price API (e.g. Alpha Vantage, Twelve Data, or OANDA)
- [ ] Backend for community posts (Supabase or Firebase)
- [ ] Push notifications for key level alerts
- [ ] User authentication (NextAuth.js)
- [ ] Premium subscription tier (Stripe)
- [ ] Telegram/Discord signal bot integration

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript + JSX
- **Styling:** Inline CSS with CSS variables
- **AI:** Anthropic Claude API (claude-sonnet)
- **Charts:** TradingView Widget
- **Deployment:** Vercel

---

Built by Sibonelo-sihle · RTR FX © 2025
