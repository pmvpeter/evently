import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: number | string
  format?: "number" | "currency"
  colorize?: boolean
}

export function MetricCard({ title, value, format = "number", colorize = false }: MetricCardProps) {
  const formatted =
    typeof value === "string"
      ? value
      : format === "currency"
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
        : value.toLocaleString()

  const colorClass =
    colorize && typeof value === "number"
      ? value >= 0
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400"
      : ""

  return (
    <Card className="bg-transparent">
      <CardContent className="pt-1">
        <p className={`text-3xl font-semibold tracking-tight tabular-nums ${colorClass}`}>
          {formatted}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  )
}
