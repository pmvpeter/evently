import Link from "next/link"
import type { Event } from "@/generated/prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { getDisplayStatus, displayStatusStyles, formatDisplayStatus } from "@/features/events/lib/displayStatus"

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

interface EventListWidgetProps {
  title: string
  events: Event[]
  emptyMessage: string
}

export function EventListWidget({ title, events, emptyMessage }: EventListWidgetProps) {
  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-muted/40 -mx-4 px-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{event.name}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {event.city}, {event.country} · {formatDate(event.startDate)}
                  </p>
                </div>
                {(() => {
                  const ds = getDisplayStatus(event.status, event.startDate, event.endDate)
                  return (
                    <span className={`shrink-0 inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${displayStatusStyles[ds]}`}>
                      {formatDisplayStatus(ds)}
                    </span>
                  )
                })()}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
