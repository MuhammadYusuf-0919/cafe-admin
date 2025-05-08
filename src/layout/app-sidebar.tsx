"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { NavGroup } from "@/layout/nav-group"
import { NavUser } from "@/layout/nav-user"
import { TeamSwitcher } from "@/layout/team-switcher"
import { sidebarData } from "./data/sidebar-data"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  
  // Filter sidebar groups based on user role
  const filteredNavGroups = user ? filterNavGroupsByRole(sidebarData.navGroups, user.role) : sidebarData.navGroups
  
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// Helper function to filter sidebar items based on user role
function filterNavGroupsByRole(navGroups: typeof sidebarData.navGroups, role: string) {
  // Admin can see everything
  if (role === "admin") return navGroups

  // Define which items each role can see
  const roleAccess: Record<string, string[]> = {
    doctor: [
      "Dashboard",
      "Bemorlar",
      "Qabullar",
      "Tibbiy yozuvlar",
      "Laboratoriya",
      "Dorixona",
      "Xabarlar",
      "Favqulodda",
      "Jarrohlik",
    ],
    nurse: [
      "Dashboard",
      "Bemorlar",
      "Qabullar",
      "Tibbiy yozuvlar",
      "Laboratoriya",
      "Dorixona",
      "Xabarlar",
      "Favqulodda",
      "Palatalar",
    ],
    receptionist: ["Dashboard", "Bemorlar", "Qabullar", "Moliya", "Xabarlar"],
    lab_technician: ["Dashboard", "Bemorlar", "Laboratoriya", "Xabarlar"],
    pharmacist: ["Dashboard", "Bemorlar", "Dorixona", "Xabarlar"],
  }

  const allowedItems = roleAccess[role] || ["Dashboard"]
  
  // Filter each group's items
  return navGroups.map(group => {
    return {
      ...group,
      items: group.items.filter(item => {
        return allowedItems.includes(item.title)
      })
    }
  }).filter(group => group.items.length > 0) // Remove empty groups
}
