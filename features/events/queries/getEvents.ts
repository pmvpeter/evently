import { prisma } from "@/lib/db/prisma"

export async function getEvents() {
  return prisma.event.findMany({
    orderBy: { startDate: "desc" },
  })
}
