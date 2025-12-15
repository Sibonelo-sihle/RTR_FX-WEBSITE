const forexPairs = [
    {
        pair: "EUR/USD",
        price: "1.0853",
        change: "+0.42%",
        weeklyPerf: "+1.8%",
        monthlyPerf: "+3.2%",
        signal: "Long Buy",
        Strength: "Strong",
        isPositive: true, 
    },

    {
        pair: "GBP/USD",
        price: "1.2641",
        change: "-0.18%",
        weeklyPerf: "-0.5%",
        monthlyPerf: "+1.1%",
        signal: "short sell",
        strength: "moderate",
        isPositive: false,
    },

    {
        pair:"USD/JPY",
        price: "149.82",
        change:"+0.65%",
        weeklyPerf: "+2.3%",
        monthlyPerf: "+4.7%",
        signal: "long  Buy",
        strength: "strong",
        isPositive: true,
    },

    {
        pair: "AUD/USD",
        price: "0.6512",
        change: "+0.28%",
        weeklyPerf: "+0.9%",
        monthlyPerf: "+2.1%",
        signal: "Long Buy",
        strength: "Moderate",
        isPositive: true,
      },
      {
        pair: "USD/CAD",
        price: "1.3845",
        change: "-0.35%",
        weeklyPerf: "-1.2%",
        monthlyPerf: "-0.8%",
        signal: "Short Sell",
        strength: "Moderate",
        isPositive: false,
      },
      {
        pair: "NZD/USD",
        price: "0.5892",
        change: "+0.51%",
        weeklyPerf: "+1.5%",
        monthlyPerf: "+2.8%",
        signal: "Long Buy",
        strength: "Strong",
        isPositive: true,
      },
    ]
    
    const indices = [
      {
        pair: "S&P 500",
        price: "4,783.45",
        change: "+1.25%",
        weeklyPerf: "+3.2%",
        monthlyPerf: "+8.5%",
        signal: "Long Buy",
        strength: "Strong",
        isPositive: true,
      },
      {
        pair: "NASDAQ",
        price: "15,011.35",
        change: "+1.58%",
        weeklyPerf: "+4.1%",
        monthlyPerf: "+10.2%",
        signal: "Long Buy",
        strength: "Very Strong",
        isPositive: true,
      },
      {
        pair: "DOW JONES",
        price: "37,305.16",
        change: "+0.82%",
        weeklyPerf: "+2.5%",
        monthlyPerf: "+6.8%",
        signal: "Long Buy",
        strength: "Strong",
        isPositive: true,
      },
      {
        pair: "FTSE 100",
        price: "7,512.45",
        change: "-0.25%",
        weeklyPerf: "+0.8%",
        monthlyPerf: "+2.3%",
        signal: "Short Sell",
        strength: "Weak",
        isPositive: false,
      },
    ]
    
    function createPairCard(item) {
      const changeIcon = item.isPositive ? "↗" : "↘"
      const changeClass = item.isPositive ? "positive" : "negative"
      const signalClass = item.signal === "Long Buy" ? "buy" : "sell"
      const pairUrl = item.pair.replace(/[\s/]+/g, "-").toLowerCase()
    
      return `
            <a href="analysis.html?pair=${pairUrl}" class="pair-card">
                <div class="pair-header">
                    <div>
                        <div class="pair-name">${item.pair}</div>
                        <div class="pair-price">${item.price}</div>
                    </div>
                    <div class="pair-change ${changeClass}">
                        <span>${changeIcon}</span>
                        <span>${item.change}</span>
                    </div>
                </div>
                
                <div class="pair-stats">
                    <div class="pair-stat">
                        <div class="pair-stat-label">Weekly</div>
                        <div class="pair-stat-value ${item.weeklyPerf.startsWith("+") ? "positive" : "negative"}">${item.weeklyPerf}</div>
                    </div>
                    <div class="pair-stat">
                        <div class="pair-stat-label">Monthly</div>
                        <div class="pair-stat-value ${item.monthlyPerf.startsWith("+") ? "positive" : "negative"}">${item.monthlyPerf}</div>
                    </div>
                </div>
                
                <div class="pair-footer">
                    <span class="signal-badge ${signalClass} ${signalClass === "buy" ? "glow-effect" : ""}">${item.signal}</span>
                    <span class="pair-strength">${item.strength}</span>
                </div>
            </a>
        `
    }
    
    function loadPairs() {
      const forexGrid = document.getElementById("forexPairsGrid")
      const indicesGrid = document.getElementById("indicesGrid")
    
      forexGrid.innerHTML = forexPairs.map(createPairCard).join("")
      indicesGrid.innerHTML = indices.map(createPairCard).join("")
    }
    
    // Load pairs when page loads
    document.addEventListener("DOMContentLoaded", loadPairs)
    
S