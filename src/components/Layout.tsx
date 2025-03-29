/* eslint-disable react/react-in-jsx-scope */
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@radix-ui/react-separator";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "./ui/breadcrumb";
import Topbar from "./ui/Topbar";
import i18next from "i18next";
import { ThemeToggle } from "@/utils/ThemeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeToggle />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{i18next.t(window.location.pathname.substring(1, window.location.pathname.length))}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {children}

        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
