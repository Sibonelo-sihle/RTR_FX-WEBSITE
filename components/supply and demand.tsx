"use client"

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from "recharts"

const data = [
  { time: "09:00", price: 1.083, demand: 1.082, supply: 1.089 },
  { time: "10:00", price: 1.0835, demand: 1.082, supply: 1.089 },
  { time: "11:00", price: 1.0845, demand: 1.082, supply: 1.089 },
  { time: "12:00", price: 1.084, demand: 1.082, supply: 1.089 },
  { time: "13:00", price: 1.085, demand: 1.082, supply: 1.089 },
  { time: "14:00", price: 1.0855, demand: 1.082, supply: 1.089 },
  { time: "15:00", price: 1.0848, demand: 1.082, supply: 1.089 },
  { time: "16:00", price: 1.0853, demand: 1.082, supply: 1.089 },
]

export function SupplyDemandChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.72 0.21 165)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.72 0.21 165)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.62 0.24 30)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.62 0.24 30)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.04 155)" opacity={0.3} />
          <XAxis dataKey="time" stroke="oklch(0.65 0.08 165)" style={{ fontSize: "12px" }} />
          <YAxis
            domain={[1.08, 1.091]}
            stroke="oklch(0.65 0.08 165)"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.16 0.03 150)",
              border: "1px solid oklch(0.26 0.04 155)",
              borderRadius: "8px",
              color: "oklch(0.98 0 0)",
            }}
            formatter={(value: number) => value.toFixed(4)}
          />
          <Area type="monotone" dataKey="demand" stroke="none" fill="url(#demandGradient)" />
          <Area type="monotone" dataKey="supply" stroke="none" fill="url(#supplyGradient)" />
          <Line
            type="monotone"
            dataKey="price"
            stroke="oklch(0.72 0.21 165)"
            strokeWidth={3}
            dot={{ fill: "oklch(0.72 0.21 165)", r: 4 }}
            activeDot={{ r: 6, fill: "oklch(0.82 0.18 160)" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary"></div>
          <span className="text-sm text-muted-foreground">Current Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/30"></div>
          <span className="text-sm text-muted-foreground">Demand Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/30"></div>
          <span className="text-sm text-muted-foreground">Supply Zone</span>
        </div>
      </div>
    </div>
  )
}
