import OpenAI from "openai"
import { z } from "zod/v4"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type JsonSchema = Record<string, unknown>

export async function generateStructuredJson<T extends z.ZodType>(options: {
  prompt: string
  schema: JsonSchema
  zodSchema: T
  schemaName?: string
}): Promise<z.infer<T>> {
  const response = await client.responses.create({
    model: "gpt-5.4",
    instructions: "You return only valid JSON. No markdown, no code fences, just the JSON.",
    input: options.prompt,
    text: {
      format: {
        type: "json_schema",
        name: options.schemaName ?? "response",
        strict: true,
        schema: options.schema,
      },
    },
  })

  const json = JSON.parse(response.output_text)
  return options.zodSchema.parse(json)
}
