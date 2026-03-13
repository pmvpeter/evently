"use client"

import { Button } from "@/components/ui/button"
import { deleteEvent } from "../actions/deleteEvent"
import { useState } from "react"
import { Trash2 } from "lucide-react"

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await deleteEvent(eventId)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Delete this event?</span>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Confirm"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={deleting}>
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
      <Trash2 className="mr-1.5" />
      Delete
    </Button>
  )
}
