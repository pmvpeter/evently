import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getEvents } from "@/features/events/queries/getEvents"
import { EventsTable } from "@/features/events/components/EventsTable"

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track all your events.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/events/new" />}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Event
        </Button>
      </div>
      <EventsTable events={events} />
    </div>
  )
}
