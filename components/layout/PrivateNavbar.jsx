"use client";

import {Bell,ChevronDown,ExternalLink,HelpCircle,LogOut,Moon,Receipt,Settings,Sun,User,} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu,DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import vinceup_logo from "../../public/assets/vinceup_logo.png";
import AppSidebar from "./AppSidebar";

// import Footer from "./Footer";

const PrivateNavbar = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full flex-col">
        {/* Top Navbar — full width, always on top */}
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur-lg">
          <div className="font-bold">
            <Link href="/dashboard">
              <Image src={vinceup_logo} alt="vinceup" loading="eager" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            
            {/* 🔔 Notification Bell (UPDATED) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Bell className="size-5" />
              <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
            </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 p-3">
                <div className="mb-2 text-sm font-semibold">
                  Notifications
                </div>

                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                  <Bell className="size-6 opacity-50" />
                  <span className="text-sm">
                    No notifications available
                  </span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Link href="/settings">
                <Settings className="size-5" />
              </Link>
            </Button>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1.5 px-2 cursor-pointer"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
                    <User className="size-5" />
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 p-2">
                {/* ── User Info ── */}
                <div className="flex items-center gap-3 px-2 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <User className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user?.name ?? "User"}
                    </p>
                    {user?.email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer gap-3 py-2.5"
                >
                  <Link href="/personal-details">
                    <User className="size-4" />
                    Personal Details
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer gap-3 py-2.5"
                >
                  <Link href="/purchase-history">
                    <Receipt className="size-4" />
                    Purchase History
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer gap-3 py-2.5"
                >
                  <Link href="/">
                    <ExternalLink className="size-4" />
                    Go To Website
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer gap-3 py-2.5"
                >
                  <Link href="/help">
                    <HelpCircle className="size-4" />
                    Help
                  </Link>
                </DropdownMenuItem>

                {/* ── Theme Toggle ── */}
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer gap-3 py-2.5"
                >
                  {isLight ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                  <span className="flex-1">Theme</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isLight ? "Light" : "Dark"}
                    <Switch
                      checked={!isLight}
                      onCheckedChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                      }
                      className="scale-75"
                    />
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer gap-3 py-2.5 text-red-500 focus:text-red-500"
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Below navbar: sidebar + content */}
        <section className="flex flex-1 overflow-hidden">
          <AppSidebar />
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </section>
        {/* <Footer /> */}
      </div>
    </SidebarProvider>
  );
};

export default PrivateNavbar;
