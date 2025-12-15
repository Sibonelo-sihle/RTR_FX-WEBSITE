import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react"
import { SupplyDemandChart } from "@/components/supply-demand-chart"
import { AIInsights } from "@/components/ai-insights"

export default function AnalysisPage({ params }: { params: { pair: string } }) {
  const pairName = params.pair.replace("-", "/")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-primary/20 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary flex items-center justify-center glow-effect">
              <span className="text-xl font-bold text-primary font-[family-name:var(--font-orbitron)]">RTR</span>
            </div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] text-glow">Rags to Riches</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/analysis" className="text-primary font-medium">
              Analysis
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/explore">
          <Button variant="ghost" className="mb-6 hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
          </Button>
        </Link>

        {/* Pair Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-orbitron)] text-glow">
              {pairName}
            </h1>
            <Badge className="glow-effect text-base px-4 py-1">Long Buy</Badge>
          </div>
          <div className="flex items-baseline gap-4">
            <div className="text-3xl font-bold text-primary">1.0853</div>
            <div className="flex items-center gap-1 text-primary text-xl">
              <TrendingUp className="h-5 w-5" />
              <span>+0.42%</span>
            </div>
            <span className="text-muted-foreground">Last updated: 2 mins ago</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card border-primary/20">
            <div className="text-sm text-muted-foreground mb-2">24H Change</div>
            <div className="text-2xl font-bold text-primary">+0.42%</div>
          </Card>
          <Card className="p-6 bg-card border-primary/20">
            <div className="text-sm text-muted-foreground mb-2">Weekly Performance</div>
            <div className="text-2xl font-bold text-primary">+1.8%</div>
          </Card>
          <Card className="p-6 bg-card border-primary/20">
            <div className="text-sm text-muted-foreground mb-2">Monthly Performance</div>
            <div className="text-2xl font-bold text-primary">+3.2%</div>
          </Card>
          <Card className="p-6 bg-card border-primary/20">
            <div className="text-sm text-muted-foreground mb-2">Signal Strength</div>
            <div className="text-2xl font-bold text-primary">Strong</div>
          </Card>
        </div>

        {/* Supply & Demand Chart */}
        <Card className="p-6 mb-8 bg-card border-primary/20">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">Supply & Demand Analysis</h2>
          </div>
          <SupplyDemandChart />
        </Card>

        {/* AI Insights */}
        <AIInsights pair={pairName} />

        {/* Key Levels */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 bg-card border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold font-[family-name:var(--font-orbitron)]">Demand Zones</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-primary/10">
                <span className="text-muted-foreground">Strong Zone</span>
                <span className="font-bold text-primary">1.0820 - 1.0835</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-primary/10">
                <span className="text-muted-foreground">Moderate Zone</span>
                <span className="font-bold text-primary">1.0780 - 1.0800</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-primary/10">
                <span className="text-muted-foreground">Weak Zone</span>
                <span className="font-bold text-primary">1.0740 - 1.0760</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <h3 className="text-xl font-bold font-[family-name:var(--font-orbitron)]">Supply Zones</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-destructive/10">
                <span className="text-muted-foreground">Strong Zone</span>
                <span className="font-bold text-destructive">1.0920 - 1.0940</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-destructive/10">
                <span className="text-muted-foreground">Moderate Zone</span>
                <span className="font-bold text-destructive">1.0880 - 1.0900</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-destructive/10">
                <span className="text-muted-foreground">Weak Zone</span>
                <span className="font-bold text-destructive">1.0860 - 1.0875</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Risk Warning */}
        <Card className="p-6 mt-8 bg-card border-primary/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-bold mb-2">Risk Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                Trading forex and indices carries a high level of risk and may not be suitable for all investors. The
                analysis provided is for informational purposes only and should not be considered as financial advice.
                Always conduct your own research and consult with a financial advisor before making investment
                decisions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
