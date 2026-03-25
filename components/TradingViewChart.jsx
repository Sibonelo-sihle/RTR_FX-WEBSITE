"use client"
// components/TradingViewChart.jsx
// Place this file at: components/TradingViewChart.jsx

import { useEffect, useRef, useState } from "react"

const TIMEFRAMES = [
  { label: "15m", value: "15" },
  { label: "1H", value: "60" },
  { label: "4H", value: "240" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
]

// Map common pair names to TradingView symbols
function toTVSymbol(pair) {
  const clean = pair.replace("/", "").replace("-", "").toUpperCase()
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
    US100: "NASDAQ:NDX",
    US30:  "DJ:DJI",
    SPX500: "SP:SPX",
  }
  return map[clean] || `FX:${clean}`
}

export default function TradingViewChart({ pair = "EUR/USD", insights = null }) {
  const containerRef = useRef(null)
  const widgetRef = useRef(null)
  const [timeframe, setTimeframe] = useState("240")
  const [chartReady, setChartReady] = useState(false)

  const tvSymbol = toTVSymbol(pair)
  const containerId = `tv-chart-${pair.replace(/[^a-zA-Z0-9]/g, "")}`

  // Load TradingView script once
  useEffect(() => {
    if (document.getElementById("tv-script")) {
      setChartReady(true)
      return
    }
    const script = document.createElement("script")
    script.id = "tv-script"
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => setChartReady(true)
    document.head.appendChild(script)
  }, [])

  // Init or re-init widget when chart is ready or pair/timeframe changes
  useEffect(() => {
    if (!chartReady || !containerRef.current) return

    // Clear previous widget
    if (containerRef.current) containerRef.current.innerHTML = ""

    const div = document.createElement("div")
    div.id = containerId
    div.style.height = "100%"
    div.style.width = "100%"
    containerRef.current.appendChild(div)

    widgetRef.current = new window.TradingView.widget({
      container_id: containerId,
      symbol: tvSymbol,
      interval: timeframe,
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#0d1117",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      height: "100%",
      width: "100%",
      studies: [
        "MASimple@tv-scriptstd;length=20",
        "MASimple@tv-scriptstd;length=50",
        "MASimple@tv-scriptstd;length=200",
      ],
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#00d4aa",
        "mainSeriesProperties.candleStyle.downColor": "#ff4757",
        "mainSeriesProperties.candleStyle.borderUpColor": "#00d4aa",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ff4757",
        "mainSeriesProperties.candleStyle.wickUpColor": "#00d4aa",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ff4757",
        "paneProperties.background": "#0d1117",
        "paneProperties.backgroundType": "solid",
        "paneProperties.gridLinesMode": "both",
        "paneProperties.vertGridProperties.color": "#1a2332",
        "paneProperties.horzGridProperties.color": "#1a2332",
        "scalesProperties.textColor": "#8899aa",
        "scalesProperties.backgroundColor": "#0d1117",
      },
    })
  }, [chartReady, pair, timeframe, tvSymbol, containerId])

  return (
    <div className="rtr-chart-wrapper">
      {/* Timeframe selector */}
      <div className="rtr-tf-bar">
        <span className="rtr-pair-label">{pair}</span>
        <div className="rtr-tf-buttons">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              className={`rtr-tf-btn ${timeframe === tf.value ? "active" : ""}`}
              onClick={() => setTimeframe(tf.value)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone legend overlay (shown if insights available) */}
      {insights && (
        <div className="rtr-zone-legend">
          <div className="rtr-zone-pill supply">
            📦 Supply: {insights.supplyZones?.length || 0} zones
          </div>
          <div className="rtr-zone-pill demand">
            🧲 Demand: {insights.demandZones?.length || 0} zones
          </div>
          <div className={`rtr-zone-pill bias ${insights.bias?.toLowerCase()}`}>
            {insights.bias === "BULLISH" ? "📈" : insights.bias === "BEARISH" ? "📉" : "➡️"}{" "}
            {insights.bias}
          </div>
        </div>
      )}

      {/* TradingView container */}
      <div ref={containerRef} className="rtr-tv-container" />

      {/* Key levels bar below chart */}
      {insights?.keyLevels && (
        <div className="rtr-levels-bar">
          <div className="rtr-level resistance">
            <span className="dot" />
            R: {insights.keyLevels.majorResistance?.slice(0, 2).join(" · ") || "—"}
          </div>
          <div className="rtr-level support">
            <span className="dot" />
            S: {insights.keyLevels.majorSupport?.slice(0, 2).join(" · ") || "—"}
          </div>
          <div className="rtr-level weekly">
            📅 W.High: {insights.keyLevels.weeklyHigh || "—"} · W.Low:{" "}
            {insights.keyLevels.weeklyLow || "—"}
          </div>
        </div>
      )}

      <style>{`
        .rtr-chart-wrapper {
          display: flex;
          flex-direction: column;
          background: #0d1117;
          border: 1px solid #1e2d3d;
          border-radius: 12px;
          overflow: hidden;
          height: 520px;
          position: relative;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }
        .rtr-tf-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: #0a0f16;
          border-bottom: 1px solid #1e2d3d;
          flex-shrink: 0;
          gap: 10px;
        }
        .rtr-pair-label {
          font-size: 13px;
          font-weight: 700;
          color: #e8f4ff;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .rtr-tf-buttons {
          display: flex;
          gap: 4px;
        }
        .rtr-tf-btn {
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid #1e2d3d;
          border-radius: 5px;
          background: transparent;
          color: #5a7a9a;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
          letter-spacing: 0.04em;
        }
        .rtr-tf-btn:hover { color: #a0c4e8; border-color: #2e4d6d; }
        .rtr-tf-btn.active {
          background: #0e4d8a;
          border-color: #1a7acc;
          color: #e8f4ff;
        }
        .rtr-zone-legend {
          position: absolute;
          top: 50px;
          right: 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 10;
        }
        .rtr-zone-pill {
          font-size: 10px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
          letter-spacing: 0.05em;
        }
        .rtr-zone-pill.supply { background: rgba(255,71,87,0.2); color: #ff6b7a; border: 1px solid rgba(255,71,87,0.4); }
        .rtr-zone-pill.demand { background: rgba(0,212,170,0.2); color: #00d4aa; border: 1px solid rgba(0,212,170,0.4); }
        .rtr-zone-pill.bullish { background: rgba(0,212,170,0.2); color: #00d4aa; border: 1px solid rgba(0,212,170,0.4); }
        .rtr-zone-pill.bearish { background: rgba(255,71,87,0.2); color: #ff6b7a; border: 1px solid rgba(255,71,87,0.4); }
        .rtr-zone-pill.neutral { background: rgba(255,200,0,0.15); color: #ffc800; border: 1px solid rgba(255,200,0,0.3); }
        .rtr-tv-container {
          flex: 1;
          min-height: 0;
        }
        .rtr-levels-bar {
          display: flex;
          gap: 16px;
          padding: 7px 14px;
          background: #0a0f16;
          border-top: 1px solid #1e2d3d;
          font-size: 11px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .rtr-level {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          letter-spacing: 0.03em;
        }
        .rtr-level .dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .rtr-level.resistance { color: #ff6b7a; }
        .rtr-level.resistance .dot { background: #ff4757; }
        .rtr-level.support { color: #00d4aa; }
        .rtr-level.support .dot { background: #00d4aa; }
        .rtr-level.weekly { color: #8899aa; }
      `}</style>
    </div>
  )
}
