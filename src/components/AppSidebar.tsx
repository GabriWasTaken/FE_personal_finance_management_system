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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";

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
                item.collapsable ?
                  <Collapsible key={item.title} className="group/collapsible sidebarcollapsible">
                    <CollapsibleTrigger>
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton tooltip={i18next.t(item.title)}>
                          <item.icon />
                          <span>{i18next.t(item.title)}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <>
                        {item.subMenu?.map((child) => (
                          <SidebarMenuItem key={child.title} className="pl-6">
                            <SidebarMenuButton asChild tooltip={i18next.t(child.title)}>
                              <button onClick={() => navigate(child.path, { state: {} })}>
                                <child.icon />
                                <span>{i18next.t(child.title)}</span>
                              </button>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </>
                    </CollapsibleContent>
                  </Collapsible>
                  :
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
