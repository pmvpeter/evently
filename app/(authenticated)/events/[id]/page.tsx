import Link from "next/link"
import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEvent } from "@/features/events/queries/getEvent"
import { DeleteEventButton } from "@/features/events/components/DeleteEventButton"
import { SetPageTitle } from "@/components/layout/SetPageTitle"
import { getDisplayStatus, displayStatusStyles, formatDisplayStatus } from "@/features/events/lib/displayStatus"

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "") return null
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-border/50 last:border-0">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) notFound()

  return (
    <div className="space-y-8">
      <SetPageTitle title={event.name} />
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">{event.name}</h1>
            {(() => {
              const ds = getDisplayStatus(event.status, event.startDate, event.endDate)
              return (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${displayStatusStyles[ds]}`}>
                  {formatDisplayStatus(ds)}
                </span>
              )
            })()}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/events/${event.id}/edit`} />}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            <DeleteEventButton eventId={event.id} />
          </div>
        </div>
        {event.description && (
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground max-w-2xl">{event.description}</p>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-[13px] font-medium text-muted-foreground">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="text-sm">
              <DetailRow label="Category" value={event.category} />
              <DetailRow label="Start" value={formatDate(event.startDate)} />
              <DetailRow label="End" value={formatDate(event.endDate)} />
            </dl>
          </CardContent>
        </Card>

        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-[13px] font-medium text-muted-foreground">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="text-sm">
              <DetailRow label="Country" value={event.country} />
              <DetailRow label="City" value={event.city} />
              <DetailRow label="Address" value={event.location} />
              <DetailRow label="Venue" value={event.venueName} />
            </dl>
          </CardContent>
        </Card>

        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-[13px] font-medium text-muted-foreground">Capacity & Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="text-sm">
              <DetailRow label="Attendees" value={event.attendees.toLocaleString()} />
              <DetailRow label="Capacity" value={event.capacity?.toLocaleString()} />
              <DetailRow
                label="Cost"
                value={event.cost ? formatCurrency(Number(event.cost), event.currency) : null}
              />
              <DetailRow
                label="Revenue"
                value={event.revenue ? formatCurrency(Number(event.revenue), event.currency) : null}
              />
              {event.cost && event.revenue ? (() => {
                const profit = Number(event.revenue) - Number(event.cost)
                return (
                  <DetailRow
                    label="Gross Profit"
                    value={
                      <span className={profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                        {profit >= 0 ? "+" : ""}{formatCurrency(profit, event.currency)}
                      </span>
                    }
                  />
                )
              })() : null}
              <DetailRow label="Currency" value={event.currency} />
            </dl>
          </CardContent>
        </Card>

        {event.notes && (
          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle className="text-[13px] font-medium text-muted-foreground">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{event.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
