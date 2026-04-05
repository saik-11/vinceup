"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  LayoutGrid,
  Link2,
  LogOut,
  Map as MapIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mainMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/book-session", label: "Book Session", icon: BookOpen },
  { href: "/my-sessions", label: "My Sessions", icon: CalendarDays },
];

const vegaAiItems = [
  { href: "/action-board", label: "Action Board", icon: ClipboardCheck },
  { href: "/clarity-capsule", label: "Clarity Capsule", icon: Link2 },
  { href: "/clarity-map", label: "Clarity Map", icon: MapIcon },
  { href: "/growth-meter", label: "Growth Meter", icon: TrendingUp },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const renderMenu = (items) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.href);

      return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            data-active={active}
            className={`
              gap-3 h-10 rounded-lg font-medium
              data-[active=true]:bg-primary
              data-[active=true]:text-white
              data-[active=true]:hover:bg-primary/90
              text-muted-foreground hover:text-foreground
            `}
          >
            <Link href={item.href}>
              <Icon className="size-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  return (
    <Sidebar className="sticky h-full! border-r bg-background">
      <SidebarContent className="px-2 pt-6">
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Main Menu
          </SidebarGroupLabel>

          <SidebarMenu>{renderMenu(mainMenuItems)}</SidebarMenu>
        </SidebarGroup>

        {/* Vega AI */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-4" />
            Vega AI Features
          </SidebarGroupLabel>

          <SidebarMenu>{renderMenu(vegaAiItems)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-2 pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton // onClick={logout}
              className="gap-3 h-10 rounded-lg font-medium text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-5 shrink-0" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
