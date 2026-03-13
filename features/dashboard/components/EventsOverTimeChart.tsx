"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { EventsOverTimePoint } from "../queries/getChartData"

const chartConfig = {
  count: { label: "Events", color: "var(--color-violet-500)" },
} satisfies ChartConfig

interface Props {
  data: EventsOverTimePoint[]
  isSingleBucket?: boolean
  rangeLabel?: [string, string]
}

export function EventsOverTimeChart({ data, isSingleBucket, rangeLabel }: Props) {
  if (data.length === 0) {
    return (
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Events Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-sm text-muted-foreground">No data for this period.</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = isSingleBucket
    ? [{ bucket: rangeLabel ? `${rangeLabel[0]} – ${rangeLabel[1]}` : "Period", count: data.reduce((sum, d) => sum + d.count, 0) }]
    : data

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Events Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
          <LineChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="bucket" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-count)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
