import React from "react";
import siteMap from "@/utils/siteMap";
import { useNavigate } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import i18next from "i18next";

export function AppSidebar() {
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel><img className="w-10" src="/logo-small.png" alt="logo" /></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {siteMap.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={i18next.t(item.title)}>
                    <button onClick={() => navigate(item.path, { state: {} })}>
                      <item.icon />
                      <span>{i18next.t(item.title)}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
