import { getDashboardMetrics } from "@/features/dashboard/queries/getDashboardMetrics"
import { getRecentEvents } from "@/features/dashboard/queries/getRecentEvents"
import { getUpcomingEvents } from "@/features/dashboard/queries/getUpcomingEvents"
import { getOngoingEvents } from "@/features/dashboard/queries/getOngoingEvents"
import {
  getRevenueVsCosts,
  getTopCities,
  getTopEventsByRevenue,
  getEventsOverTime,
} from "@/features/dashboard/queries/getChartData"
import { MetricCard } from "@/features/dashboard/components/MetricCard"
import { EventListWidget } from "@/features/dashboard/components/EventListWidget"
import { TimeRangeFilter } from "@/features/dashboard/components/TimeRangeFilter"
import { RevenueVsCostsChart } from "@/features/dashboard/components/RevenueVsCostsChart"
import { TopCitiesChart } from "@/features/dashboard/components/TopCitiesChart"
import { TopEventsRevenueChart } from "@/features/dashboard/components/TopEventsRevenueChart"
import { EventsOverTimeChart } from "@/features/dashboard/components/EventsOverTimeChart"
import { Separator } from "@/components/ui/separator"
import { isValidTimeRange, resolveTimeRange, type TimeRange } from "@/features/dashboard/lib/timeRange"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const rangeParam = typeof params.range === "string" ? params.range : "12m"
  const range: TimeRange = isValidTimeRange(rangeParam) ? rangeParam : "12m"
  const resolved = resolveTimeRange(range)
  const { from, to } = resolved
  const isSingleBucket = range === "30d"
  const formatLabel = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  const rangeLabel: [string, string] | undefined = from ? [formatLabel(from), formatLabel(to)] : undefined

  const [
    metrics,
    revenueVsCosts,
    topCities,
    topEvents,
    eventsOverTime,
    recentEvents,
    upcomingEvents,
    ongoingEvents,
  ] = await Promise.all([
    getDashboardMetrics({ from, to }),
    getRevenueVsCosts(resolved),
    getTopCities(resolved),
    getTopEventsByRevenue(resolved),
    getEventsOverTime(resolved),
    getRecentEvents(),
    getUpcomingEvents(),
    getOngoingEvents(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Home</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of revenue, events, and activity.</p>
        </div>
        <TimeRangeFilter value={range} />
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard title="Revenue" value={metrics.totalRevenue} format="currency" />
        <MetricCard title="Costs" value={metrics.totalCost} format="currency" />
        <MetricCard title="Gross Profit" value={metrics.grossProfit} format="currency" colorize />
        <MetricCard title="Events" value={metrics.totalEvents} />
        <MetricCard title="Total Attendees" value={metrics.totalAttendees} />
      </div>

      {/* Revenue vs Costs — full width */}
      <RevenueVsCostsChart data={revenueVsCosts} isSingleBucket={isSingleBucket} rangeLabel={rangeLabel} />

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <TopCitiesChart data={topCities} />
        <TopEventsRevenueChart data={topEvents} />
        <EventsOverTimeChart data={eventsOverTime} isSingleBucket={isSingleBucket} rangeLabel={rangeLabel} />
      </div>

      <Separator />

      {/* Ongoing & upcoming */}
      <div className="grid gap-4 lg:grid-cols-2">
        <EventListWidget
          title="Ongoing Events"
          events={ongoingEvents}
          emptyMessage="No events happening right now."
        />
        <EventListWidget
          title="Upcoming Events"
          events={upcomingEvents}
          emptyMessage="No upcoming events scheduled."
        />
      </div>

      {/* Recent events — full width */}
      <EventListWidget
        title="Recent Events"
        events={recentEvents}
        emptyMessage="No past events yet."
      />
    </div>
  )
}
