"use server"

import { requireUser } from "@/lib/auth/auth"
import { z } from "zod/v4"
import { generateStructuredJson } from "@/lib/clients/openai"
import { venueSearchSchema, venueSchema, type Venue } from "../schemas/venueSchemas"

const venuesResponseSchema = z.object({
  venues: z.array(venueSchema),
})

const venuesJsonSchema = {
  type: "object",
  properties: {
    venues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          country: { type: "string" },
          capacity: { type: "number" },
          pricePerDayEur: { type: ["number", "null"] },
          pricePerHourEur: { type: ["number", "null"] },
          description: { type: "string" },
          venueType: { type: "string" },
          amenities: { type: "array", items: { type: "string" } },
          websiteUrl: { type: ["string", "null"] },
          googleMapsUrl: { type: ["string", "null"] },
          imageUrl: { type: ["string", "null"] },
          rating: { type: ["number", "null"] },
          priceNotes: { type: ["string", "null"] },
        },
        required: [
          "name", "address", "city", "country", "capacity",
          "pricePerDayEur", "pricePerHourEur", "description",
          "venueType", "amenities", "websiteUrl", "googleMapsUrl", "imageUrl",
          "rating", "priceNotes",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["venues"],
  additionalProperties: false,
} as const

export async function searchVenues(
  input: unknown
): Promise<{ success: true; venues: Venue[] } | { success: false; error: string }> {
  await requireUser()

  const parsed = venueSearchSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: "Invalid search input. Please check your fields." }
  }

  const { country, city, capacity, additionalDetails } = parsed.data

  const locationPart = city ? `${city}, ${country}` : country
  const capacityPart = capacity ? `The venue should accommodate at least ${capacity} people.` : ""
  const detailsPart = additionalDetails ? `Additional requirements: ${additionalDetails}.` : ""

  const prompt = `You are a venue recommendation expert. Suggest up to 10 real event venues in or near ${locationPart}.
${capacityPart}
${detailsPart}

For each venue, provide:
- name: the venue's real name
- address: full street address
- city: city name
- country: country name
- capacity: estimated maximum capacity (number)
- pricePerDayEur: estimated price per day in EUR (number or null if unknown)
- pricePerHourEur: estimated price per hour in EUR (number or null if unknown)
- description: a 1-2 sentence description of the venue
- venueType: type of venue (e.g. "Hotel", "Convention Center", "Historic Estate", "Rooftop", "Beach Club")
- amenities: array of amenities (e.g. ["WiFi", "Parking", "Catering", "AV Equipment"])
- websiteUrl: the venue's website URL if known, otherwise null
- googleMapsUrl: a Google Maps URL for the venue (e.g. https://maps.google.com/?q=...) if you are confident about the location, otherwise null
- imageUrl: always null
- rating: estimated rating from 1 to 5 if known, otherwise null
- priceNotes: any notes about pricing (e.g. "Prices vary by season", "Minimum booking of 4 hours") or null

All prices should be estimates in EUR.`

  try {
    const result = await generateStructuredJson({
      prompt,
      schema: venuesJsonSchema,
      zodSchema: venuesResponseSchema,
      schemaName: "venues",
    })

    return { success: true, venues: result.venues }
  } catch (error) {
    console.error("Venue search failed:", error)
    return { success: false, error: "Failed to search venues. Please try again." }
  }
}
