import { z } from "zod/v4"

export const venueSearchSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  capacity: z
    .union([z.literal(""), z.coerce.number().int().positive()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  additionalDetails: z.string().optional(),
})

export type VenueSearchInput = z.infer<typeof venueSearchSchema>

export const venueSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  capacity: z.number(),
  pricePerDayEur: z.number().nullable(),
  pricePerHourEur: z.number().nullable(),
  description: z.string(),
  venueType: z.string(),
  amenities: z.array(z.string()),
  websiteUrl: z.string().nullable(),
  googleMapsUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  rating: z.number().min(1).max(5).nullable(),
  priceNotes: z.string().nullable(),
})

export type Venue = z.infer<typeof venueSchema>
