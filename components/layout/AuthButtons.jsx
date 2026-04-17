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

const USER_MENU_ITEMS = [
  { href: "/personal-details", icon: UserCircle, label: "Personal Details" },
  { href: "/purchase-history", icon: ShoppingBag, label: "Purchase History" },
  { href: "/", icon: Globe, label: "Go To Website" },
  { href: "/help", icon: HelpCircle, label: "Help" },
];

const AVATAR_SIZE_CLASSES = {
  9: "size-9",
  10: "size-10",
};

function Avatar({ size = 9 }) {
  const sizeClass = AVATAR_SIZE_CLASSES[size] || AVATAR_SIZE_CLASSES[9];

  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-primary text-white`}
    >
      <UserIcon className={size >= 10 ? "size-5" : "size-4"} />
    </span>
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
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center gap-1.5 px-2 py-6"
        >
          <Avatar />
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar size={10} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user?.name ?? "User"}
            </p>
            {user?.email ? (
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            ) : null}
          </div>
        </div>

        <DropdownMenuSeparator />

        {USER_MENU_ITEMS.map(({ href, icon: Icon, label }) => (
          <DropdownMenuItem key={href} asChild>
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

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer gap-3 py-2.5 text-red-500"
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthButtonsInner({ layout = "public" }) {
  const { token, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const user = null;

  if (!token) {
    return (
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="ghost"
          className="hover:bg-transparent! cursor-pointer border"
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
        <Button asChild className="cursor-pointer" size="lg">
          <Link href="/signup">
            <Calendar />
            Book a Session
          </Link>
        </Button>
      </div>
    );
  }

  const isLight = resolvedTheme === "light" || !resolvedTheme;
  const isPublic = layout === "public";

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex items-center gap-3">
      <NotificationBell />
      {isPublic ? (
        <>
          <Button asChild className="cursor-pointer" size="lg" variant="outline">
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild className="cursor-pointer" size="lg">
            <Link href="/book-session">
              <Calendar />
              Book a Session
            </Link>
          </Button>
        </>
      ) : (
        <>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Link href="/settings">
              <Settings className="size-5" />
            </Link>
          </Button>
          <UserMenu
            user={user}
            onLogout={handleLogout}
            isLight={isLight}
            setTheme={setTheme}
          />
        </>
      )}
    </div>
  );
}

const AuthButtons = memo(AuthButtonsInner);

export default AuthButtons;
