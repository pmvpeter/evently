import { prisma } from "@/lib/db/prisma"
import type { Prisma } from "@/generated/prisma/client"
import type { ResolvedRange } from "../lib/timeRange"

function buildDateFilter(range: ResolvedRange): Prisma.EventWhereInput {
  const filter: Prisma.EventWhereInput = {}
  if (range.from || range.to) {
    filter.startDate = {}
    if (range.from) filter.startDate.gte = range.from
    if (range.to) filter.startDate.lte = range.to
  }
  return filter
}

function formatBucket(date: Date, grouping: "daily" | "monthly"): string {
  if (grouping === "daily") {
    return date.toISOString().slice(0, 10) // YYYY-MM-DD
  }
  return date.toISOString().slice(0, 7) // YYYY-MM
}

// ── Revenue vs Costs over time ──────────────────────────────────────────────

export type RevenueVsCostsPoint = {
  bucket: string
  revenue: number
  costs: number
}

export async function getRevenueVsCosts(range: ResolvedRange): Promise<RevenueVsCostsPoint[]> {
  const dateFilter = buildDateFilter(range)

  const events = await prisma.event.findMany({
    where: { ...dateFilter, revenue: { not: null } },
    select: { startDate: true, revenue: true, cost: true },
    orderBy: { startDate: "asc" },
  })

  const map = new Map<string, { revenue: number; costs: number }>()

  for (const e of events) {
    const bucket = formatBucket(e.startDate, range.grouping)
    const entry = map.get(bucket) ?? { revenue: 0, costs: 0 }
    entry.revenue += Number(e.revenue)
    entry.costs += Number(e.cost ?? 0)
    map.set(bucket, entry)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([bucket, data]) => ({ bucket, ...data }))
}

// ── Top 5 Cities by Event Count ─────────────────────────────────────────────

export type CityCount = {
  city: string
  count: number
}

export async function getTopCities(range: ResolvedRange, limit = 5): Promise<CityCount[]> {
  const dateFilter = buildDateFilter(range)

  const results = await prisma.event.groupBy({
    by: ["city"],
    where: dateFilter,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  })

  return results.map((r) => ({ city: r.city, count: r._count.id }))
}

// ── Top 10 Events by Revenue ────────────────────────────────────────────────

export type EventRevenue = {
  name: string
  revenue: number
}

export async function getTopEventsByRevenue(range: ResolvedRange, limit = 10): Promise<EventRevenue[]> {
  const dateFilter = buildDateFilter(range)

  const events = await prisma.event.findMany({
    where: { ...dateFilter, revenue: { not: null, gt: 0 } },
    select: { name: true, revenue: true },
    orderBy: { revenue: "desc" },
    take: limit,
  })

  return events.map((e) => ({ name: e.name, revenue: Number(e.revenue) }))
}

// ── Events Over Time ────────────────────────────────────────────────────────

export type EventsOverTimePoint = {
  bucket: string
  count: number
}

export async function getEventsOverTime(range: ResolvedRange): Promise<EventsOverTimePoint[]> {
  const dateFilter = buildDateFilter(range)

  const events = await prisma.event.findMany({
    where: dateFilter,
    select: { startDate: true },
    orderBy: { startDate: "asc" },
  })

  const map = new Map<string, number>()

  for (const e of events) {
    const bucket = formatBucket(e.startDate, range.grouping)
    map.set(bucket, (map.get(bucket) ?? 0) + 1)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([bucket, count]) => ({ bucket, count }))
}
