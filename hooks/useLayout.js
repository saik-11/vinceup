"use client";
import { usePathname } from "next/navigation";
import { PUBLIC_PAGES } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useLayout() {
  const pathname = usePathname();
  
  let isAuthenticated = false;
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    // Graceful fallback if called outside provider
  }

  const layout = (() => {
    if (!pathname) return "public";
    
    // Explicit public pages
    const isExplicitlyPublic = PUBLIC_PAGES.some((route) => 
      route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(route + "/")
    );
    
    if (isExplicitlyPublic) return "public";

    // If it's not a known public page, and the user is NOT authenticated, fallback to public layout (e.g. for 404s)
    if (!isAuthenticated) return "public";

    return "private";
  })();

  return { pathname, layout, isPublic: layout === "public" };
}
