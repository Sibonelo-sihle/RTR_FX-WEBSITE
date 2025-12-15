const urlParams = new URLSearchParams(window.location.search)
const pairParam = urlParams.get("pair") || "eur-usd"
const pairName = pairParam.replace(/-/g, "/").toUpperCase()

const supplyDemandData = {
  H4: {
    demandZones: [
      { label: "Strong Zone", range: "1.0820 - 1.0835", strength: "Strong" },
      { label: "Moderate Zone", range: "1.0780 - 1.0800", strength: "Moderate" },
      { label: "Weak Zone", range: "1.0740 - 1.0760", strength: "Weak" },
    ],
    supplyZones: [
      { label: "Strong Zone", range: "1.0920 - 1.0940", strength: "Strong" },
      { label: "Moderate Zone", range: "1.0880 - 1.0900", strength: "Moderate" },
      { label: "Weak Zone", range: "1.0860 - 1.0875", strength: "Weak" },
    ],
    insights: [
      {
        title: "Current Market Position (H4)",
        text: "Price is currently trading within a strong demand zone at 1.0820-1.0835 on the H4 timeframe. This level has shown significant buying pressure in the past 3 weeks, with multiple rejections and bounce patterns.",
      },
      {
        title: "H4 Trend Analysis",
        text: "The H4 chart shows a clear uptrend with higher highs and higher lows. The recent pullback to the demand zone presents a potential long entry opportunity with favorable risk-reward ratio.",
      },
      {
        title: "H4 Recommendation: LONG BUY",
        text: "Strong buy signal based on H4 supply and demand analysis. Entry: 1.0825-1.0835, Stop Loss: 1.0760, Take Profit: 1.0920. Risk/Reward Ratio: 1:3. Expected holding period: 3-7 days for swing traders.",
      },
    ],
  },
  "15min": {
    demandZones: [
      { label: "Strong Zone", range: "1.0840 - 1.0848", strength: "Strong" },
      { label: "Moderate Zone", range: "1.0825 - 1.0835", strength: "Moderate" },
      { label: "Weak Zone", range: "1.0810 - 1.0820", strength: "Weak" },
    ],
    supplyZones: [
      { label: "Strong Zone", range: "1.0875 - 1.0885", strength: "Strong" },
      { label: "Moderate Zone", range: "1.0865 - 1.0872", strength: "Moderate" },
      { label: "Weak Zone", range: "1.0855 - 1.0862", strength: "Weak" },
    ],
    insights: [
      {
        title: "Intraday Position (15min)",
        text: "On the 15-minute timeframe, price action shows strong momentum above the 1.0840-1.0848 demand zone. Short-term scalping opportunities exist with quick entries and exits near these key levels.",
      },
      {
        title: "15min Momentum Analysis",
        text: "The 15min chart indicates bullish momentum with price consolidating above support. Volume analysis suggests accumulation phase, ideal for quick scalp trades targeting the next supply zone at 1.0865-1.0872.",
      },
      {
        title: "15min Recommendation: SHORT-TERM BUY",
        text: "Short-term buy opportunity for scalpers and day traders. Entry: 1.0845-1.0850, Stop Loss: 1.0835, Take Profit: 1.0870. Risk/Reward Ratio: 1:2. Expected holding period: 1-4 hours for quick profits.",
      },
    ],
  },
}

let currentTimeframe = "H4"

function initializePage() {
  document.getElementById("pairName").textContent = pairName
  updateTimeframeData("H4")
  drawChart("H4")
}

function updateZones(timeframe) {
  const data = supplyDemandData[timeframe]
  const demandZonesEl = document.getElementById("demandZones")
  const supplyZonesEl = document.getElementById("supplyZones")

  demandZonesEl.innerHTML = data.demandZones
    .map(
      (zone) => `
        <div class="level-item demand">
            <span class="level-label">${zone.label}</span>
            <span class="level-value demand">${zone.range}</span>
        </div>
    `,
    )
    .join("")

  supplyZonesEl.innerHTML = data.supplyZones
    .map(
      (zone) => `
        <div class="level-item supply">
            <span class="level-label">${zone.label}</span>
            <span class="level-value supply">${zone.range}</span>
        </div>
    `,
    )
    .join("")
}

function updateInsights(timeframe) {
  const data = supplyDemandData[timeframe]
  const insightsEl = document.getElementById("insightsContent")

  insightsEl.innerHTML = data.insights
    .map(
      (insight) => `
        <div class="insight-item">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `,
    )
    .join("")
}

function updateTimeframeData(timeframe) {
  currentTimeframe = timeframe
  document.getElementById("currentTimeframe").textContent = timeframe
  updateZones(timeframe)
  updateInsights(timeframe)
}

function drawChart(timeframe) {
  const canvas = document.getElementById("supplyDemandChart")
  const ctx = canvas.getContext("2d")

  // Set canvas size
  canvas.width = canvas.offsetWidth
  canvas.height = 400

  const width = canvas.width
  const height = canvas.height

  // Clear canvas
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
  ctx.fillRect(0, 0, width, height)

  // Draw grid
  ctx.strokeStyle = "rgba(0, 255, 136, 0.1)"
  ctx.lineWidth = 1

  for (let i = 0; i < 10; i++) {
    const y = (height / 10) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Draw supply zones (red/destructive)
  ctx.fillStyle = "rgba(255, 68, 68, 0.2)"
  ctx.fillRect(0, 60, width, 40) // Strong
  ctx.fillRect(0, 110, width, 35) // Moderate
  ctx.fillRect(0, 155, width, 30) // Weak

  // Draw demand zones (green/primary)
  ctx.fillStyle = "rgba(0, 255, 136, 0.2)"
  ctx.fillRect(0, 280, width, 30) // Weak
  ctx.fillRect(0, 320, width, 35) // Moderate
  ctx.fillRect(0, 365, width, 35) // Strong

  // Draw price line
  ctx.strokeStyle = "#00ff88"
  ctx.lineWidth = 2
  ctx.beginPath()

  const points = timeframe === "H4" ? 50 : 100
  const basePrice = 200
  let lastY = basePrice

  for (let i = 0; i <= points; i++) {
    const x = (width / points) * i
    const volatility = timeframe === "H4" ? 30 : 15
    const change = (Math.random() - 0.5) * volatility
    lastY = Math.max(50, Math.min(350, lastY + change))

    if (i === 0) {
      ctx.moveTo(x, lastY)
    } else {
      ctx.lineTo(x, lastY)
    }
  }

  ctx.stroke()

  // Draw current price marker
  ctx.fillStyle = "#00ff88"
  ctx.beginPath()
  ctx.arc(width - 20, lastY, 5, 0, Math.PI * 2)
  ctx.fill()

  // Add labels
  ctx.fillStyle = "#9ca3af"
  ctx.font = "12px monospace"
  ctx.fillText(`${timeframe} Timeframe`, 10, 20)
  ctx.fillText("Supply Zones ↑", 10, 80)
  ctx.fillText("Demand Zones ↓", 10, 300)
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage()

  const timeframeButtons = document.querySelectorAll(".timeframe-btn")
  timeframeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      timeframeButtons.forEach((b) => b.classList.remove("active"))
      // Add active class to clicked button
      btn.classList.add("active")

      // Get timeframe and update data
      const timeframe = btn.dataset.timeframe
      updateTimeframeData(timeframe)
      drawChart(timeframe)
    })
  })

  // Redraw chart on window resize
  window.addEventListener("resize", () => {
    drawChart(currentTimeframe)
  })
})
