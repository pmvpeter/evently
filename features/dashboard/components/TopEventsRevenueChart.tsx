"use client"

import { Pie, PieChart, Label } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { EventRevenue } from "../queries/getChartData"

const COLORS = [
  "var(--color-blue-500)",
  "var(--color-emerald-500)",
  "var(--color-amber-500)",
  "var(--color-red-400)",
  "var(--color-purple-500)",
  "var(--color-cyan-500)",
  "var(--color-pink-500)",
  "var(--color-orange-500)",
  "var(--color-teal-500)",
  "var(--color-indigo-500)",
]

export function TopEventsRevenueChart({ data }: { data: EventRevenue[] }) {
  const totalRevenue = data.reduce((sum, e) => sum + e.revenue, 0)

  if (data.length === 0) {
    return (
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Top 10 Events by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-sm text-muted-foreground">No data for this period.</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((e, i) => ({
    name: e.name,
    revenue: e.revenue,
    fill: COLORS[i % COLORS.length],
  }))

  const chartConfig = Object.fromEntries(
    data.map((e, i) => [
      e.name,
      { label: e.name, color: COLORS[i % COLORS.length] },
    ]),
  ) satisfies ChartConfig

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Top 10 Events by Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
          <PieChart accessibilityLayer>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="name"
                  labelKey="name"
                  formatter={(value) => `€${Number(value).toLocaleString()}`}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="name"
              innerRadius="55%"
              outerRadius="80%"
              strokeWidth={2}
              stroke="var(--color-background)"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          €{(totalRevenue / 1000).toFixed(0)}k
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                          Revenue
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
