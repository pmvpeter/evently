"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { RevenueVsCostsPoint } from "../queries/getChartData"

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--color-emerald-500)" },
  costs: { label: "Costs", color: "var(--color-red-400)" },
} satisfies ChartConfig

interface Props {
  data: RevenueVsCostsPoint[]
  isSingleBucket?: boolean
  rangeLabel?: [string, string]
}

export function RevenueVsCostsChart({ data, isSingleBucket, rangeLabel }: Props) {
  if (data.length === 0) {
    return (
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Revenue vs Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-sm text-muted-foreground">No data for this period.</p>
        </CardContent>
      </Card>
    )
  }

  // For single-bucket mode (e.g. Last 30 days), show aggregated bars with range labels
  const chartData = isSingleBucket
    ? [{ bucket: rangeLabel ? `${rangeLabel[0]} – ${rangeLabel[1]}` : "Period", ...data.reduce(
        (acc, d) => ({ revenue: acc.revenue + d.revenue, costs: acc.costs + d.costs }),
        { revenue: 0, costs: 0 },
      )}]
    : data

  const ticks = isSingleBucket && rangeLabel
    ? rangeLabel
    : undefined

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Revenue vs Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/1] w-full">
          <AreaChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bucket"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              {...(ticks ? { ticks, interval: 0 } : {})}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const revenue = Number(payload.find((p) => p.dataKey === "revenue")?.value ?? 0)
                const costs = Number(payload.find((p) => p.dataKey === "costs")?.value ?? 0)
                const profit = revenue - costs
                const fmt = (v: number) => `€${v.toLocaleString()}`
                return (
                  <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
                    <p className="mb-1.5 font-medium">{label}</p>
                    <div className="grid gap-1">
                      <div className="flex items-center justify-between gap-6">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-mono font-medium tabular-nums">{fmt(revenue)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-6">
                        <span className="text-muted-foreground">Cost</span>
                        <span className="font-mono font-medium tabular-nums">{fmt(costs)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-6 border-t border-border/50 pt-1">
                        <span className="text-muted-foreground">Gross Profit</span>
                        <span className={`font-mono font-medium tabular-nums ${profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                          {profit >= 0 ? "+" : ""}{fmt(profit)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="var(--color-revenue)"
              fillOpacity={0.15}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
            <Area
              dataKey="costs"
              type="monotone"
              fill="var(--color-costs)"
              fillOpacity={0.15}
              stroke="var(--color-costs)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
