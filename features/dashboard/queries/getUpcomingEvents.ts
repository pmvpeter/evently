import { prisma } from "@/lib/db/prisma"

export async function getUpcomingEvents(limit = 5) {
  const now = new Date()

  return prisma.event.findMany({
    where: {
      status: "confirmed",
      startDate: { gt: now },
    },
    orderBy: { startDate: "asc" },
    take: limit,
  })
}
