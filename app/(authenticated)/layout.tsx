import { cookies } from "next/headers"
import { auth } from "@/auth"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileSidebar } from "@/components/layout/MobileSidebar"
import { SidebarProvider } from "@/components/layout/sidebar-context"
import { SidebarTrigger } from "@/components/layout/SidebarTrigger"
import { NavbarTitle } from "@/components/layout/NavbarTitle"
import { PageTitleProvider } from "@/components/layout/page-title-context"
import { Calendar } from "lucide-react"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const cookieStore = await cookies()
  const collapsed = cookieStore.get("sidebar_collapsed")?.value === "true"

  const user = {
    name: session?.user?.name ?? "User",
    email: session?.user?.email ?? "",
    initials:
      session?.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() ?? "?",
  }

  return (
    <PageTitleProvider>
    <SidebarProvider defaultCollapsed={collapsed}>
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar user={user} />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border/60 px-4 md:hidden">
            <MobileSidebar user={user} />
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                Evently
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {/* Desktop Header */}
            <header className="sticky top-0 z-30 hidden h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur-md md:flex">
              <div className="flex items-center gap-2 px-6 lg:px-10">
                <SidebarTrigger />
                <NavbarTitle />
              </div>
            </header>

            <div className="p-6 lg:px-10 lg:py-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </PageTitleProvider>
  )
}
