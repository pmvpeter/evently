import { config } from "dotenv"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

config({ path: ".env.local" })

const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_URL_NON_POOLING! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("events2026Demo", 10)

  await prisma.user.upsert({
    where: { email: "pedro.melo.vasconcelos@gmail.com" },
    update: {},
    create: {
      email: "pedro.melo.vasconcelos@gmail.com",
      name: "Pedro Vasconcelos",
      password: hashedPassword,
      role: "admin",
    },
  })

  console.log("Seed completed")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
