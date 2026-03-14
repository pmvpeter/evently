"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { venueSearchSchema, type VenueSearchInput, type Venue } from "../schemas/venueSchemas"
import { countries } from "../data/countries"
import { searchVenues } from "../actions/searchVenues"
import { VenueCard } from "./VenueCard"

/** Estimated search duration in seconds – used to pace the simulated progress bar. */
const ESTIMATED_SEARCH_SECONDS = 30

const progressSteps = [
  { at: 0, text: "Analyzing your search criteria..." },
  { at: 15, text: "Finding venues that match your requirements..." },
  { at: 35, text: "Gathering venue details and pricing..." },
  { at: 60, text: "Preparing recommendations..." },
  { at: 85, text: "Almost there..." },
]

function getProgressText(progress: number) {
  let text = progressSteps[0].text
  for (const step of progressSteps) {
    if (progress >= step.at) text = step.text
  }
  return text
}

function useSimulatedProgress(active: boolean) {
  const [progress, setProgress] = useState(0)
  const startTime = useRef(0)
  const intervalId = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    if (active) {
      startTime.current = Date.now()
      setProgress(0)

      intervalId.current = setInterval(() => {
        const elapsed = Date.now() - startTime.current
        const seconds = elapsed / 1000

        let value: number
        if (seconds <= ESTIMATED_SEARCH_SECONDS) {
          // 0-90% over estimated duration (ease-out)
          value = 90 * (1 - Math.pow(1 - seconds / ESTIMATED_SEARCH_SECONDS, 2))
        } else {
          // 90-99% asymptotically after estimated duration
          const extra = seconds - ESTIMATED_SEARCH_SECONDS
          value = 90 + 9 * (1 - Math.exp(-extra / ESTIMATED_SEARCH_SECONDS))
        }

        setProgress(Math.min(value, 99))
      }, 100)
    } else {
      if (intervalId.current) clearInterval(intervalId.current)
      setProgress(0)
    }

    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [active])

  return progress
}

export function VenueSearchForm() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VenueSearchInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(venueSearchSchema) as any,
  })

  const progress = useSimulatedProgress(isLoading)

  async function onSubmit(data: VenueSearchInput) {
    if (!countries.includes(data.country as typeof countries[number])) {
      setError("Please select a valid country from the list.")
      return
    }

    setError(null)
    setVenues([])
    setHasSearched(true)
    setIsLoading(true)

    try {
      const result = await searchVenues(data)
      if (result.success) {
        setVenues(result.venues)
      } else {
        setError(result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              list="countries-list"
              placeholder="Select a country"
              {...register("country")}
              className="mt-1.5"
            />
            <datalist id="countries-list">
              {countries.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.country && (
              <p className="mt-1.5 text-[13px] text-destructive">{errors.country.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Any city"
              {...register("city")}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              placeholder="Min. capacity"
              {...register("capacity")}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="additionalDetails">Additional Details</Label>
          <Input
            id="additionalDetails"
            placeholder="e.g. close to the beach, rooftop terrace, parking available"
            {...register("additionalDetails")}
            className="mt-1.5"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            <Search className="mr-1.5 h-4 w-4" />
            {isLoading ? "Searching..." : "Search Venues"}
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[13px] text-muted-foreground">
              {getProgressText(progress)}
            </p>
          </div>
        )}
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {hasSearched && !error && venues.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground">
          No venues found. Try adjusting your search criteria.
        </p>
      )}

      {venues.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Results are AI-generated suggestions. Prices are estimates. Verify details independently.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {venues.map((venue) => (
              <VenueCard key={venue.name} venue={venue} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
