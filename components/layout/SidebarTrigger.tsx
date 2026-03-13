"use client"

import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/layout/sidebar-context"

export function SidebarTrigger() {
  const { toggleCollapsed } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleCollapsed}
      className="-ml-1"
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}
