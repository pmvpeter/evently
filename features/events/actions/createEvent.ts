"use server"

import { requireUser } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { createEventSchema, type CreateEventInput } from "../schemas/eventSchemas"
import { redirect } from "next/navigation"

export async function createEvent(data: CreateEventInput) {
  await requireUser()

  const parsed = createEventSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message }
  }

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      cost: parsed.data.cost ?? null,
      revenue: parsed.data.revenue ?? null,
    },
  })

  redirect(`/events/${event.id}`)
}
