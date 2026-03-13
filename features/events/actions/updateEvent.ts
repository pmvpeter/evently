"use server"

import { requireUser } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { updateEventSchema, type UpdateEventInput } from "../schemas/eventSchemas"
import { redirect } from "next/navigation"

export async function updateEvent(id: string, data: UpdateEventInput) {
  await requireUser()

  const parsed = updateEventSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message }
  }

  await prisma.event.update({
    where: { id },
    data: {
      ...parsed.data,
      cost: parsed.data.cost ?? null,
      revenue: parsed.data.revenue ?? null,
    },
  })

  redirect(`/events/${id}`)
}
