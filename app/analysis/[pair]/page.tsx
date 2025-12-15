import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, BarChart3, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-primary/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary flex items-center justify-center glow-effect">
              <span className="text-xl font-bold text-primary font-[family-name:var(--font-orbitron)]">RTR</span>
            </div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] text-glow">Rags to Riches</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/analysis" className="text-muted-foreground hover:text-primary transition-colors">
              Analysis
            </Link>
            <Button className="glow-effect">Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium mb-4">
            Supply & Demand Trading Analysis
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-orbitron)] leading-tight text-balance">
            Transform Your <span className="text-primary text-glow">Forex Trading</span> Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get real-time insights on forex and indices pairs with advanced supply and demand analysis. Make informed
            decisions with weekly and monthly performance stats.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/explore">
              <Button size="lg" className="glow-effect text-lg">
                Explore Pairs <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/analysis">
              <Button size="lg" variant="outline" className="border-primary/40 text-lg bg-transparent">
                View Analysis
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 glow-effect">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">Real-Time Insights</h3>
            <p className="text-muted-foreground">
              Get up-to-date market analysis with weekly and monthly performance statistics for all major pairs.
            </p>
          </div>

          <div className="bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 glow-effect">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">Supply & Demand</h3>
            <p className="text-muted-foreground">
              Advanced analysis based on supply and demand zones to identify optimal entry and exit points.
            </p>
          </div>

          <div className="bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 glow-effect">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-orbitron)]">Trading Signals</h3>
            <p className="text-muted-foreground">
              Receive clear short-term sell and long-term buy recommendations powered by AI analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary text-glow mb-2 font-[family-name:var(--font-orbitron)]">
                50+
              </div>
              <div className="text-muted-foreground">Forex Pairs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary text-glow mb-2 font-[family-name:var(--font-orbitron)]">
                24/7
              </div>
              <div className="text-muted-foreground">Live Updates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary text-glow mb-2 font-[family-name:var(--font-orbitron)]">
                Real-Time
              </div>
              <div className="text-muted-foreground">Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary text-glow mb-2 font-[family-name:var(--font-orbitron)]">
                AI-Powered
              </div>
              <div className="text-muted-foreground">Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary font-[family-name:var(--font-orbitron)]">RTR</span>
              </div>
              <span className="text-sm text-muted-foreground">© 2025 Rags to Riches</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
