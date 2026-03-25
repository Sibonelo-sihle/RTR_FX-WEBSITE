"use client"
// components/TradingViewChart.jsx

import { useEffect, useRef, useState } from "react"

const TIMEFRAMES = [
  { label: "15m", value: "15" },
  { label: "1H", value: "60" },
  { label: "4H", value: "240" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
]

// Maps RTRApp symbols to TradingView symbols
function toTVSymbol(symbol) {
  const map = {
    EURUSD: "FX:EURUSD",
    GBPUSD: "FX:GBPUSD",
    USDJPY: "FX:USDJPY",
    USDCHF: "FX:USDCHF",
    AUDUSD: "FX:AUDUSD",
    NZDUSD: "FX:NZDUSD",
    USDCAD: "FX:USDCAD",
    EURGBP: "FX:EURGBP",
    EURJPY: "FX:EURJPY",
    GBPJPY: "FX:GBPJPY",
    XAUUSD: "OANDA:XAUUSD",
    // Indices — match RTRApp's symbol field exactly
    DJ30:   "DJ:DJI",
    NAS100: "NASDAQ:NDX",
    DAX40:  "XETR:DAX",
    SPX500: "SP:SPX",
    UK100:  "INDEX:UKX",
    // Also handle pair-style input
    "EUR/USD": "FX:EURUSD",
    "GBP/USD": "FX:GBPUSD",
    "USD/JPY": "FX:USDJPY",
    "AUD/USD": "FX:AUDUSD",
    "USD/CAD": "FX:USDCAD",
    "NZD/USD": "FX:NZDUSD",
    "EUR/GBP": "FX:EURGBP",
    "USD/CHF": "FX:USDCHF",
    US30:   "DJ:DJI",
    US100:  "NASDAQ:NDX",
    GER30:  "XETR:DAX",
    SP500:  "SP:SPX",
    FTSE100: "INDEX:UKX",
  }
  return map[symbol] || `FX:${symbol}`
}

export default function TradingViewChart({ symbol, pair, insights = null }) {
  // Accept either 'symbol' (from RTRApp pair.symbol) or 'pair' (from pair.id)
  const inputSymbol = symbol || pair || "EURUSD"
  const tvSymbol = toTVSymbol(inputSymbol)
  const displayName = pair || symbol || "Chart"

  const containerRef = useRef(null)
  const [timeframe, setTimeframe] = useState("240")
  const [chartReady, setChartReady] = useState(false)
  const containerId = `tv-${inputSymbol.replace(/[^a-zA-Z0-9]/g, "")}-${timeframe}`

  // Load TradingView script once
  useEffect(() => {
    if (window.TradingView) {
      setChartReady(true)
      return
    }
    if (document.getElementById("tv-script")) {
      // Script tag exists but may still be loading
      const existing = document.getElementById("tv-script")
      existing.addEventListener("load", () => setChartReady(true))
      return
    }
    const script = document.createElement("script")
    script.id = "tv-script"
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => setChartReady(true)
    document.head.appendChild(script)
  }, [])

  // Init widget whenever ready, pair, or timeframe changes
  useEffect(() => {
    if (!chartReady || !containerRef.current || !window.TradingView) return

    containerRef.current.innerHTML = ""

    const div = document.createElement("div")
    div.id = containerId
    div.style.height = "100%"
    div.style.width = "100%"
    containerRef.current.appendChild(div)

    try {
      new window.TradingView.widget({
        container_id: containerId,
        symbol: tvSymbol,
        interval: timeframe,
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0f1410",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        height: "100%",
        width: "100%",
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
          "scalesProperties.backgroundColor": "#0f1410",
        },
      })
    } catch (e) {
      console.error("TradingView widget error:", e)
    }
  }, [chartReady, tvSymbol, timeframe, containerId])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 460, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,255,136,0.1)", background: "#0f1410" }}>
      {/* Timeframe bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: "#0a0d0a", borderBottom: "1px solid rgba(0,255,136,0.08)", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#00ff88", letterSpacing: "0.08em" }}>{displayName}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {TIMEFRAMES.map(tf => (
            <button key={tf.value} onClick={() => setTimeframe(tf.value)}
              style={{ padding: "3px 10px", fontSize: 11, fontWeight: 600, border: `1px solid ${timeframe === tf.value ? "rgba(0,255,136,0.5)" : "rgba(0,255,136,0.1)"}`, borderRadius: 5, background: timeframe === tf.value ? "rgba(0,255,136,0.1)" : "transparent", color: timeframe === tf.value ? "#00ff88" : "rgba(200,220,205,0.4)", cursor: "pointer" }}>
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone pills (if AI insights loaded) */}
      {insights && (
        <div style={{ display: "flex", gap: 8, padding: "6px 14px", background: "#0a0d0a", borderBottom: "1px solid rgba(0,255,136,0.06)", flexShrink: 0, flexWrap: "wrap" }}>
          {insights.supplyZones?.length > 0 && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(255,71,87,0.15)", color: "#ff6b6b", border: "1px solid rgba(255,71,87,0.3)" }}>
              📦 {insights.supplyZones.length} Supply zone{insights.supplyZones.length > 1 ? "s" : ""}
            </span>
          )}
          {insights.demandZones?.length > 0 && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "rgba(0,255,136,0.1)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.25)" }}>
              🧲 {insights.demandZones.length} Demand zone{insights.demandZones.length > 1 ? "s" : ""}
            </span>
          )}
          {insights.bias && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: insights.bias === "Bullish" ? "rgba(0,255,136,0.1)" : "rgba(255,71,87,0.1)", color: insights.bias === "Bullish" ? "#00ff88" : "#ff6b6b", border: `1px solid ${insights.bias === "Bullish" ? "rgba(0,255,136,0.25)" : "rgba(255,71,87,0.3)"}` }}>
              {insights.bias === "Bullish" ? "📈" : insights.bias === "Bearish" ? "📉" : "➡️"} {insights.bias}
            </span>
          )}
        </div>
      )}

      {/* TradingView container */}
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />

      {/* Key levels bar */}
      {insights?.keyLevels && (
        <div style={{ display: "flex", gap: 16, padding: "6px 14px", background: "#0a0d0a", borderTop: "1px solid rgba(0,255,136,0.06)", fontSize: 11, flexShrink: 0, flexWrap: "wrap" }}>
          {insights.keyLevels.majorResistance?.length > 0 && (
            <span style={{ color: "#ff6b6b", fontWeight: 600 }}>
              R: {insights.keyLevels.majorResistance.slice(0, 2).join(" · ")}
            </span>
          )}
          {insights.keyLevels.majorSupport?.length > 0 && (
            <span style={{ color: "#00ff88", fontWeight: 600 }}>
              S: {insights.keyLevels.majorSupport.slice(0, 2).join(" · ")}
            </span>
          )}
          {insights.keyLevels.weeklyHigh && (
            <span style={{ color: "rgba(200,220,205,0.4)" }}>
              W.Hi: {insights.keyLevels.weeklyHigh} · W.Lo: {insights.keyLevels.weeklyLow}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
