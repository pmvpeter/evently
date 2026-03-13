import Link from "next/link"
import type { Event } from "@/generated/prisma/client"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Calendar, Plus } from "lucide-react"
import { getDisplayStatus, displayStatusStyles, formatDisplayStatus } from "../lib/displayStatus"

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function EventsTable({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium">No events yet</p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Get started by creating your first event.
        </p>
        <Button className="mt-5" nativeButton={false} render={<Link href="/events/new" />}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create Event
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Dates</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Attendees</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Gross Profit</th>
            <th className="w-20 px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {events.map((event) => (
            <tr key={event.id} className="transition-colors hover:bg-muted/40">
              <td className="px-4 py-3.5">
                <Link href={`/events/${event.id}`} className="font-medium hover:underline">
                  {event.name}
                </Link>
              </td>
              <td className="px-4 py-3.5 text-muted-foreground">
                {event.city}, {event.country}
              </td>
              <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                {formatDate(event.startDate)} – {formatDate(event.endDate)}
              </td>
              <td className="px-4 py-3.5">
                {(() => {
                  const ds = getDisplayStatus(event.status, event.startDate, event.endDate)
                  return (
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${displayStatusStyles[ds]}`}>
                      {formatDisplayStatus(ds)}
                    </span>
                  )
                })()}
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">
                {event.attendees.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums">
                {event.cost && event.revenue ? (() => {
                  const profit = Number(event.revenue) - Number(event.cost)
                  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: event.currency }).format(profit)
                  return (
                    <span className={profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                      {profit >= 0 ? "+" : ""}{formatted}
                    </span>
                  )
                })() : <span className="text-muted-foreground">—</span>}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-0.5">
                  <Button variant="ghost" size="icon-xs" nativeButton={false} render={<Link href={`/events/${event.id}`} />}>
                    <Eye />
                  </Button>
                  <Button variant="ghost" size="icon-xs" nativeButton={false} render={<Link href={`/events/${event.id}/edit`} />}>
                    <Pencil />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
