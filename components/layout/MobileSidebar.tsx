"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, MapPin, Plus, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { signOutAction } from "@/features/auth/actions"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Venue Explorer", href: "/venues", icon: MapPin },
]

type MobileSidebarProps = {
  user: {
    name: string
    email: string
    initials: string
  }
}

export function MobileSidebar({ user }: MobileSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="md:hidden" />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[256px] bg-sidebar p-0">
        <SheetTitle className="flex h-14 items-center gap-2.5 px-4 text-sm font-semibold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Calendar className="h-4 w-4" />
          </div>
          Evently
        </SheetTitle>

        <div className="flex flex-1 flex-col px-3 pt-2">
          <Button
            className="w-full justify-start gap-2"
            nativeButton={false}
            render={<Link href="/events/new" />}
            onClick={() => setOpen(false)}
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>

          <nav className="mt-4 flex flex-col gap-0.5">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-foreground/[0.08] text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-foreground/5 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User section at bottom */}
        <div className="mt-auto border-t p-3">
          <div className="flex items-center gap-2.5 rounded-lg p-2">
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
          <Separator className="my-2" />
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
