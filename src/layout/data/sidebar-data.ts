import {
  LayoutDashboard,
  Users,
  Building2,
  Smartphone,
  CalendarCheck,
  Clock,
  UserCheck,
  UserX,
  AlarmClock, // ⬅️ UserClock o‘rniga mavjud ikon
  Settings,
  StickyNote,
  UserCog
} from 'lucide-react'

import { NavGroup, Team, User } from "../types"

export const sidebarData = {
  user: {
    name: "TimeTrack Admin",
    email: "admin@timetrack.uz",
    avatar: "/avatar.svg",
    role: "superadmin" // yoki "hr", "monitoring", "operator"
  } as User,

  teams: [
    {
      name: "Markaziy ofis",
      logo: Building2,
      plan: "Superadmin panel"
    },
    {
      name: "Ishchi guruh",
      logo: Users,
      plan: "Operatorlar uchun"
    }
  ] as Team[],

  navGroups: [
    {
      title: "Asosiy",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
          roles: ["superadmin", "monitoring", "operator"]
        }
      ]
    },

    {
      title: "Xodimlar",
      items: [
        {
          title: "Xodimlar ro‘yxati",
          url: "/employees",
          icon: Users,
          roles: ["superadmin", "hr"]
        },
        {
          title: "Filiallar",
          url: "/branches",
          icon: Building2,
          roles: ["superadmin", "hr"]
        },
        {
          title: "Qurilmalar (Mobil)",
          url: "/devices",
          icon: Smartphone,
          roles: ["superadmin", "hr"]
        }
      ]
    },

    {
      title: "Davomat",
      items: [
        {
          title: "Bugungi davomat",
          url: "/attendance",
          icon: CalendarCheck,
          roles: ["superadmin", "monitoring", "operator"]
        }
      ]
    },    

    {
      title: "Ish Rejimi",
      items: [
        {
          title: "Ish vaqtini sozlash",
          url: "/working-mode/schedule",
          icon: CalendarCheck,
          roles: ["superadmin", "hr"]
        },
        {
          title: "Davomat va rejim",
          url: "/working-mode/monitoring",
          icon: Clock,
          roles: ["superadmin", "monitoring"]
        }
      ]
    },

    {
      title: "Sozlamalar",
      items: [
        {
          title: "Tenant sozlamalari",
          url: "/settings/tenant",
          icon: Settings,
          roles: ["superadmin"]
        },
        {
          title: "Tenant eslatmalari",
          url: "/settings/notes",
          icon: StickyNote,
          roles: ["superadmin"]
        },
        {
          title: "Rollar va ruxsatlar",
          url: "/settings/permissions",
          icon: UserCog,
          roles: ["superadmin"]
        }
      ]
    }
  ] as NavGroup[]
}
