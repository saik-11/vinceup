import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Globe,
  HelpCircle,
  LayoutGrid,
  Link2,
  LogOut,
  Map as MapIcon,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserCircle,
} from "lucide-react";

// ─── Public navbar links ───
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mentor", label: "Mentor" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
];

// ─── Sidebar groups ───
export const SIDEBAR_GROUPS = [
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
    items: [
      { href: "/action-board", label: "Action Board", icon: ClipboardCheck },
      { href: "/clarity-capsule", label: "Clarity Capsule", icon: Link2 },
      { href: "/clarity-map", label: "Clarity Map", icon: MapIcon },
      { href: "/growth-meter", label: "Growth Meter", icon: TrendingUp },
    ],
    class: 'text-[#9333EA]'
  },
];

// ─── User dropdown menu items ───
export const USER_MENU_ITEMS = [
  { href: "/personal-details", icon: UserCircle, label: "Personal Details" },
  { href: "/purchase-history", icon: ShoppingBag, label: "Purchase History" },
  { href: "/", icon: Globe, label: "Go To Website" },
  { href: "/help", icon: HelpCircle, label: "Help" },
];

// ─── Pages that use "public" layout (no sidebar) ───
export const PUBLIC_PAGES = [
  "/",
  "/login",
  "/signup",
  "/mentor-signup",
  "/mentor",
  "/about",
  "/services",
  "/reset-password",
  "/forgot-password",
];