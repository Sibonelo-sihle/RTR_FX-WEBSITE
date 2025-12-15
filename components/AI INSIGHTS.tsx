import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Clock, Target } from "lucide-react"

interface AIInsightsProps {
  pair: string
}

export function AIInsights({ pair }: AIInsightsProps) {
  return (
    <Card className="p-6 bg-card border-primary/20">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">AI-Powered Insights</h2>
        <Badge className="glow-effect ml-2">Live Analysis</Badge>
      </div>

      <div className="space-y-6">
        {/* Market Outlook */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Market Outlook
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Based on supply and demand analysis, {pair} is showing strong bullish momentum. Price action has respected
            the demand zone at 1.0820-1.0835, indicating strong buying interest. The current trend suggests continuation
            towards the next supply zone at 1.0920-1.0940.
          </p>
        </div>

        {/* Trading Recommendation */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Trading Recommendation
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Signal</div>
              <Badge className="glow-effect">Long Buy</Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Entry Zone</div>
                <div className="font-bold text-primary">1.0835 - 1.0845</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Target</div>
                <div className="font-bold text-primary">1.0920</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Stop Loss</div>
                <div className="font-bold text-destructive">1.0810</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Risk/Reward Ratio</div>
              <div className="font-bold text-primary">1:3.2</div>
            </div>
          </div>
        </div>

        {/* Time Frame Analysis */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Time Frame Analysis
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
              <div className="text-sm text-muted-foreground mb-2">Short-Term (1-7 Days)</div>
              <div className="flex items-center gap-2">
                <Badge className="glow-effect">Long Buy</Badge>
                <span className="text-sm text-muted-foreground">Strong upward momentum</span>
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
              <div className="text-sm text-muted-foreground mb-2">Long-Term (1-4 Weeks)</div>
              <div className="flex items-center gap-2">
                <Badge className="glow-effect">Long Buy</Badge>
                <span className="text-sm text-muted-foreground">Bullish trend continuation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Factors */}
        <div>
          <h3 className="text-lg font-bold mb-3">Key Factors</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Strong demand zone support at 1.0820-1.0835 creating bullish foundation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Consistent higher lows indicating sustained buying pressure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Volume analysis confirms institutional interest at current levels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Next major supply zone at 1.0920-1.0940 provides clear profit target</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
