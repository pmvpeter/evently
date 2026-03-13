"use client"

import { EventForm } from "@/features/events/components/EventForm"
import { createEvent } from "@/features/events/actions/createEvent"
import type { CreateEventInput } from "@/features/events/schemas/eventSchemas"

export function CreateEventForm() {
  async function handleSubmit(data: CreateEventInput) {
    return await createEvent(data)
  }

  return <EventForm onSubmit={handleSubmit} />
}
