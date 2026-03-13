import { z } from "zod/v4"

export const eventStatuses = ["draft", "confirmed", "cancelled"] as const

// Client-side form validation (string dates, no defaults — form provides defaults)
export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  venueName: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(eventStatuses),
  attendees: z.coerce.number().int().min(0),
  capacity: z.coerce.number().int().min(1).optional(),
  cost: z.coerce.number().min(0).optional(),
  revenue: z.coerce.number().min(0).optional(),
  currency: z.string().min(1),
  category: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
})

// Server-side validation (coerces dates, has defaults)
export const createEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  venueName: z.string().optional(),
  startDate: z.coerce.date({ error: "Start date is required" }),
  endDate: z.coerce.date({ error: "End date is required" }),
  status: z.enum(eventStatuses).default("draft"),
  attendees: z.coerce.number().int().min(0).default(0),
  capacity: z.coerce.number().int().min(1).optional(),
  cost: z.coerce.number().min(0).optional(),
  revenue: z.coerce.number().min(0).optional(),
  currency: z.string().default("EUR"),
  category: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
})

export const updateEventSchema = createEventSchema

export type EventFormValues = z.infer<typeof eventFormSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
