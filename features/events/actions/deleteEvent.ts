"use server"

import { requireUser } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"

export async function deleteEvent(id: string) {
  await requireUser()

  try {
    await prisma.event.delete({
      where: { id },
    })
  } catch {
    return { success: false as const, error: "Failed to delete event" }
  }

  redirect("/events")
}
