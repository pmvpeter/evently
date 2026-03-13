import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"

export async function getCurrentUser() {
  const session = await auth()

  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
  })
}

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

export async function requireAdmin() {
  const user = await requireUser()

  if (user.role !== "admin") {
    throw new Error("Forbidden")
  }

  return user
}
