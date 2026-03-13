import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const connectionString = process.env.POSTGRES_PRISMA_URL!
const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1")

const adapter = new PrismaPg({
  connectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
})

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
