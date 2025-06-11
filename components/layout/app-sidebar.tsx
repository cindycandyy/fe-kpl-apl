"use client"

import { Calendar, Home, Ticket, Plus, BarChart3, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/providers"
import Link from "next/link"

export function AppSidebar() {
  const { isOrganizer, user } = useAuth()

  const organizerItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Kelola Event",
      url: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: "Buat Event",
      url: "/dashboard/events/create",
      icon: Plus,
    },
    {
      title: "Statistik",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
  ]

  const userItems = [
    {
      title: "Jelajahi Event",
      url: "/events",
      icon: Home,
    },
    {
      title: "Tiket Saya",
      url: "/my-tickets",
      icon: Ticket,
    },
  ]

  const items = isOrganizer ? organizerItems : userItems

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">EventHub</h2>
            <p className="text-xs text-muted-foreground">{isOrganizer ? "Organizer" : "User"}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
