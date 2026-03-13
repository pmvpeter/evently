"use client"

import { Fragment } from "react"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { usePageTitle } from "./page-title-context"

const topLevelLabels: Record<string, string> = {
  "": "Home",
  events: "Events",
  venues: "Venue Explorer",
}

const subPageLabels: Record<string, string> = {
  new: "New Event",
  edit: "Edit",
}

export function NavbarTitle() {
  const segments = useSelectedLayoutSegments()
  const { pageTitle } = usePageTitle()
  const first = segments[0] ?? ""

  // Top-level pages: just show the page name
  if (segments.length <= 1) {
    return (
      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <span className="text-sm font-medium">{topLevelLabels[first] ?? first}</span>
      </div>
    )
  }

  // Sub-pages: show breadcrumbs
  const crumbs: { label: string; href?: string }[] = []

  if (first === "events") {
    crumbs.push({ label: "Events", href: "/events" })

    if (segments[1] === "new") {
      crumbs.push({ label: "New Event" })
    } else {
      // Dynamic [id] segment — use page title from context if available
      const eventLabel = pageTitle ?? "Event"
      crumbs.push({ label: eventLabel, href: `/events/${segments[1]}` })

      if (segments[2] && segments[2] in subPageLabels) {
        crumbs.push({ label: subPageLabels[segments[2]] })
      } else {
        // On the detail page itself, the last crumb is the event name
        crumbs[crumbs.length - 1] = { label: eventLabel }
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <Fragment key={i}>
                {!isLast && (
                  <BreadcrumbItem className="hidden md:flex">
                    <BreadcrumbLink render={<Link href={crumb.href!} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {!isLast && <BreadcrumbSeparator className="hidden md:flex" />}
                {isLast && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
