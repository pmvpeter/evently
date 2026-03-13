import { prisma } from "@/lib/db/prisma"

export async function getOngoingEvents(limit = 5) {
  const now = new Date()

  return prisma.event.findMany({
    where: {
      status: "confirmed",
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { startDate: "asc" },
    take: limit,
  })
}
