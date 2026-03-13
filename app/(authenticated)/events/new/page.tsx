import { CreateEventForm } from "./CreateEventForm"

export default function NewEventPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create Event</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details to create a new event.
        </p>
      </div>
      <div className="max-w-3xl">
        <CreateEventForm />
      </div>
    </div>
  )
}
