export async function onRequestError() {
  // Next.js requires this export to enable instrumentation
}

export async function register() {
  const { validateEnv } = await import("@/lib/validation/env")
  validateEnv()
}
