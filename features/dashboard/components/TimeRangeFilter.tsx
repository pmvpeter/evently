"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { timeRangeOptions, timeRangeLabels, type TimeRange } from "../lib/timeRange"

export function TimeRangeFilter({ value }: { value: TimeRange }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = useCallback(
    (newValue: readonly unknown[]) => {
      const selected = newValue[0] as TimeRange | undefined
      if (!selected) return
      const params = new URLSearchParams(searchParams.toString())
      if (selected === "12m") {
        params.delete("range")
      } else {
        params.set("range", selected)
      }
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <ToggleGroup value={[value]} onValueChange={handleChange}>
      {timeRangeOptions.map((option) => (
        <ToggleGroupItem key={option} value={option}>
          {timeRangeLabels[option]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
