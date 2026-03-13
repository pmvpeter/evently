import { notFound } from "next/navigation"
import { getEvent } from "@/features/events/queries/getEvent"
import { EditEventForm } from "./EditEventForm"
import { SetPageTitle } from "@/components/layout/SetPageTitle"

export default async function EditEventPage({
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
        <h1 className="text-3xl font-semibold tracking-tight">Edit Event</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the details for {event.name}.
        </p>
      </div>
      <div className="max-w-3xl">
        <EditEventForm
          id={event.id}
          defaultValues={{
            name: event.name,
            description: event.description ?? undefined,
            location: event.location,
            country: event.country,
            city: event.city,
            venueName: event.venueName ?? undefined,
            startDate: event.startDate,
            endDate: event.endDate,
            status: event.status,
            attendees: event.attendees,
            capacity: event.capacity ?? undefined,
            cost: event.cost ? Number(event.cost) : undefined,
            revenue: event.revenue ? Number(event.revenue) : undefined,
            currency: event.currency,
            category: event.category ?? undefined,
            notes: event.notes ?? undefined,
          }}
        />
      </div>
    </div>
  )
}
