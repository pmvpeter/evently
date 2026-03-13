"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventFormSchema, eventStatuses, type EventFormValues } from "../schemas/eventSchemas"
import type { CreateEventInput } from "../schemas/eventSchemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

function formatDateForInput(date: Date | undefined) {
  if (!date) return ""
  return date.toISOString().slice(0, 16)
}

export function EventForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<CreateEventInput>
  onSubmit: (data: CreateEventInput) => Promise<{ success: false; error: string } | void>
}) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      location: defaultValues?.location ?? "",
      country: defaultValues?.country ?? "",
      city: defaultValues?.city ?? "",
      venueName: defaultValues?.venueName ?? "",
      startDate: formatDateForInput(defaultValues?.startDate),
      endDate: formatDateForInput(defaultValues?.endDate),
      status: defaultValues?.status ?? "draft",
      attendees: defaultValues?.attendees ?? 0,
      capacity: defaultValues?.capacity,
      cost: defaultValues?.cost,
      revenue: defaultValues?.revenue,
      currency: defaultValues?.currency ?? "EUR",
      category: defaultValues?.category ?? "",
      notes: defaultValues?.notes ?? "",
    },
  })

  async function handleFormSubmit(data: EventFormValues) {
    setServerError(null)
    const result = await onSubmit(data as unknown as CreateEventInput)
    if (result && !result.success) {
      setServerError(result.error)
    }
  }

  const selectClass = "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
  const textareaClass = "w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring focus:ring-3 focus:ring-ring/50"

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* General */}
      <fieldset className="space-y-4">
        <legend className="text-[13px] font-medium text-muted-foreground">General</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Event Name</Label>
            <Input id="name" {...register("name")} className="mt-1.5" />
            {errors.name && <p className="mt-1.5 text-[13px] text-destructive">{errors.name.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea id="description" {...register("description")} rows={3} className={`mt-1.5 ${textareaClass}`} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register("category")} placeholder="e.g. Conference, Workshop" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" {...register("status")} className={`mt-1.5 ${selectClass}`}>
              {eventStatuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <Separator />

      {/* Location */}
      <fieldset className="space-y-4">
        <legend className="text-[13px] font-medium text-muted-foreground">Location</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} className="mt-1.5" />
            {errors.country && <p className="mt-1.5 text-[13px] text-destructive">{errors.country.message}</p>}
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} className="mt-1.5" />
            {errors.city && <p className="mt-1.5 text-[13px] text-destructive">{errors.city.message}</p>}
          </div>
          <div>
            <Label htmlFor="location">Address</Label>
            <Input id="location" {...register("location")} className="mt-1.5" />
            {errors.location && <p className="mt-1.5 text-[13px] text-destructive">{errors.location.message}</p>}
          </div>
          <div className="sm:col-span-3">
            <Label htmlFor="venueName">Venue Name</Label>
            <Input id="venueName" {...register("venueName")} className="mt-1.5" />
          </div>
        </div>
      </fieldset>

      <Separator />

      {/* Schedule */}
      <fieldset className="space-y-4">
        <legend className="text-[13px] font-medium text-muted-foreground">Schedule</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="datetime-local" {...register("startDate")} className="mt-1.5" />
            {errors.startDate && <p className="mt-1.5 text-[13px] text-destructive">{errors.startDate.message}</p>}
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="datetime-local" {...register("endDate")} className="mt-1.5" />
            {errors.endDate && <p className="mt-1.5 text-[13px] text-destructive">{errors.endDate.message}</p>}
          </div>
        </div>
      </fieldset>

      <Separator />

      {/* Capacity & Cost */}
      <fieldset className="space-y-4">
        <legend className="text-[13px] font-medium text-muted-foreground">Capacity & Cost</legend>
        <div className="grid gap-4 sm:grid-cols-5">
          <div>
            <Label htmlFor="attendees">Attendees</Label>
            <Input id="attendees" type="number" min={0} {...register("attendees")} className="mt-1.5" />
            {errors.attendees && <p className="mt-1.5 text-[13px] text-destructive">{errors.attendees.message}</p>}
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" type="number" min={1} {...register("capacity")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="cost">Cost</Label>
            <Input id="cost" type="number" step="0.01" min={0} {...register("cost")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="revenue">Revenue</Label>
            <Input id="revenue" type="number" step="0.01" min={0} {...register("revenue")} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" {...register("currency")} className="mt-1.5" />
          </div>
        </div>
      </fieldset>

      <Separator />

      {/* Notes */}
      <fieldset className="space-y-4">
        <legend className="text-[13px] font-medium text-muted-foreground">Additional</legend>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea id="notes" {...register("notes")} rows={3} className={`mt-1.5 ${textareaClass}`} />
        </div>
      </fieldset>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Event"}
        </Button>
      </div>
    </form>
  )
}
