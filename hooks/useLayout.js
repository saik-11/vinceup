"use client";
import { usePathname } from "next/navigation";
import { PUBLIC_PAGES } from "@/config/navigation";

export function useLayout() {
  const pathname = usePathname();

  const layout = (() => {
    // if (!pathname) return "public";
    return PUBLIC_PAGES.some((route) =>
      route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(route + "/")
    )
      ? "public"
      : "private";
  })();

  return { pathname, layout, isPublic: layout === "public" };
}