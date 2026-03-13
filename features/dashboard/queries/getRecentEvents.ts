import { prisma } from "@/lib/db/prisma"

export async function getRecentEvents(limit = 5) {
  const now = new Date()

  return prisma.event.findMany({
    where: {
      status: "confirmed",
      endDate: { lt: now },
    },
    orderBy: { startDate: "desc" },
    take: limit,
  })
}
