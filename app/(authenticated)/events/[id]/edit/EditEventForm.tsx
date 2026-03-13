"use client"

import { EventForm } from "@/features/events/components/EventForm"
import { updateEvent } from "@/features/events/actions/updateEvent"
import type { CreateEventInput } from "@/features/events/schemas/eventSchemas"

export function EditEventForm({
  id,
  defaultValues,
}: {
  id: string
  defaultValues: Partial<CreateEventInput>
}) {
  async function handleSubmit(data: CreateEventInput) {
    return await updateEvent(id, data)
  }

  return <EventForm defaultValues={defaultValues} onSubmit={handleSubmit} />
}
