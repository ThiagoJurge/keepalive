"use client"

import * as React from "react"
import {
  IconActivityHeartbeat,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"
import { BotIcon } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const user = {
  name: "Admin",
  email: "admin@example.com",
  avatar: "/avatars/admin.jpg",
}

const navMain = [
  { title: "Monitoramento", url: "/", icon: IconActivityHeartbeat },
  { title: "Bot", url: "/bot", icon: BotIcon },
]

const navSecondary = [
  { title: "Configurações", url: "/settings", icon: IconSettings },
  { title: "Ajuda", url: "/help", icon: IconHelp },
  { title: "Pesquisar", url: "/search", icon: IconSearch },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">KeepAlive</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
