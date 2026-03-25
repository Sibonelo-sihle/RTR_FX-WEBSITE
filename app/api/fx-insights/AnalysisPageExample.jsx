"use client"
// app/analysis/[pair]/page.jsx  (or pages/analysis/[pair].jsx if using Pages Router)
// This shows how to wire TradingViewChart + FXInsightsPanel together.
// Drop this into your existing analysis page, or use as a reference.

import { useState } from "react"
import TradingViewChart from "../../../components/TradingViewChart"
import FXInsightsPanel from "../../../components/FXInsightsPanel"

const PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD",
  "USD/CHF", "NZD/USD", "USD/CAD",
  "EUR/GBP", "EUR/JPY", "GBP/JPY",
  "XAU/USD", "US100", "US30",
]

export default function AnalysisPage({ params }) {
  // If using dynamic route [pair], decode it:
  // const pair = params?.pair ? decodeURIComponent(params.pair).replace("-", "/") : "EUR/USD"
  const [selectedPair, setSelectedPair] = useState("EUR/USD")
  const [insights, setInsights] = useState(null)

  return (
    <div className="analysis-page">
      {/* Pair selector */}
      <div className="pair-selector">
        <div className="pair-label">Select Pair</div>
        <div className="pair-list">
          {PAIRS.map(p => (
            <button
              key={p}
              className={`pair-btn ${selectedPair === p ? "active" : ""}`}
              onClick={() => { setSelectedPair(p); setInsights(null) }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout: Chart left, Insights right */}
      <div className="analysis-layout">
        <div className="chart-col">
          <TradingViewChart pair={selectedPair} insights={insights} />
        </div>
        <div className="insights-col">
          <FXInsightsPanel
            pair={selectedPair}
            onInsightsLoaded={(data) => setInsights(data)}
          />
        </div>
      </div>

      <style>{`
        .analysis-page {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #080d13;
          min-height: 100vh;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }
        .pair-selector {
          background: #0d1117;
          border: 1px solid #1e2d3d;
          border-radius: 10px;
          padding: 10px 14px;
        }
        .pair-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #5a7a9a;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .pair-list {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .pair-btn {
          padding: 4px 11px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid #1e2d3d;
          border-radius: 5px;
          background: transparent;
          color: #5a7a9a;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          letter-spacing: 0.04em;
        }
        .pair-btn:hover { color: #a0c4e8; border-color: #2e4d6d; }
        .pair-btn.active {
          background: #0e4d8a;
          border-color: #1a7acc;
          color: #e8f4ff;
        }
        .analysis-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 14px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .analysis-layout { grid-template-columns: 1fr; }
        }
        .chart-col { min-width: 0; }
        .insights-col { position: sticky; top: 16px; }
      `}</style>
    </div>
  )
}
