import type { EventStatus } from "@/generated/prisma/client"

export type DisplayStatus = "draft" | "cancelled" | "upcoming" | "ongoing" | "completed"

export function getDisplayStatus(
  status: EventStatus,
  startDate: Date,
  endDate: Date,
  now: Date = new Date(),
): DisplayStatus {
  if (status === "draft") return "draft"
  if (status === "cancelled") return "cancelled"
  // confirmed — derive from dates
  if (now < startDate) return "upcoming"
  if (now <= endDate) return "ongoing"
  return "completed"
}

export const displayStatusStyles: Record<DisplayStatus, string> = {
  draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  upcoming: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ongoing: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
}

export function formatDisplayStatus(status: DisplayStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
