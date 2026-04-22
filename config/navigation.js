import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Globe,
  HelpCircle,
  LayoutGrid,
  Link2,
  Map as MapIcon,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserCircle,
  Users,
  BarChart2,
  DollarSign,
  BookMarked,
} from "lucide-react";

// ─── Public navbar links ───
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mentor", label: "Mentor" },
  { href: "/service", label: "Services" },
  { href: "/about", label: "About Us" },
];

// ─── Mentee sidebar groups ───────────────────────────────────────────────────
// Shown to users with role === "mentee" (or any unknown role as fallback).

const MENTEE_SIDEBAR_GROUPS = [
  {
    label: "Menu",
    icon: null,
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      { href: "/book-session", label: "Book Session", icon: BookOpen },
      { href: "/my-sessions", label: "My Sessions", icon: CalendarDays },
    ],
  },
  {
    label: "Vega AI Features",
    icon: Sparkles,
    class: "text-[#9333EA]",
    items: [
      { href: "/action-board", label: "Action Board", icon: ClipboardCheck },
      { href: "/clarity-capsule", label: "Clarity Capsule", icon: Link2 },
      { href: "/clarity-map", label: "Clarity Map", icon: MapIcon },
      { href: "/growth-meter", label: "Growth Meter", icon: TrendingUp },
    ],
  },
];

// ─── Mentor sidebar groups ────────────────────────────────────────────────────
// Shown exclusively to users with role === "mentor".

const MENTOR_SIDEBAR_GROUPS = [
  {
    label: "Menu",
    icon: null,
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      { href: "/mentor-calendar", label: "Calendar", icon: CalendarDays },
      { href: "/my-sessions", label: "Sessions", icon: BookOpen },
      { href: "/mentees", label: "Mentees", icon: Users },
    ],
  },
  {
    label: "Insights",
    icon: Sparkles,
    class: "text-[#9333EA]",
    items: [
      { href: "/action-board", label: "Analytics", icon: BarChart2 },
      { href: "/growth-meter", label: "Earnings", icon: DollarSign },
      { href: "/clarity-capsule", label: "Resources", icon: BookMarked },
    ],
  },
];

// ─── Role → groups registry ──────────────────────────────────────────────────
// Add new roles here without touching AppSidebar.

export const SIDEBAR_GROUPS_BY_ROLE = {
  mentor: MENTOR_SIDEBAR_GROUPS,
  mentee: MENTEE_SIDEBAR_GROUPS,
};

/** Fallback used when role is unknown or still loading. */
export const DEFAULT_SIDEBAR_GROUPS = MENTEE_SIDEBAR_GROUPS;

/**
 * Helper — returns the correct sidebar group array for a given role string.
 * @param {string|null} role
 */
export function getSidebarGroups(role) {
  return SIDEBAR_GROUPS_BY_ROLE[role] ?? DEFAULT_SIDEBAR_GROUPS;
}

// ─── Legacy export (kept for any file that still imports SIDEBAR_GROUPS) ─────
// Points to mentee groups so existing code doesn't break during migration.
export const SIDEBAR_GROUPS = MENTEE_SIDEBAR_GROUPS;

// ─── User dropdown menu items ───
export const USER_MENU_ITEMS = [
  { href: "/personal-details", icon: UserCircle, label: "Personal Details" },
  { href: "/purchase-history", icon: ShoppingBag, label: "Purchase History" },
  { href: "/", icon: Globe, label: "Go To Website" },
  { href: "/help", icon: HelpCircle, label: "Help" },
];

// ─── Pages that use "public" layout (no sidebar) ───
export const PUBLIC_PAGES = ["/", "/login", "/signup", "/mentor-signup", "/mentor", "/about", "/service", "/reset-password", "/forgot-password"];
