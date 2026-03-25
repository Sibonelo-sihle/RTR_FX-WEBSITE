"use client"
// components/FXInsightsPanel.jsx

import { useState } from "react"

export default function FXInsightsPanel({ pair = "EUR/USD", onInsightsLoaded }) {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  async function fetchInsights() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/fx-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair,
          price: "market",
          change: "N/A",
          weekly: "N/A",
          monthly: "N/A",
          signal: "N/A",
          strength: "N/A",
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData?.details || `API error ${res.status}`)
      }
      const data = await res.json()
      if (data.error) throw new Error(data.details || data.error)
      setInsights(data)
      if (onInsightsLoaded) onInsightsLoaded(data)
    } catch (err) {
      setError(err.message || "Failed to load insights. Check your GEMINI_API_KEY in .env.local")
    } finally {
      setLoading(false)
    }
  }

  const bias = insights?.bias?.toUpperCase()
  const biasColor = bias === "BULLISH" ? "#00d4aa" : bias === "BEARISH" ? "#ff4757" : "#ffc800"

  return (
    <div className="ins-panel">
      {/* Header */}
      <div className="ins-header">
        <div className="ins-title">
          <span className="ins-icon">🧠</span>
          <div>
            <div className="ins-label">AI Analysis</div>
            <div className="ins-sub">{pair} · Supply & Demand</div>
          </div>
        </div>
        <button
          className={`ins-fetch-btn ${loading ? "loading" : ""}`}
          onClick={fetchInsights}
          disabled={loading}
        >
          {loading ? <><span className="spinner" /> Analysing...</> : insights ? "↻ Refresh" : "⚡ Analyse"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="ins-error">⚠️ {error}</div>}

      {/* Empty state */}
      {!insights && !loading && !error && (
        <div className="ins-empty">
          <div className="ins-empty-icon">📊</div>
          <p>Click <strong>Analyse</strong> to get AI-powered supply &amp; demand zones and trade setup for <strong>{pair}</strong>.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="ins-skeleton">
          {[1,2,3,4].map(i => <div key={i} className="ins-skel-row" style={{width:`${85-i*8}%`}} />)}
        </div>
      )}

      {/* Content */}
      {insights && !loading && (
        <>
          {/* Bias */}
          <div className="ins-bias-card" style={{ borderColor: biasColor }}>
            <div>
              <div className="ins-bias-label">Market Bias</div>
              <div className="ins-bias-value" style={{ color: biasColor }}>
                {bias === "BULLISH" ? "📈" : bias === "BEARISH" ? "📉" : "➡️"} {bias}
              </div>
              <div className="ins-structure">{insights.setupType}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="ins-bias-label">Key Level</div>
              <div style={{color:"#e8f4ff", fontWeight:700, fontSize:14}}>{insights.keyLevel}</div>
            </div>
          </div>

          {/* Summary */}
          <p className="ins-summary">{insights.summary}</p>

          {/* Tabs */}
          <div className="ins-tabs">
            {["overview","zones","setup","levels"].map(tab => (
              <button key={tab} className={`ins-tab ${activeTab===tab?"active":""}`} onClick={()=>setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="ins-section">
              <div className="ins-row"><span className="ins-key">Outlook</span><span className="ins-val">{insights.outlook}</span></div>
              <div className="ins-row"><span className="ins-key">Setup</span><span className="ins-val">{insights.setupType}</span></div>
              <div className="ins-row risk"><span className="ins-key">⚠ Risk</span><span className="ins-val">{insights.riskNote}</span></div>
            </div>
          )}

          {/* Zones */}
          {activeTab === "zones" && (
            <div className="ins-section">
              <div className="ins-zone-group">
                <div className="ins-zone-title supply-title">🔴 Supply Zones</div>
                {insights.supplyZones?.map((z, i) => (
                  <div key={i} className="ins-zone supply-zone">
                    <div className="ins-zone-row">
                      <span className="ins-zone-level">{z.range}</span>
                      <span className={`ins-zone-strength ${z.strength?.toLowerCase()}`}>{z.strength}</span>
                    </div>
                    <div className="ins-zone-desc">{z.note}</div>
                  </div>
                ))}
              </div>
              <div className="ins-zone-group">
                <div className="ins-zone-title demand-title">🟢 Demand Zones</div>
                {insights.demandZones?.map((z, i) => (
                  <div key={i} className="ins-zone demand-zone">
                    <div className="ins-zone-row">
                      <span className="ins-zone-level">{z.range}</span>
                      <span className={`ins-zone-strength ${z.strength?.toLowerCase()}`}>{z.strength}</span>
                    </div>
                    <div className="ins-zone-desc">{z.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Setup */}
          {activeTab === "setup" && insights.tradeSetup && (
            <div className="ins-section">
              <div className="ins-setup-rows">
                <div className="ins-setup-row">
                  <span className="ins-setup-key">Entry</span>
                  <span className="ins-setup-val">{insights.tradeSetup.entry}</span>
                </div>
                <div className="ins-setup-row">
                  <span className="ins-setup-key stop">Stop</span>
                  <span className="ins-setup-val">{insights.tradeSetup.sl}</span>
                </div>
                <div className="ins-setup-row">
                  <span className="ins-setup-key target">Target</span>
                  <span className="ins-setup-val">{insights.tradeSetup.tp}</span>
                </div>
                <div className="ins-setup-row">
                  <span className="ins-setup-key rr">R:R</span>
                  <span className="ins-setup-val" style={{color:"#ffc800",fontWeight:700}}>{insights.tradeSetup.rr}</span>
                </div>
              </div>
            </div>
          )}

          {/* Levels */}
          {activeTab === "levels" && insights.keyLevels && (
            <div className="ins-section">
              <div className="ins-levels-grid">
                <div className="ins-level-card resistance">
                  <div className="ins-level-card-title">Resistance</div>
                  {insights.keyLevels.majorResistance?.map((l,i) => <div key={i} className="ins-level-val">{l}</div>)}
                </div>
                <div className="ins-level-card support">
                  <div className="ins-level-card-title">Support</div>
                  {insights.keyLevels.majorSupport?.map((l,i) => <div key={i} className="ins-level-val">{l}</div>)}
                </div>
                <div className="ins-level-card weekly-h">
                  <div className="ins-level-card-title">Weekly High</div>
                  <div className="ins-level-val large">{insights.keyLevels.weeklyHigh}</div>
                </div>
                <div className="ins-level-card weekly-l">
                  <div className="ins-level-card-title">Weekly Low</div>
                  <div className="ins-level-val large">{insights.keyLevels.weeklyLow}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .ins-panel { background:#0d1117; border:1px solid #1e2d3d; border-radius:12px; padding:16px; font-family:'JetBrains Mono','Fira Code',monospace; color:#c8d8e8; display:flex; flex-direction:column; gap:12px; min-height:200px; }
        .ins-header { display:flex; justify-content:space-between; align-items:center; }
        .ins-title { display:flex; align-items:center; gap:10px; }
        .ins-icon { font-size:22px; }
        .ins-label { font-size:13px; font-weight:700; color:#e8f4ff; letter-spacing:0.06em; }
        .ins-sub { font-size:10px; color:#5a7a9a; letter-spacing:0.04em; }
        .ins-fetch-btn { padding:7px 16px; font-size:12px; font-weight:700; background:linear-gradient(135deg,#0e4d8a,#1a7acc); border:none; border-radius:7px; color:#e8f4ff; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s; font-family:inherit; letter-spacing:0.04em; }
        .ins-fetch-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 15px rgba(26,122,204,0.4); }
        .ins-fetch-btn:disabled { opacity:0.7; cursor:default; }
        .spinner { width:10px; height:10px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .ins-error { background:rgba(255,71,87,0.1); border:1px solid rgba(255,71,87,0.3); border-radius:7px; padding:10px 12px; font-size:11px; color:#ff6b7a; }
        .ins-empty { text-align:center; padding:20px 0; color:#5a7a9a; }
        .ins-empty-icon { font-size:32px; margin-bottom:8px; }
        .ins-empty p { font-size:12px; line-height:1.6; max-width:280px; margin:0 auto; }
        .ins-skeleton { display:flex; flex-direction:column; gap:8px; padding:4px 0; }
        .ins-skel-row { height:14px; background:linear-gradient(90deg,#1a2332 25%,#243040 50%,#1a2332 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:4px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .ins-bias-card { display:flex; justify-content:space-between; align-items:center; background:#0a0f16; border:1px solid; border-radius:9px; padding:12px 14px; }
        .ins-bias-label { font-size:10px; color:#5a7a9a; text-transform:uppercase; letter-spacing:0.08em; }
        .ins-bias-value { font-size:18px; font-weight:800; letter-spacing:0.05em; margin:2px 0; }
        .ins-structure { font-size:11px; color:#7a9aaa; }
        .ins-summary { font-size:12px; line-height:1.7; color:#8899aa; }
        .ins-tabs { display:flex; gap:2px; background:#0a0f16; border-radius:8px; padding:3px; }
        .ins-tab { flex:1; padding:5px 0; font-size:11px; font-weight:600; border:none; border-radius:5px; background:transparent; color:#5a7a9a; cursor:pointer; transition:all 0.15s; font-family:inherit; letter-spacing:0.04em; }
        .ins-tab:hover { color:#a0c4e8; }
        .ins-tab.active { background:#1e2d3d; color:#e8f4ff; }
        .ins-section { display:flex; flex-direction:column; gap:8px; }
        .ins-row { display:flex; gap:10px; padding:7px 10px; background:#0a0f16; border-radius:6px; }
        .ins-row.risk { border-left:2px solid #ffc800; }
        .ins-key { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#5a7a9a; min-width:50px; padding-top:1px; }
        .ins-val { font-size:12px; color:#c8d8e8; line-height:1.5; }
        .ins-zone-group { display:flex; flex-direction:column; gap:6px; }
        .ins-zone-title { font-size:11px; font-weight:700; letter-spacing:0.06em; margin-bottom:2px; }
        .supply-title { color:#ff6b7a; }
        .demand-title { color:#00d4aa; }
        .ins-zone { padding:8px 10px; border-radius:7px; }
        .supply-zone { background:rgba(255,71,87,0.08); border:1px solid rgba(255,71,87,0.2); }
        .demand-zone { background:rgba(0,212,170,0.08); border:1px solid rgba(0,212,170,0.2); }
        .ins-zone-row { display:flex; justify-content:space-between; align-items:center; }
        .ins-zone-level { font-size:14px; font-weight:700; color:#e8f4ff; }
        .ins-zone-strength { font-size:10px; font-weight:700; letter-spacing:0.08em; padding:2px 7px; border-radius:4px; }
        .ins-zone-strength.strong { background:rgba(255,200,0,0.15); color:#ffc800; }
        .ins-zone-strength.moderate { background:rgba(100,180,255,0.15); color:#64b4ff; }
        .ins-zone-strength.weak { background:rgba(90,122,154,0.15); color:#5a7a9a; }
        .ins-zone-desc { font-size:11px; color:#7a9aaa; margin-top:3px; }
        .ins-setup-rows { display:flex; flex-direction:column; gap:5px; }
        .ins-setup-row { display:flex; gap:10px; align-items:flex-start; padding:7px 10px; background:#0a0f16; border-radius:6px; }
        .ins-setup-key { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#5a7a9a; min-width:44px; padding-top:1px; }
        .ins-setup-key.stop { color:#ff6b7a; }
        .ins-setup-key.target { color:#00d4aa; }
        .ins-setup-key.rr { color:#ffc800; }
        .ins-setup-val { font-size:12px; color:#c8d8e8; line-height:1.5; }
        .ins-levels-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .ins-level-card { background:#0a0f16; border-radius:8px; padding:10px 12px; }
        .ins-level-card-title { font-size:10px; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:6px; }
        .ins-level-card.resistance .ins-level-card-title { color:#ff6b7a; }
        .ins-level-card.support .ins-level-card-title { color:#00d4aa; }
        .ins-level-card.weekly-h .ins-level-card-title { color:#ffc800; }
        .ins-level-card.weekly-l .ins-level-card-title { color:#a0c4e8; }
        .ins-level-val { font-size:13px; font-weight:700; color:#e8f4ff; margin-bottom:3px; }
        .ins-level-val.large { font-size:16px; }
      `}</style>
    </div>
  )
}
