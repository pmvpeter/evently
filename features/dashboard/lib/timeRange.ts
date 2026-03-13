export const timeRangeOptions = ["30d", "12m", "ytd", "all"] as const
export type TimeRange = (typeof timeRangeOptions)[number]

export const timeRangeLabels: Record<TimeRange, string> = {
  "30d": "Last 30 days",
  "12m": "Last 12 months",
  ytd: "Year to date",
  all: "All time",
}

export type ResolvedRange = {
  from: Date | null
  to: Date
  grouping: "daily" | "monthly"
}

export function resolveTimeRange(range: TimeRange, now: Date = new Date()): ResolvedRange {
  const to = now

  switch (range) {
    case "30d":
      return {
        from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
        to,
        grouping: "daily",
      }
    case "12m":
      return {
        from: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        to,
        grouping: "monthly",
      }
    case "ytd":
      return {
        from: new Date(now.getFullYear(), 0, 1),
        to,
        grouping: "monthly",
      }
    case "all":
      return { from: null, to, grouping: "monthly" }
  }
}

export function isValidTimeRange(value: string): value is TimeRange {
  return timeRangeOptions.includes(value as TimeRange)
}
