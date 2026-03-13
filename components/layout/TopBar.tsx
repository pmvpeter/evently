import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

export async function TopBar() {
  const session = await auth()
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?"

  return (
    <header className="flex h-14 items-center justify-end border-b px-8">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-2.5 rounded-full pl-1.5 pr-3.5" />}>
          <Avatar size="sm">
            <AvatarFallback className="text-[10px] font-medium">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-medium">{session?.user?.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-56">
          <div className="px-2.5 py-2">
            <p className="text-[13px] font-medium">{session?.user?.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <DropdownMenuItem nativeButton render={<button type="submit" className="w-full cursor-pointer" />}>
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
