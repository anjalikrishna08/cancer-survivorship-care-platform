"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { logoutUser } from "@/lib/auth-actions"
import { User, Settings, LogOut } from "lucide-react"

export function UserNav({ user }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  console.log("user", user)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const result = await logoutUser()

      if (result.success) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        })
        router.push("/auth/login")
      } else {
        toast({
          title: "Logout failed",
          description: result.error || "An error occurred during logout.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button asChild className="bg-forest-green hover:bg-forest-green/90">
          <Link href="/auth/register">Sign Up</Link>
        </Button>
      </div>
    )
  }
  function getInitials(fullName: any) {
    const parts = fullName.trim().split(' ');
    if (parts.length === 0) return '';
    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  const initials = getInitials(user.name)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarFallback className="bg-dusty-blue/10 text-forest-green">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{`${user.name}`}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer flex w-full items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer flex w-full items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
