import { z } from "zod/v4"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
})

export function validateEnv() {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    console.error("Missing environment variables:", result.error.format())
    throw new Error("Invalid environment variables")
  }
  return result.data
}
