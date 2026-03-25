import { useState, useEffect, useRef, useCallback } from "react"

// ─── DATA ───────────────────────────────────────────────────────────────────

const FOREX_PAIRS = [
  { id: "EUR/USD", symbol: "EURUSD", price: "1.0853", change: "+0.42%", weekly: "+1.8%", monthly: "+3.2%", signal: "BUY", strength: "Strong", positive: true },
  { id: "GBP/USD", symbol: "GBPUSD", price: "1.2641", change: "-0.18%", weekly: "-0.5%", monthly: "+1.1%", signal: "SELL", strength: "Moderate", positive: false },
  { id: "USD/JPY", symbol: "USDJPY", price: "149.82", change: "+0.65%", weekly: "+2.3%", monthly: "+4.7%", signal: "BUY", strength: "Strong", positive: true },
  { id: "AUD/USD", symbol: "AUDUSD", price: "0.6512", change: "+0.28%", weekly: "+0.9%", monthly: "+2.1%", signal: "BUY", strength: "Moderate", positive: true },
  { id: "USD/CAD", symbol: "USDCAD", price: "1.3845", change: "-0.35%", weekly: "-1.2%", monthly: "-0.8%", signal: "SELL", strength: "Moderate", positive: false },
  { id: "NZD/USD", symbol: "NZDUSD", price: "0.5892", change: "+0.51%", weekly: "+1.5%", monthly: "+2.8%", signal: "BUY", strength: "Strong", positive: true },
  { id: "EUR/GBP", symbol: "EURGBP", price: "0.8581", change: "-0.12%", weekly: "+0.3%", monthly: "+0.9%", signal: "SELL", strength: "Weak", positive: false },
  { id: "USD/CHF", symbol: "USDCHF", price: "0.9012", change: "+0.19%", weekly: "+0.7%", monthly: "+1.4%", signal: "BUY", strength: "Moderate", positive: true },
]

const INDICES = [
  { id: "US30", symbol: "DJ30", price: "39,124", change: "+0.82%", weekly: "+2.5%", monthly: "+6.8%", signal: "BUY", strength: "Strong", positive: true },
  { id: "US100", symbol: "NAS100", price: "17,891", change: "+1.58%", weekly: "+4.1%", monthly: "+10.2%", signal: "BUY", strength: "Very Strong", positive: true },
  { id: "GER30", symbol: "DAX40", price: "18,243", change: "+0.44%", weekly: "+1.9%", monthly: "+5.1%", signal: "BUY", strength: "Moderate", positive: true },
  { id: "SP500", symbol: "SPX500", price: "5,211", change: "+1.25%", weekly: "+3.2%", monthly: "+8.5%", signal: "BUY", strength: "Strong", positive: true },
  { id: "FTSE100", symbol: "UK100", price: "7,982", change: "-0.25%", weekly: "+0.8%", monthly: "+2.3%", signal: "SELL", strength: "Weak", positive: false },
]

const SUPPLY_DEMAND = {
  "EUR/USD": {
    demand: [{ label: "Strong", range: "1.0820–1.0835", note: "3x tested" }, { label: "Moderate", range: "1.0780–1.0800", note: "Unmitigated" }, { label: "Weak", range: "1.0740–1.0760", note: "Partial fill" }],
    supply: [{ label: "Strong", range: "1.0920–1.0940", note: "Fresh zone" }, { label: "Moderate", range: "1.0880–1.0900", note: "Tested once" }, { label: "Weak", range: "1.0860–1.0875", note: "Near price" }],
    keyLevels: ["1.0800 – Major weekly support", "1.0850 – Current pivot", "1.0920 – Weekly resistance", "1.1000 – Psychological level"],
    bias: "Bullish", entry: "1.0835–1.0845", sl: "1.0810", tp: "1.0920", rr: "1:3.2"
  },
  "GBP/USD": {
    demand: [{ label: "Strong", range: "1.2580–1.2600", note: "Unmitigated" }, { label: "Moderate", range: "1.2520–1.2540", note: "2x tested" }, { label: "Weak", range: "1.2480–1.2500", note: "Old zone" }],
    supply: [{ label: "Strong", range: "1.2700–1.2720", note: "3x rejected" }, { label: "Moderate", range: "1.2660–1.2680", note: "Near price" }, { label: "Weak", range: "1.2640–1.2655", note: "Tested" }],
    keyLevels: ["1.2600 – Weekly support", "1.2640 – Current price", "1.2700 – Key resistance", "1.2800 – Monthly high"],
    bias: "Bearish", entry: "1.2640–1.2650", sl: "1.2680", tp: "1.2580", rr: "1:2.5"
  },
}

const DEFAULT_SD = {
  demand: [{ label: "Strong", range: "See chart", note: "Active" }, { label: "Moderate", range: "See chart", note: "Active" }, { label: "Weak", range: "See chart", note: "Active" }],
  supply: [{ label: "Strong", range: "See chart", note: "Active" }, { label: "Moderate", range: "See chart", note: "Active" }, { label: "Weak", range: "See chart", note: "Active" }],
  keyLevels: ["Check TradingView chart for live key levels"],
  bias: "Neutral", entry: "—", sl: "—", tp: "—", rr: "—"
}

const ECONOMIC_EVENTS = [
  { time: "08:30", currency: "USD", event: "Non-Farm Payrolls", impact: "High", forecast: "185K", previous: "175K" },
  { time: "10:00", currency: "USD", event: "ISM Manufacturing PMI", impact: "Medium", forecast: "49.8", previous: "49.2" },
  { time: "12:30", currency: "EUR", event: "ECB Interest Rate Decision", impact: "High", forecast: "4.50%", previous: "4.50%" },
  { time: "14:00", currency: "GBP", event: "UK CPI (YoY)", impact: "High", forecast: "3.2%", previous: "3.4%" },
  { time: "15:30", currency: "JPY", event: "BoJ Governor Speech", impact: "Medium", forecast: "—", previous: "—" },
  { time: "19:00", currency: "USD", event: "FOMC Meeting Minutes", impact: "High", forecast: "—", previous: "—" },
]

const DISCUSSIONS = [
  { id: 1, author: "TraderMike", avatar: "TM", time: "2h ago", title: "EUR/USD Breaking Key Resistance", preview: "Just saw EUR/USD break through 1.0850 on H4. Classic supply zone flip. Looking at 1.0920 as next target with tight SL at 1.0810.", replies: 24, likes: 15, pair: "EUR/USD" },
  { id: 2, author: "ForexGuru", avatar: "FG", time: "5h ago", title: "US100 Supply Zone Holding Strong", preview: "US100 rejected perfectly at the 17,950 supply zone. Short-term sell targeting 17,600 demand zone. R:R on this is 1:3.", replies: 48, likes: 32, pair: "US100" },
  { id: 3, author: "ChartMaster", avatar: "CM", time: "1d ago", title: "GER30 Demand Zone Forming", preview: "DAX showing beautiful demand zone at 18,100–18,150. Unmitigated zone from 3 weeks back. High probability long setup.", replies: 67, likes: 28, pair: "GER30" },
  { id: 4, author: "PipHunter", avatar: "PH", time: "2d ago", title: "SP500 All-Time High Watch", preview: "SP500 approaching critical supply at 5,280. If this flips to demand, we could see continuation to 5,400+.", replies: 19, likes: 22, pair: "SP500" },
]

// ─── ICONS ──────────────────────────────────────────────────────────────────

const Icon = {
  Chart: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Home: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 7L8 2l6 5v7H10V9H6v5H2V7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  Explore: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M10.5 5.5l-2 4-4 2 2-4 4-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  Community: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 13c0-2.76 2.24-5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 13.5c0-2.21 1.57-4 3.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Journal: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 6h4M6 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Calc: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5h6M5 8h2M9 8h2M5 11h2M9 11h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Star: ({ filled }) => <svg width="14" height="14" viewBox="0 0 14 14" fill={filled ? "currentColor" : "none"}><path d="M7 1.5l1.5 3.5H12l-2.8 2 1 3.5L7 8.7l-3.2 1.8 1-3.5L2 5h3.5L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  Arrow: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Back: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  News: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  Menu: () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Close: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Up: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Down: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

// ─── STYLES ─────────────────────────────────────────────────────────────────

const S = {
  app: { minHeight: "100vh", background: "#0b0f0d", color: "#e8ede9", fontFamily: "'Syne', 'Space Grotesk', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  sidebar: { width: 220, minHeight: "100vh", background: "#0f1410", borderRight: "1px solid rgba(0,255,136,0.08)", display: "flex", flexDirection: "column", padding: "0 0 1rem", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 },
  sidebarMobile: { position: "fixed", inset: 0, zIndex: 200, display: "flex" },
  sidebarOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" },
  logo: { padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(0,255,136,0.08)", marginBottom: "0.5rem" },
  logoText: { fontSize: 20, fontWeight: 700, color: "#00ff88", letterSpacing: "-0.5px", fontFamily: "'Syne', system-ui", margin: 0 },
  logoSub: { fontSize: 10, color: "rgba(0,255,136,0.5)", letterSpacing: "2px", textTransform: "uppercase", marginTop: 2 },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 1.25rem", fontSize: 13, color: active ? "#00ff88" : "rgba(200,220,205,0.6)", background: active ? "rgba(0,255,136,0.06)" : "transparent", borderLeft: active ? "2px solid #00ff88" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s", borderRadius: "0 6px 6px 0", margin: "1px 8px 1px 0", userSelect: "none" }),
  main: { marginLeft: 220, flex: 1, padding: "2rem 2rem 4rem", maxWidth: 1200 },
  mainMobile: { marginLeft: 0, flex: 1, padding: "1rem 1rem 4rem", maxWidth: "100%" },
  card: { background: "#141a16", border: "1px solid rgba(0,255,136,0.1)", borderRadius: 12, padding: "1.25rem" },
  cardHover: { background: "#141a16", border: "1px solid rgba(0,255,136,0.1)", borderRadius: 12, padding: "1.25rem", cursor: "pointer", transition: "border-color 0.2s, transform 0.15s" },
  badge: (type) => ({ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", background: type === "BUY" ? "rgba(0,255,136,0.15)" : type === "High" ? "rgba(220,50,50,0.15)" : type === "Medium" ? "rgba(255,180,0,0.15)" : "rgba(255,60,60,0.15)", color: type === "BUY" ? "#00ff88" : type === "High" ? "#ff6b6b" : type === "Medium" ? "#ffd166" : "#ff6b6b", border: `1px solid ${type === "BUY" ? "rgba(0,255,136,0.3)" : type === "High" ? "rgba(220,50,50,0.3)" : type === "Medium" ? "rgba(255,180,0,0.3)" : "rgba(255,60,60,0.3)"}` }),
  input: { background: "#0f1410", border: "1px solid rgba(0,255,136,0.15)", borderRadius: 8, padding: "9px 12px", color: "#e8ede9", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" },
  btn: { padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(0,255,136,0.4)", background: "rgba(0,255,136,0.08)", color: "#00ff88", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" },
  btnPrimary: { padding: "10px 24px", borderRadius: 8, border: "none", background: "#00ff88", color: "#0b0f0d", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" },
  mobileHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "#0f1410", borderBottom: "1px solid rgba(0,255,136,0.08)", position: "sticky", top: 0, zIndex: 50 },
}

// ─── LIVE TRADINGVIEW CHART ──────────────────────────────────────────────────

function TradingViewWidget({ symbol, insights }) {
  const containerRef = useRef(null)
  const [timeframe, setTimeframe] = useState("240")
  const [ready, setReady] = useState(false)
  const containerId = `tv-${symbol.replace(/[^a-zA-Z0-9]/g, "")}-${timeframe}`

  const TV_SYMBOL_MAP = {
    DJ30: "DJ:DJI", NAS100: "NASDAQ:NDX", DAX40: "XETR:DAX",
    SPX500: "SP:SPX", UK100: "INDEX:UKX",
  }
  const tvSymbol = TV_SYMBOL_MAP[symbol] || `FX:${symbol}`

  // Load TV script
  useEffect(() => {
    if (window.TradingView) { setReady(true); return }
    if (document.getElementById("tv-script")) {
      document.getElementById("tv-script").addEventListener("load", () => setReady(true))
      return
    }
    const s = document.createElement("script")
    s.id = "tv-script"
    s.src = "https://s3.tradingview.com/tv.js"
    s.async = true
    s.onload = () => setReady(true)
    document.head.appendChild(s)
  }, [])

  // Init widget
  useEffect(() => {
    if (!ready || !containerRef.current || !window.TradingView) return
    containerRef.current.innerHTML = ""
    const div = document.createElement("div")
    div.id = containerId
    div.style.height = "100%"
    div.style.width = "100%"
    containerRef.current.appendChild(div)
    try {
      new window.TradingView.widget({
        container_id: containerId, symbol: tvSymbol, interval: timeframe,
        theme: "dark", style: "1", locale: "en", toolbar_bg: "#0f1410",
        enable_publishing: false, hide_top_toolbar: false, save_image: false,
        height: "100%", width: "100%",
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#00ff88",
          "mainSeriesProperties.candleStyle.downColor": "#ff4757",
          "mainSeriesProperties.candleStyle.borderUpColor": "#00ff88",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ff4757",
          "mainSeriesProperties.candleStyle.wickUpColor": "#00ff88",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ff4757",
          "paneProperties.background": "#0f1410",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "#141a16",
          "paneProperties.horzGridProperties.color": "#141a16",
          "scalesProperties.textColor": "rgba(200,220,205,0.6)",
        },
      })
    } catch(e) { console.error("TradingView error:", e) }
  }, [ready, tvSymbol, timeframe, containerId])

  const TF = ["15", "60", "240", "D", "W"]
  const TF_LABELS = { "15": "15m", "60": "1H", "240": "4H", "D": "1D", "W": "1W" }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 460, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,255,136,0.1)", background: "#0f1410" }}>
      {/* Timeframe selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: "#0a0d0a", borderBottom: "1px solid rgba(0,255,136,0.08)", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#00ff88", letterSpacing: "0.05em" }}>{symbol}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {TF.map(t => (
            <button key={t} onClick={() => setTimeframe(t)}
              style={{ padding: "3px 10px", fontSize: 11, fontWeight: 600, border: `1px solid ${timeframe === t ? "rgba(0,255,136,0.5)" : "rgba(0,255,136,0.1)"}`, borderRadius: 5, background: timeframe === t ? "rgba(0,255,136,0.1)" : "transparent", color: timeframe === t ? "#00ff88" : "rgba(200,220,205,0.4)", cursor: "pointer" }}>
              {TF_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
      {/* AI zone pills */}
      {insights && (
        <div style={{ display: "flex", gap: 8, padding: "5px 14px", background: "#0a0d0a", borderBottom: "1px solid rgba(0,255,136,0.06)", flexWrap: "wrap", flexShrink: 0 }}>
          {insights.supplyZones?.length > 0 && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(255,71,87,0.12)", color: "#ff6b6b", border: "1px solid rgba(255,71,87,0.25)" }}>📦 {insights.supplyZones.length} Supply</span>}
          {insights.demandZones?.length > 0 && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(0,255,136,0.08)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.2)" }}>🧲 {insights.demandZones.length} Demand</span>}
          {insights.bias && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: insights.bias === "Bullish" ? "rgba(0,255,136,0.08)" : "rgba(255,71,87,0.1)", color: insights.bias === "Bullish" ? "#00ff88" : "#ff6b6b", border: `1px solid ${insights.bias === "Bullish" ? "rgba(0,255,136,0.2)" : "rgba(255,71,87,0.25)"}` }}>{insights.bias === "Bullish" ? "📈" : "📉"} {insights.bias}</span>}
          {insights.keyLevels?.majorResistance?.[0] && <span style={{ fontSize: 10, color: "#ff6b6b", padding: "2px 4px" }}>R: {insights.keyLevels.majorResistance[0]}</span>}
          {insights.keyLevels?.majorSupport?.[0] && <span style={{ fontSize: 10, color: "#00ff88", padding: "2px 4px" }}>S: {insights.keyLevels.majorSupport[0]}</span>}
        </div>
      )}
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />
    </div>
  )
}

// ─── AI INSIGHT CARD ─────────────────────────────────────────────────────────

function AIInsightCard({ pair, onInsightsLoaded }) {
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  const generateInsight = async () => {
    setLoading(true)
    try {
      // Calls /api/fx-insights — API key stays secure on the server
      const res = await fetch("/api/fx-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair: pair.id,
          price: pair.price,
          change: pair.change,
          weekly: pair.weekly,
          monthly: pair.monthly,
          signal: pair.signal,
          strength: pair.strength,
        }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      setInsight(data)
      if (onInsightsLoaded) onInsightsLoaded(data)
    } catch (err) {
      const fallback = {
        bias: "—", summary: "Unable to load AI analysis. Check your ANTHROPIC_API_KEY in .env.local and make sure app/api/fx-insights/route.js exists.",
        keyLevel: "—", setupType: "—", riskNote: "Always use a stop loss.", outlook: "—",
        supplyZones: [], demandZones: [], keyLevels: null, tradeSetup: null,
      }
      setInsight(fallback)
      if (onInsightsLoaded) onInsightsLoaded(fallback)
    }
    setLoading(false)
  }

  const biasColor = insight?.bias === "Bullish" ? "#00ff88" : insight?.bias === "Bearish" ? "#ff6b6b" : "rgba(200,220,205,0.5)"

  return (
    <div style={S.card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#e8ede9" }}>✦ AI Market Analysis</div>
        <button style={{ ...S.btn, fontSize: 11 }} onClick={generateInsight} disabled={loading}>
          {loading ? "Analysing..." : insight ? "↺ Refresh" : "Generate AI Insight"}
        </button>
      </div>

      {!insight && !loading && (
        <div style={{ color: "rgba(200,220,205,0.4)", fontSize: 13, padding: "0.5rem 0" }}>
          Click to generate supply & demand analysis for <strong style={{ color: "rgba(200,220,205,0.6)" }}>{pair.id}</strong> powered by Claude AI.
        </div>
      )}

      {loading && (
        <div style={{ color: "#00ff88", fontSize: 13, padding: "1rem 0", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span>
          Analysing {pair.id} supply & demand zones...
        </div>
      )}

      {insight && !loading && (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ ...S.badge(insight.bias === "Bullish" ? "BUY" : "SELL") }}>{insight.bias}</span>
            {insight.setupType && insight.setupType !== "—" && (
              <span style={{ ...S.badge("Medium"), background: "rgba(100,160,255,0.1)", color: "#7eb8ff", borderColor: "rgba(100,160,255,0.3)" }}>{insight.setupType}</span>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, background: "#0f1410", borderRadius: 8, padding: 3 }}>
            {["overview", "zones", "setup"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: "5px 0", fontSize: 11, fontWeight: 600, border: "none", borderRadius: 5, background: activeTab === tab ? "#141a16" : "transparent", color: activeTab === tab ? "#e8ede9" : "rgba(200,220,205,0.4)", cursor: "pointer", textTransform: "capitalize" }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div style={{ display: "grid", gap: 8 }}>
              {[["Summary", insight.summary], ["Key Level", insight.keyLevel], ["Outlook", insight.outlook], ["Risk Note", insight.riskNote]].map(([label, val]) => (
                <div key={label} style={{ background: "#0f1410", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "rgba(0,255,136,0.6)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, color: "#c8dcd0", lineHeight: 1.6 }}>{val || "—"}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "zones" && (
            <div style={{ display: "grid", gap: 8 }}>
              {insight.supplyZones?.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#ff6b6b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>🔴 Supply Zones</div>
                  {insight.supplyZones.map((z, i) => (
                    <div key={i} style={{ background: "rgba(255,71,87,0.06)", border: "1px solid rgba(255,71,87,0.15)", borderRadius: 7, padding: "8px 10px", marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#ff6b6b" }}>{z.range}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: z.strength === "Strong" ? "#ffc800" : z.strength === "Moderate" ? "#7eb8ff" : "rgba(200,220,205,0.4)", padding: "1px 7px", borderRadius: 4, background: "rgba(255,255,255,0.05)" }}>{z.strength}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", marginTop: 3 }}>{z.note}</div>
                    </div>
                  ))}
                </div>
              )}
              {insight.demandZones?.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#00ff88", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>🟢 Demand Zones</div>
                  {insight.demandZones.map((z, i) => (
                    <div key={i} style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: 7, padding: "8px 10px", marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#00ff88" }}>{z.range}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: z.strength === "Strong" ? "#ffc800" : z.strength === "Moderate" ? "#7eb8ff" : "rgba(200,220,205,0.4)", padding: "1px 7px", borderRadius: 4, background: "rgba(255,255,255,0.05)" }}>{z.strength}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", marginTop: 3 }}>{z.note}</div>
                    </div>
                  ))}
                </div>
              )}
              {!insight.supplyZones?.length && !insight.demandZones?.length && (
                <div style={{ color: "rgba(200,220,205,0.4)", fontSize: 12 }}>No zone data. Try refreshing.</div>
              )}
            </div>
          )}

          {activeTab === "setup" && (
            <div style={{ display: "grid", gap: 8 }}>
              {insight.tradeSetup ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[["Entry Zone", insight.tradeSetup.entry, "#c8dcd0"], ["Stop Loss", insight.tradeSetup.sl, "#ff6b6b"], ["Take Profit", insight.tradeSetup.tp, "#00ff88"], ["Risk/Reward", insight.tradeSetup.rr, "#7eb8ff"]].map(([l, v, c]) => (
                    <div key={l} style={{ background: "#0f1410", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "rgba(200,220,205,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v || "—"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "rgba(200,220,205,0.4)", fontSize: 12 }}>No trade setup data. Try refreshing.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── PAGES ──────────────────────────────────────────────────────────────────

function PairCard({ pair, onSelect, watchlist, toggleWatch }) {
  return (
    <div style={{ ...S.cardHover, position: "relative" }} onClick={() => onSelect(pair)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.35)"; e.currentTarget.style.transform = "translateY(-2px)" }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.1)"; e.currentTarget.style.transform = "none" }}>
      <div style={{ position: "absolute", top: 10, right: 10 }} onClick={e => { e.stopPropagation(); toggleWatch(pair.id) }}>
        <span style={{ color: watchlist.includes(pair.id) ? "#00ff88" : "rgba(200,220,205,0.3)", transition: "color 0.15s" }}>
          <Icon.Star filled={watchlist.includes(pair.id)} />
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e8ede9", marginBottom: 2, fontFamily: "'Syne', system-ui" }}>{pair.id}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#00ff88" }}>{pair.price}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: pair.positive ? "#00ff88" : "#ff6b6b", display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
            {pair.positive ? <Icon.Up /> : <Icon.Down />} {pair.change}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div style={{ background: "#0f1410", borderRadius: 6, padding: "6px 10px" }}>
          <div style={{ fontSize: 10, color: "rgba(200,220,205,0.5)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>Weekly</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: pair.weekly.startsWith("+") ? "#00ff88" : "#ff6b6b" }}>{pair.weekly}</div>
        </div>
        <div style={{ background: "#0f1410", borderRadius: 6, padding: "6px 10px" }}>
          <div style={{ fontSize: 10, color: "rgba(200,220,205,0.5)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>Monthly</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: pair.monthly.startsWith("+") ? "#00ff88" : "#ff6b6b" }}>{pair.monthly}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={S.badge(pair.signal)}>{pair.signal === "BUY" ? "▲ LONG BUY" : "▼ SHORT SELL"}</span>
        <span style={{ fontSize: 11, color: "rgba(200,220,205,0.5)" }}>{pair.strength}</span>
      </div>
    </div>
  )
}

function HomePage({ setPage }) {
  return (
    <div>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)", color: "#00ff88", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "1.25rem" }}>
          Supply & Demand Analysis Platform
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 1rem", fontFamily: "'Syne', system-ui", letterSpacing: "-1px" }}>
          Trade smarter with<br /><span style={{ color: "#00ff88" }}>RTR Signals</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(200,220,205,0.6)", maxWidth: 500, lineHeight: 1.7, margin: "0 0 2rem" }}>
          Institutional-grade supply & demand analysis. Real-time signals across Forex and major indices.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button style={S.btnPrimary} onClick={() => setPage("explore")}>Explore Pairs →</button>
          <button style={S.btn} onClick={() => setPage("community")}>Join Community</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: "2.5rem" }}>
        {[["50+", "Forex Pairs"], ["4", "Major Indices"], ["24/7", "Live Signals"], ["AI", "Powered Insights"]].map(([v, l]) => (
          <div key={l} style={{ ...S.card, textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#00ff88", fontFamily: "'Syne', system-ui", marginBottom: 4 }}>{v}</div>
            <div style={{ fontSize: 12, color: "rgba(200,220,205,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ ...S.card, marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(200,220,205,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>Top Signals Today</div>
        <div style={{ display: "grid", gap: 8 }}>
          {[...FOREX_PAIRS.slice(0, 3), ...INDICES.slice(0, 2)].map(p => (
            <div key={p.id} onClick={() => setPage("pair:" + p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#0f1410", borderRadius: 8, cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#141f18"}
              onMouseLeave={e => e.currentTarget.style.background = "#0f1410"}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e8ede9", minWidth: 70 }}>{p.id}</span>
                <span style={{ fontSize: 13, color: "#00ff88" }}>{p.price}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: p.positive ? "#00ff88" : "#ff6b6b" }}>{p.change}</span>
                <span style={S.badge(p.signal)}>{p.signal === "BUY" ? "▲ BUY" : "▼ SELL"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExplorePage({ setPage, watchlist, toggleWatch }) {
  const [filter, setFilter] = useState("All")
  const filters = ["All", "BUY Only", "SELL Only", "Watchlist"]
  const filterPairs = (arr) => {
    if (filter === "BUY Only") return arr.filter(p => p.signal === "BUY")
    if (filter === "SELL Only") return arr.filter(p => p.signal === "SELL")
    if (filter === "Watchlist") return arr.filter(p => watchlist.includes(p.id))
    return arr
  }
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 0.5rem", fontFamily: "'Syne', system-ui" }}>Explore Markets</h2>
        <p style={{ fontSize: 13, color: "rgba(200,220,205,0.5)", margin: 0 }}>Click any pair to view supply & demand analysis</p>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${filter === f ? "rgba(0,255,136,0.5)" : "rgba(0,255,136,0.12)"}`, background: filter === f ? "rgba(0,255,136,0.1)" : "transparent", color: filter === f ? "#00ff88" : "rgba(200,220,205,0.5)", fontSize: 12, cursor: "pointer", fontWeight: filter === f ? 600 : 400 }}>{f}</button>
        ))}
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 12, color: "rgba(0,255,136,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.75rem" }}>Forex Pairs</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {filterPairs(FOREX_PAIRS).map(p => <PairCard key={p.id} pair={p} onSelect={p => setPage("pair:" + p.id)} watchlist={watchlist} toggleWatch={toggleWatch} />)}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, color: "rgba(0,255,136,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.75rem" }}>Indices</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {filterPairs(INDICES).map(p => <PairCard key={p.id} pair={p} onSelect={p => setPage("pair:" + p.id)} watchlist={watchlist} toggleWatch={toggleWatch} />)}
        </div>
      </div>
    </div>
  )
}

function PairDetailPage({ pairId, setPage }) {
  const pair = [...FOREX_PAIRS, ...INDICES].find(p => p.id === pairId) || FOREX_PAIRS[0]
  const sd = SUPPLY_DEMAND[pairId] || DEFAULT_SD
  const [aiInsights, setAiInsights] = useState(null) // ← receives AI data from AIInsightCard

  return (
    <div>
      <button onClick={() => setPage("explore")} style={{ ...S.btn, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
        <Icon.Back /> Back to Explore
      </button>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, fontFamily: "'Syne', system-ui", color: "#00ff88" }}>{pair.id}</h2>
          <span style={S.badge(pair.signal)}>{pair.signal === "BUY" ? "▲ LONG BUY" : "▼ SHORT SELL"}</span>
          <span style={{ fontSize: 12, color: "rgba(200,220,205,0.4)", background: "#141a16", border: "1px solid rgba(0,255,136,0.1)", borderRadius: 6, padding: "3px 10px" }}>Bias: {sd.bias}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#00ff88" }}>{pair.price}</span>
          <span style={{ fontSize: 16, color: pair.positive ? "#00ff88" : "#ff6b6b" }}>{pair.change}</span>
          <span style={{ fontSize: 12, color: "rgba(200,220,205,0.4)" }}>Live · Updated 2 min ago</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
        {[["24H", pair.change, pair.positive], ["Weekly", pair.weekly, pair.weekly.startsWith("+")], ["Monthly", pair.monthly, pair.monthly.startsWith("+")], ["Signal", pair.signal, pair.signal === "BUY"], ["Strength", pair.strength, true]].map(([l, v, pos]) => (
          <div key={l} style={{ background: "#141a16", border: "1px solid rgba(0,255,136,0.08)", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: "rgba(200,220,205,0.4)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: l === "Signal" ? (pos ? "#00ff88" : "#ff6b6b") : l === "Strength" ? "#c8dcd0" : pos ? "#00ff88" : "#ff6b6b" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ✅ LIVE CHART — now passes aiInsights for zone pills */}
      <div style={{ ...S.card, marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e8ede9", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 6 }}>📊 Live Chart</div>
        <TradingViewWidget symbol={pair.symbol} insights={aiInsights} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#00ff88", marginBottom: 12 }}>▲ Demand Zones</div>
          <div style={{ display: "grid", gap: 8 }}>
            {sd.demand.map(z => (
              <div key={z.label} style={{ background: "#0f1410", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(0,255,136,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(0,255,136,0.6)", marginBottom: 2 }}>{z.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#00ff88" }}>{z.range}</div>
                </div>
                <div style={{ fontSize: 11, color: "rgba(200,220,205,0.4)" }}>{z.note}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#ff6b6b", marginBottom: 12 }}>▼ Supply Zones</div>
          <div style={{ display: "grid", gap: 8 }}>
            {sd.supply.map(z => (
              <div key={z.label} style={{ background: "#0f1410", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,100,100,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,100,100,0.6)", marginBottom: 2 }}>{z.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#ff6b6b" }}>{z.range}</div>
                </div>
                <div style={{ fontSize: 11, color: "rgba(200,220,205,0.4)" }}>{z.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...S.card, marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e8ede9", marginBottom: 12 }}>🔑 Key Price Levels</div>
        <div style={{ display: "grid", gap: 6 }}>
          {sd.keyLevels.map(l => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#0f1410", borderRadius: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", flexShrink: 0 }}></span>
              <span style={{ fontSize: 13, color: "#c8dcd0" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...S.card, marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e8ede9", marginBottom: 12 }}>📐 Trade Setup</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
          {[["Entry Zone", sd.entry, "#00ff88"], ["Stop Loss", sd.sl, "#ff6b6b"], ["Take Profit", sd.tp, "#00ff88"], ["Risk/Reward", sd.rr, "#7eb8ff"]].map(([l, v, c]) => (
            <div key={l} style={{ background: "#0f1410", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "rgba(200,220,205,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ AI INSIGHT — now calls /api/fx-insights (server-side, key secure) */}
      {/* onInsightsLoaded feeds data back to chart zone pills */}
      <AIInsightCard pair={pair} onInsightsLoaded={setAiInsights} />

      <div style={{ ...S.card, marginTop: "1.5rem", border: "1px solid rgba(255,100,100,0.1)", background: "#1a1210" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div style={{ fontSize: 12, color: "rgba(200,220,205,0.5)", lineHeight: 1.6 }}>
            <strong style={{ color: "rgba(200,220,205,0.7)" }}>Risk Disclaimer:</strong> Forex and indices trading carries high risk. This analysis is for educational purposes only and does not constitute financial advice. Always use proper risk management and consult a licensed financial advisor before trading.
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarPage() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 0.5rem", fontFamily: "'Syne', system-ui" }}>Economic Calendar</h2>
        <p style={{ fontSize: 13, color: "rgba(200,220,205,0.5)", margin: 0 }}>High-impact events that move the markets today</p>
      </div>
      <div style={{ ...S.card }}>
        <div style={{ display: "grid", gap: 8 }}>
          {ECONOMIC_EVENTS.map((ev, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 50px 1fr auto auto", gap: 12, alignItems: "center", padding: "12px 14px", background: "#0f1410", borderRadius: 8, border: `1px solid ${ev.impact === "High" ? "rgba(220,50,50,0.15)" : "rgba(0,255,136,0.06)"}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c8dcd0", fontFamily: "monospace" }}>{ev.time}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#00ff88", background: "rgba(0,255,136,0.08)", borderRadius: 4, padding: "2px 6px", textAlign: "center" }}>{ev.currency}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e8ede9" }}>{ev.event}</div>
                <div style={{ fontSize: 11, color: "rgba(200,220,205,0.4)" }}>Forecast: {ev.forecast} · Prev: {ev.previous}</div>
              </div>
              <span style={S.badge(ev.impact)}>{ev.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskCalcPage() {
  const [accountSize, setAccountSize] = useState(10000)
  const [riskPct, setRiskPct] = useState(1)
  const [entry, setEntry] = useState("")
  const [sl, setSl] = useState("")
  const [tp, setTp] = useState("")
  const riskAmount = (accountSize * riskPct / 100).toFixed(2)
  const slPips = entry && sl ? Math.abs((parseFloat(entry) - parseFloat(sl)) * 10000).toFixed(1) : "—"
  const tpPips = entry && tp ? Math.abs((parseFloat(tp) - parseFloat(entry)) * 10000).toFixed(1) : "—"
  const rr = slPips !== "—" && tpPips !== "—" ? `1:${(parseFloat(tpPips) / parseFloat(slPips)).toFixed(2)}` : "—"
  const lotSize = slPips !== "—" && slPips > 0 ? (parseFloat(riskAmount) / (parseFloat(slPips) * 10)).toFixed(2) : "—"
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 0.5rem", fontFamily: "'Syne', system-ui" }}>Risk Calculator</h2>
        <p style={{ fontSize: 13, color: "rgba(200,220,205,0.5)", margin: 0 }}>Calculate lot size, risk, and R:R ratio before every trade</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <div style={S.card}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8ede9", marginBottom: "1rem" }}>Trade Parameters</div>
          <div style={{ display: "grid", gap: 12 }}>
            {[["Account Size ($)", accountSize, setAccountSize, 1000], ["Risk %", riskPct, setRiskPct, 0.1], ["Entry Price", entry, setEntry, 0.0001], ["Stop Loss", sl, setSl, 0.0001], ["Take Profit", tp, setTp, 0.0001]].map(([label, val, setter, step]) => (
              <div key={label}>
                <label style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                <input style={S.input} type="number" step={step} value={val} onChange={e => setter(e.target.value)} placeholder={`Enter ${label.toLowerCase()}`} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          {[["Risk Amount", `$${riskAmount}`, "#ff6b6b"], ["SL Pips", slPips, "#ff6b6b"], ["TP Pips", tpPips, "#00ff88"], ["Risk/Reward", rr, "#7eb8ff"], ["Lot Size", lotSize, "#00ff88"]].map(([l, v, c]) => (
            <div key={l} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "rgba(200,220,205,0.6)" }}>{l}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: c, fontFamily: "'Syne', system-ui" }}>{v}</span>
            </div>
          ))}
          <div style={{ ...S.card, background: "#141f18", border: "1px solid rgba(0,255,136,0.15)" }}>
            <div style={{ fontSize: 11, color: "rgba(0,255,136,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>S&D Rule of Thumb</div>
            <div style={{ fontSize: 12, color: "rgba(200,220,205,0.6)", lineHeight: 1.7 }}>Minimum 1:2 R:R for supply/demand setups. Strong zones warrant tighter SL. Never risk more than 2% per trade.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function JournalPage() {
  const [trades, setTrades] = useState([
    { id: 1, date: "2024-03-20", pair: "EUR/USD", direction: "BUY", entry: "1.0835", sl: "1.0810", tp: "1.0920", result: "WIN", pnl: "+85", notes: "Demand zone bounce on H4" },
    { id: 2, date: "2024-03-19", pair: "US100", direction: "BUY", entry: "17820", sl: "17700", tp: "18100", result: "WIN", pnl: "+280", notes: "Rally-Base-Rally setup" },
    { id: 3, date: "2024-03-18", pair: "GBP/USD", direction: "SELL", entry: "1.2720", sl: "1.2760", tp: "1.2600", result: "LOSS", pnl: "-40", notes: "Supply zone sell, got stopped out" },
  ])
  const [form, setForm] = useState({ pair: "", direction: "BUY", entry: "", sl: "", tp: "", result: "WIN", pnl: "", notes: "" })
  const [showForm, setShowForm] = useState(false)
  const addTrade = () => {
    if (!form.pair || !form.entry) return
    setTrades([{ ...form, id: Date.now(), date: new Date().toISOString().split("T")[0] }, ...trades])
    setForm({ pair: "", direction: "BUY", entry: "", sl: "", tp: "", result: "WIN", pnl: "", notes: "" })
    setShowForm(false)
  }
  const winRate = trades.length ? Math.round(trades.filter(t => t.result === "WIN").length / trades.length * 100) : 0
  const totalPnl = trades.reduce((s, t) => s + parseFloat(t.pnl || 0), 0)
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 0.5rem", fontFamily: "'Syne', system-ui" }}>Trade Journal</h2>
          <p style={{ fontSize: 13, color: "rgba(200,220,205,0.5)", margin: 0 }}>Track every supply & demand trade</p>
        </div>
        <button style={S.btnPrimary} onClick={() => setShowForm(!showForm)}>+ Log Trade</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[["Total Trades", trades.length, "#c8dcd0"], ["Win Rate", winRate + "%", winRate >= 50 ? "#00ff88" : "#ff6b6b"], ["Total P&L", (totalPnl >= 0 ? "+" : "") + "$" + totalPnl.toFixed(0), totalPnl >= 0 ? "#00ff88" : "#ff6b6b"]].map(([l, v, c]) => (
          <div key={l} style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(200,220,205,0.4)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{l}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: c, fontFamily: "'Syne', system-ui" }}>{v}</div>
          </div>
        ))}
      </div>
      {showForm && (
        <div style={{ ...S.card, marginBottom: "1.5rem", border: "1px solid rgba(0,255,136,0.2)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8ede9", marginBottom: 12 }}>New Trade Entry</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
            {[["Pair", "pair", "text", "EUR/USD"], ["Entry", "entry", "number", "1.0835"], ["Stop Loss", "sl", "number", "1.0810"], ["Take Profit", "tp", "number", "1.0920"], ["P&L ($)", "pnl", "number", "85"]].map(([l, k, t, ph]) => (
              <div key={k}>
                <label style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", display: "block", marginBottom: 5 }}>{l}</label>
                <input style={S.input} type={t} placeholder={ph} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", display: "block", marginBottom: 5 }}>Direction</label>
              <select style={S.input} value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })}>
                <option value="BUY">BUY</option><option value="SELL">SELL</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", display: "block", marginBottom: 5 }}>Result</label>
              <select style={S.input} value={form.result} onChange={e => setForm({ ...form, result: e.target.value })}>
                <option value="WIN">WIN</option><option value="LOSS">LOSS</option><option value="BE">BREAKEVEN</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <label style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", display: "block", marginBottom: 5 }}>Notes</label>
            <textarea style={{ ...S.input, resize: "vertical", minHeight: 60 }} placeholder="Describe the S&D setup..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button style={S.btnPrimary} onClick={addTrade}>Save Trade</button>
            <button style={S.btn} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {trades.map(t => (
          <div key={t.id} style={{ ...S.card, display: "grid", gridTemplateColumns: "100px 80px 1fr auto", gap: 12, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e8ede9" }}>{t.pair}</div>
              <div style={{ fontSize: 11, color: "rgba(200,220,205,0.4)" }}>{t.date}</div>
            </div>
            <div><span style={S.badge(t.direction)}>{t.direction}</span></div>
            <div style={{ fontSize: 12, color: "rgba(200,220,205,0.6)", lineHeight: 1.5 }}>
              <span style={{ marginRight: 12 }}>Entry: {t.entry}</span>
              <span style={{ marginRight: 12 }}>SL: {t.sl}</span>
              <span>TP: {t.tp}</span>
              {t.notes && <div style={{ marginTop: 2, color: "rgba(200,220,205,0.4)", fontSize: 11 }}>{t.notes}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: parseFloat(t.pnl) >= 0 ? "#00ff88" : "#ff6b6b" }}>{parseFloat(t.pnl) >= 0 ? "+" : ""}${t.pnl}</div>
              <div style={{ fontSize: 11, color: t.result === "WIN" ? "#00ff88" : t.result === "LOSS" ? "#ff6b6b" : "rgba(200,220,205,0.5)" }}>{t.result}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CommunityPage() {
  const [tab, setTab] = useState("discussions")
  const [joinName, setJoinName] = useState("")
  const [joinEmail, setJoinEmail] = useState("")
  const [joinExp, setJoinExp] = useState("")
  const [joined, setJoined] = useState(false)
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 0.5rem", fontFamily: "'Syne', system-ui" }}>Community</h2>
        <p style={{ fontSize: 13, color: "rgba(200,220,205,0.5)", margin: 0 }}>Trade together, grow together</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[["2,500+", "Active Members"], ["500+", "Daily Posts"], ["24/7", "Live Support"]].map(([v, l]) => (
          <div key={l} style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#00ff88", fontFamily: "'Syne', system-ui", marginBottom: 4 }}>{v}</div>
            <div style={{ fontSize: 11, color: "rgba(200,220,205,0.4)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {["discussions", "join"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", borderRadius: 20, border: `1px solid ${tab === t ? "rgba(0,255,136,0.5)" : "rgba(0,255,136,0.12)"}`, background: tab === t ? "rgba(0,255,136,0.1)" : "transparent", color: tab === t ? "#00ff88" : "rgba(200,220,205,0.5)", fontSize: 12, cursor: "pointer", textTransform: "capitalize", fontWeight: tab === t ? 600 : 400 }}>{t === "join" ? "Join Now" : "Discussions"}</button>
        ))}
      </div>
      {tab === "discussions" && (
        <div style={{ display: "grid", gap: 10 }}>
          {DISCUSSIONS.map(d => (
            <div key={d.id} style={S.cardHover}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.1)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#00ff88", flexShrink: 0 }}>{d.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#e8ede9" }}>{d.title}</span>
                    <span style={{ ...S.badge("Medium"), background: "rgba(100,160,255,0.08)", color: "#7eb8ff", borderColor: "rgba(100,160,255,0.2)", fontSize: 10 }}>{d.pair}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(200,220,205,0.4)", marginBottom: 6 }}>{d.author} · {d.time}</div>
                  <div style={{ fontSize: 13, color: "rgba(200,220,205,0.6)", lineHeight: 1.6, marginBottom: 8 }}>{d.preview}</div>
                  <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(200,220,205,0.4)" }}>
                    <span>💬 {d.replies} replies</span>
                    <span>♥ {d.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "join" && (
        <div style={{ maxWidth: 480 }}>
          {joined ? (
            <div style={{ ...S.card, textAlign: "center", padding: "2.5rem", border: "1px solid rgba(0,255,136,0.25)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#00ff88", marginBottom: 8 }}>Welcome to RTR!</div>
              <div style={{ fontSize: 13, color: "rgba(200,220,205,0.6)" }}>You're now part of the community. Check your email for next steps.</div>
            </div>
          ) : (
            <div style={S.card}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e8ede9", marginBottom: 4 }}>Ready to Join?</div>
              <div style={{ fontSize: 13, color: "rgba(200,220,205,0.5)", marginBottom: "1.5rem" }}>Get access to exclusive signals and community discussions.</div>
              <div style={{ display: "grid", gap: 14 }}>
                {[["Full Name", joinName, setJoinName, "text", "Your name"], ["Email Address", joinEmail, setJoinEmail, "email", "your@email.com"]].map(([l, v, s, t, ph]) => (
                  <div key={l}>
                    <label style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</label>
                    <input style={S.input} type={t} value={v} onChange={e => s(e.target.value)} placeholder={ph} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, color: "rgba(200,220,205,0.5)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Trading Experience</label>
                  <select style={S.input} value={joinExp} onChange={e => setJoinExp(e.target.value)}>
                    <option value="">Select level</option>
                    <option value="beginner">Beginner (0–1 years)</option>
                    <option value="intermediate">Intermediate (1–3 years)</option>
                    <option value="advanced">Advanced (3+ years)</option>
                  </select>
                </div>
                <button style={S.btnPrimary} onClick={() => { if (joinName && joinEmail) setJoined(true) }}>Join Community →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── APP SHELL ───────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home")
  const [watchlist, setWatchlist] = useState(["EUR/USD", "US100"])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const toggleWatch = (id) => setWatchlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])

  const navItems = [
    { id: "home", label: "Home", icon: <Icon.Home /> },
    { id: "explore", label: "Explore", icon: <Icon.Explore /> },
    { id: "calendar", label: "Calendar", icon: <Icon.News /> },
    { id: "risk", label: "Risk Calc", icon: <Icon.Calc /> },
    { id: "journal", label: "Journal", icon: <Icon.Journal /> },
    { id: "community", label: "Community", icon: <Icon.Community /> },
  ]

  const renderPage = () => {
    if (page.startsWith("pair:")) return <PairDetailPage pairId={page.replace("pair:", "")} setPage={setPage} />
    switch (page) {
      case "explore": return <ExplorePage setPage={setPage} watchlist={watchlist} toggleWatch={toggleWatch} />
      case "calendar": return <CalendarPage />
      case "risk": return <RiskCalcPage />
      case "journal": return <JournalPage />
      case "community": return <CommunityPage />
      default: return <HomePage setPage={setPage} />
    }
  }

  const SidebarContent = ({ onNav }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={S.logo}>
        <div style={S.logoText}>RTR FX</div>
        <div style={S.logoSub}>Supply & Demand</div>
      </div>
      <nav style={{ flex: 1, padding: "0.5rem 0" }}>
        {navItems.map(n => (
          <div key={n.id} style={S.navItem(page === n.id || (page.startsWith("pair:") && n.id === "explore"))}
            onClick={() => { setPage(n.id); onNav?.() }}>
            {n.icon} {n.label}
          </div>
        ))}
      </nav>
      <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(0,255,136,0.06)" }}>
        <div style={{ fontSize: 10, color: "rgba(0,255,136,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>Watchlist</div>
        {watchlist.length === 0 && <div style={{ fontSize: 11, color: "rgba(200,220,205,0.3)" }}>Star pairs to watch</div>}
        {watchlist.slice(0, 5).map(id => {
          const p = [...FOREX_PAIRS, ...INDICES].find(x => x.id === id)
          return p ? (
            <div key={id} onClick={() => { setPage("pair:" + id); onNav?.() }} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", cursor: "pointer", borderBottom: "1px solid rgba(0,255,136,0.04)" }}>
              <span style={{ fontSize: 12, color: "#c8dcd0" }}>{id}</span>
              <span style={{ fontSize: 11, color: p.positive ? "#00ff88" : "#ff6b6b" }}>{p.change}</span>
            </div>
          ) : null
        })}
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0b0f0d; } ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.2); border-radius: 2px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select option { background: #141a16; }
      `}</style>
      <div style={S.app}>
        {!isMobile && (
          <aside style={S.sidebar}>
            <SidebarContent />
          </aside>
        )}
        {isMobile && mobileMenuOpen && (
          <div style={S.sidebarMobile}>
            <div style={S.sidebarOverlay} onClick={() => setMobileMenuOpen(false)} />
            <div style={{ ...S.sidebar, position: "relative", width: 240, zIndex: 1 }}>
              <SidebarContent onNav={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}
        <div style={{ flex: 1, marginLeft: isMobile ? 0 : 220, display: "flex", flexDirection: "column" }}>
          {isMobile && (
            <header style={S.mobileHeader}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#00ff88", fontFamily: "'Syne', system-ui" }}>RTR FX</div>
              <button onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", color: "#e8ede9", cursor: "pointer" }}>
                <Icon.Menu />
              </button>
            </header>
          )}
          <main style={{ padding: isMobile ? "1.25rem" : "2rem 2.5rem", flex: 1, maxWidth: 1100 }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  )
}
