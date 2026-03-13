import { prisma } from "@/lib/db/prisma"

export async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: { id },
  })
}
