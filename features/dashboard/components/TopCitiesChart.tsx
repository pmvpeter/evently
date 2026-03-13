"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { CityCount } from "../queries/getChartData"

const chartConfig = {
  count: { label: "Events", color: "var(--color-blue-500)" },
} satisfies ChartConfig

export function TopCitiesChart({ data }: { data: CityCount[] }) {
  if (data.length === 0) {
    return (
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Top 5 Cities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-sm text-muted-foreground">No data for this period.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Top 5 Cities</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
          <BarChart data={data} layout="vertical" accessibilityLayer>
            <YAxis
              dataKey="city"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={100}
            />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
