import { prisma } from "@/lib/db/prisma"
import type { Prisma } from "@/generated/prisma/client"

interface MetricsOptions {
  from?: Date | null
  to?: Date
}

export async function getDashboardMetrics({ from, to }: MetricsOptions = {}) {
  const dateFilter: Prisma.EventWhereInput = {}
  if (from || to) {
    dateFilter.startDate = {}
    if (from) dateFilter.startDate.gte = from
    if (to) dateFilter.startDate.lte = to
  }

  const [totalEvents, attendeesAgg, financials] = await Promise.all([
    prisma.event.count({ where: dateFilter }),
    prisma.event.aggregate({ where: dateFilter, _sum: { attendees: true } }),
    prisma.event.aggregate({
      where: { ...dateFilter, revenue: { not: null } },
      _sum: { cost: true, revenue: true },
    }),
  ])

  const totalRevenue = Number(financials._sum.revenue ?? 0)
  const totalCost = Number(financials._sum.cost ?? 0)

  return {
    totalEvents,
    totalAttendees: attendeesAgg._sum.attendees ?? 0,
    totalRevenue,
    totalCost,
    grossProfit: totalRevenue - totalCost,
  }
}
