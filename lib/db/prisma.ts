import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const connectionString = process.env.POSTGRES_PRISMA_URL!
const isLocalhost =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1")

// On remote connections (Supabase), use libpq-compatible SSL semantics so that
// sslmode=require means "encrypt but don't verify certificates" instead of
// pg v8's default behavior of treating it as verify-full.
const url = isLocalhost
  ? connectionString
  : connectionString + (connectionString.includes("?") ? "&" : "?") + "uselibpqcompat=true"

const adapter = new PrismaPg({
  connectionString: url,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
})

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
