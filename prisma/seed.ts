import { config } from "dotenv"
import { PrismaClient } from "../generated/prisma/client"
import bcrypt from "bcryptjs"

config({ path: ".env.local" })

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("evently2026Demo", 10)

  await prisma.user.upsert({
    where: { email: "pedro.melo.vasconcelos@gmail.com" },
    update: { password: hashedPassword },
    create: {
      email: "pedro.melo.vasconcelos@gmail.com",
      name: "Pedro Vasconcelos",
      password: hashedPassword,
      role: "admin",
    },
  })

  await prisma.user.upsert({
    where: { email: "eliott@pmvpeter.com" },
    update: { password: hashedPassword },
    create: {
      email: "eliott@pmvpeter.com",
      name: "Eliott Ardisson",
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
