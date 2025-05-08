"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, Settings } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Header } from "./header"
import { useAuth } from "@/context/AuthContext"

interface BreadcrumbItemType {
  label: string
  href?: string
}

export function BreadcrumbHeader() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([])

  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean)
      const breadcrumbItems: BreadcrumbItemType[] = []

      // Add Home
      breadcrumbItems.push({ label: "Bosh sahifa", href: "/" })

      // Add path segments
      let currentPath = ""
      pathSegments.forEach((segment, index) => {
        if (index === 0 && segment === "/") return // Skip 'admin' in the breadcrumb

        currentPath += `/${segment}`

        // Format the segment for display (capitalize, replace hyphens)
        const formattedSegment = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        // Last segment is current page (no link)
        if (index === pathSegments.length - 1) {
          breadcrumbItems.push({ label: formattedSegment })
        } else {
          breadcrumbItems.push({
            label: formattedSegment,
            href: index === 0 ? `/${segment}` : `/${currentPath}`,
          })
        }
      })

      setBreadcrumbs(breadcrumbItems)
    }
  }, [pathname])

  return (
    <Header fixed className="border-b">
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem key={index}>
                {index < breadcrumbs.length - 1 ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-4">
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Qidirish..."
            className="w-64 rounded-lg bg-background pl-8 md:w-80 lg:w-96"
          />
        </form>
      </div> */}
      <Search />

      <div className="flex items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px]">5</Badge>
              <span className="sr-only">Bildirishnomalar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/admin/notifications" className="flex w-full">
                Barcha bildirishnomalar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Sozlamalar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/admin/settings" className="flex w-full">
                Sozlamalar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Profil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/admin/profile" className="flex w-full">
                Profil
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Header>
  )
}

