"use client";

import { memo } from "react";
import {
  Bell,
  Calendar,
  ChevronDown,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  ShoppingBag,
  Sun,
  UserCircle,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const USER_MENU_ITEMS = [
  { href: "/personal-details", icon: UserCircle, label: "Personal Details" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/purchase-history", icon: ShoppingBag, label: "Purchase History" },
  { href: "/", icon: Globe, label: "Go To Website" },
  { href: "/help", icon: HelpCircle, label: "Help" },
];

const AVATAR_SIZE_CLASSES = {
  9: "size-9",
  10: "size-10",
};

function Avatar({ size = 9, user }) {
  const sizeClass = AVATAR_SIZE_CLASSES[size] || AVATAR_SIZE_CLASSES[9];
  const initial =
    user?.first_name
      ?.trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <ShadcnAvatar className={`${sizeClass} shrink-0`}>
      {/* If image exists */}
      <AvatarImage src={user?.avatar_url || ""} alt="User avatar" />

      {/* If no image show first letter */}
      <AvatarFallback className="bg-primary text-white font-semibold">{initial}</AvatarFallback>
    </ShadcnAvatar>
  );
}

function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2 size-2 rounded-full bg-red-500 ring-2 ring-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-background p-3">
        <div className="mb-2 text-sm font-semibold">Notifications</div>
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <Bell className="size-6 opacity-50" />
          <span className="text-sm">No notifications available</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu({ user, onLogout, isLight, setTheme }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex cursor-pointer items-center gap-1 px-1.5 sm:px-2 py-6" aria-label="User menu">
          <Avatar user={user} />
          <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-2 bg-background z-51">
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar size={10} user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user?.first_name
                ?.trim()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ") ?? "User"}
            </p>
            {user?.email ? <p className="truncate text-xs text-muted-foreground">{user.email}</p> : null}
          </div>
        </div>

        <DropdownMenuSeparator />

        {USER_MENU_ITEMS.map(({ href, icon: Icon, label }) => (
          <DropdownMenuItem key={`${href}-${label}`} asChild>
            <Link href={href} className="gap-3 py-2.5">
              <Icon className="size-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setTheme(isLight ? "dark" : "light");
          }}
          className="cursor-pointer gap-3 py-2.5"
        >
          {isLight ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span className="flex-1">Theme</span>
          <Switch
            checked={!isLight}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            onClick={(event) => event.stopPropagation()}
            className="cursor-pointer"
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} className="cursor-pointer gap-3 py-2.5 text-red-500">
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * @param {{ layout?: "public" | "private", compact?: boolean }} props
 * compact — renders minimal icons only (for mobile private navbar)
 */
function AuthButtonsInner({ layout = "public", compact = false }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  /* ── Not logged in ── */
  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Button asChild variant="ghost" className="hover:bg-transparent! cursor-pointer border" size="lg">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="outline" className="cursor-pointer border-primary! text-primary!" size="lg">
          <Link href="/signup">Sign Up</Link>
        </Button>
        <Button asChild className="cursor-pointer" size="lg">
          <Link href="/signup">
            <Calendar />
            Book a Session
          </Link>
        </Button>
      </div>
    );
  }

  /* ── Logged in ── */
  const isLight = resolvedTheme === "light" || !resolvedTheme;
  const isPublic = layout === "public";

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  /* Compact mode: notification bell + avatar only (mobile private) */
  if (compact) {
    return (
      <div className="flex items-center gap-0.5">
        <NotificationBell />
        <UserMenu user={user} onLogout={handleLogout} isLight={isLight} setTheme={setTheme} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <NotificationBell />
      {isPublic ? (
        <>
          <Button asChild className="cursor-pointer" size="lg" variant="outline">
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>
          </Button>
          <Button asChild className="cursor-pointer" size="lg">
            <Link href="/book-session">
              <Calendar className="size-4" />
              <span className="hidden lg:inline">Book a Session</span>
            </Link>
          </Button>
        </>
      ) : (
        <>
          <Button asChild variant="ghost" size="icon" className="cursor-pointer text-muted-foreground hover:text-foreground">
            <Link href="/settings" aria-label="Settings">
              <Settings className="size-5" />
            </Link>
          </Button>
          <UserMenu user={user} onLogout={handleLogout} isLight={isLight} setTheme={setTheme} />
        </>
      )}
    </div>
  );
}

const AuthButtons = memo(AuthButtonsInner);

export default AuthButtons;
