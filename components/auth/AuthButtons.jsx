"use client";

import {
  Bell,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  LogOut,
  Moon,
  Receipt,
  Settings,
  Sun,
  User,
} from "lucide-react";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";

const AuthButtons = () => {
  const { token, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch completely
  if (!mounted) return null;

  const isLight = theme === "light";

  // 🔓 NOT LOGGED IN
  if (!token) {
    return (
      <>
        <Button
          asChild
          variant="ghost"
          className="hover:bg-transparent! border cursor-pointer"
          size="lg"
        >
          <Link href="/login">Login</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="cursor-pointer border-primary! text-primary!"
          size="lg"
        >
          <Link href="/signup">Sign Up</Link>
        </Button>
      </>
    );
  }

  // 🔐 LOGGED IN
  return (
    <div className="flex items-center gap-3">
      {/* 🔔 Notifications */}
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
          <div className="mb-2 text-sm font-semibold">Notifications</div>
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
            <Bell className="size-6 opacity-50" />
            <span className="text-sm">No notifications available</span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ⚙️ Settings */}
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

      {/* 👤 User Menu */}
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
          {/* User Info */}
          <div className="flex items-center gap-3 px-2 py-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
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

          <DropdownMenuItem asChild>
            <Link href="/personal-details" className="gap-3 py-2.5">
              <User className="size-4" />
              Personal Details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/purchase-history" className="gap-3 py-2.5">
              <Receipt className="size-4" />
              Purchase History
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/" className="gap-3 py-2.5">
              <ExternalLink className="size-4" />
              Go To Website
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/help" className="gap-3 py-2.5">
              <HelpCircle className="size-4" />
              Help
            </Link>
          </DropdownMenuItem>

          {/* Theme Toggle */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="gap-3 py-2.5"
          >
            {isLight ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}

            <span className="flex-1">Theme</span>

            <Switch
              checked={!isLight}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
              className="scale-75"
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={logout}
            className="gap-3 py-2.5 text-red-500"
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthButtons;