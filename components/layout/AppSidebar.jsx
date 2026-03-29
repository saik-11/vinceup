"use client";

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

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

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

const AppSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

const isActive = (href) => href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const renderMenuItems = (items) =>
    items.map((item) => {
      const active = isActive(item.href);
      const Icon = item.icon;
      return (
        <li key={item.href}>
          <Button
            asChild
            variant={active ? "default" : "ghost"}
            className={`w-full justify-start gap-3 h-10 rounded-lg font-medium cursor-pointer ${
              active
                ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link href={item.href}>
              <Icon className="size-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          </Button>
        </li>
      );
    });

  return (
    <aside className="flex h-full w-65 shrink-0 flex-col border-r bg-background">
      <nav className="flex-1 space-y-6 px-4 pt-6">
        {/* ── Main Menu ── */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Main Menu
          </p>
          <ul className="space-y-1 list-none">
            {renderMenuItems(mainMenuItems)}
          </ul>
        </div>

        {/* ── Vega AI Features ── */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-4" />
            Vega AI Features
          </p>
          <ul className="space-y-1 list-none">
            {renderMenuItems(vegaAiItems)}
          </ul>
        </div>
      </nav>

      {/* ── Logout ── */}
      <div className="px-4 pb-6">
        <Separator className="mb-4" />
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 h-10 rounded-lg font-medium text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <LogOut className="size-5 shrink-0" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
