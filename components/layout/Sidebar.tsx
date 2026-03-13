"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  MapPin,
  Plus,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/layout/sidebar-context"
import { signOutAction } from "@/features/auth/actions"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Venue Explorer", href: "/venues", icon: MapPin },
]

type SidebarProps = {
  user: {
    name: string
    email: string
    initials: string
  }
}

function SidebarTooltip({
  children,
  label,
  enabled,
}: {
  children: ReactNode
  label: string
  enabled: boolean
}) {
  if (!enabled) return children
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={children as React.ReactElement} />
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { collapsed } = useSidebar()

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r bg-sidebar transition-[width] duration-200 ease-linear overflow-hidden",
        collapsed ? "w-[68px]" : "w-[256px]"
      )}
    >
      {/* Header - Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
          <Calendar className="h-4 w-4" />
        </div>
        <span
          className={cn(
            "text-sm font-semibold tracking-tight whitespace-nowrap transition-opacity duration-200",
            collapsed ? "opacity-0" : "opacity-100"
          )}
        >
          <Link href="/">Evently</Link>
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 overflow-hidden px-3 pt-3">
        {/* Create Event Button */}
        <SidebarTooltip label="Create Event" enabled={collapsed}>
          <Button
            className={cn(
              "shrink-0 gap-2 transition-all duration-200",
              collapsed
                ? "w-10 justify-center px-0 mx-auto"
                : "w-full justify-start"
            )}
            nativeButton={false}
            render={<Link href="/events/new" />}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-opacity duration-200",
                collapsed ? "sr-only" : "opacity-100"
              )}
            >
              Create Event
            </span>
          </Button>
        </SidebarTooltip>

        {/* Navigation */}
        <nav className="mt-4 flex flex-col gap-0.5">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <SidebarTooltip
                key={item.name}
                label={item.name}
                enabled={collapsed}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg py-2 text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center px-2" : "px-3",
                    isActive
                      ? "bg-foreground/[0.08] text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-foreground/5 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-opacity duration-200",
                      collapsed ? "sr-only" : "opacity-100"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </SidebarTooltip>
            )
          })}
        </nav>
      </div>

      {/* Footer - User Menu */}
      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg p-2 text-left text-sm transition-colors hover:bg-foreground/5",
                  collapsed && "justify-center"
                )}
              />
            }
          >
            <Avatar className="h-8 w-8 shrink-0 rounded-lg">
              <AvatarFallback className="rounded-lg text-[11px] font-medium">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "grid flex-1 text-left text-sm leading-tight whitespace-nowrap transition-opacity duration-200",
                collapsed ? "sr-only" : "opacity-100"
              )}
            >
              <span className="truncate text-[13px] font-medium">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <ChevronsUpDown
              className={cn(
                "ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-opacity duration-200",
                collapsed ? "sr-only" : "opacity-100"
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={8}
            className="w-56 rounded-lg"
          >
            <div className="flex items-center gap-2 px-2 py-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg text-[11px] font-medium">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-[13px] font-medium">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <form action={signOutAction}>
              <DropdownMenuItem
                nativeButton
                render={
                  <button type="submit" className="w-full cursor-pointer" />
                }
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
