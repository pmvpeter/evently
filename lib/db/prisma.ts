import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const connectionString = process.env.POSTGRES_PRISMA_URL!
const isLocalhost =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1")

// Strip sslmode from the connection string — pg-connection-string parses it
// and overrides any explicit `ssl` config we pass. In pg v8, sslmode=require
// is treated as verify-full, which rejects Supabase's certificate on Vercel.
const cleanConnectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, "")

const adapter = new PrismaPg({
  connectionString: cleanConnectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
})

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
