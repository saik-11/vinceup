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
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SIDEBAR_GROUPS } from "@/config/navigation";
import { AnimatePresence, motion } from "framer-motion";
import vinceup_logo from "../../public/assets/vinceup_logo.svg";

// ── Animation variants ──

const itemVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, delay: i * 0.04, ease: "easeOut" },
  }),
};

const groupLabelVariant = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { setOpenMobile } = useSidebar();
  const isLoggedIn = !!isAuthenticated;
  
  // Close mobile sidebar drawer on every route change
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const isActive = (href) => (href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href));

  const handleLogout = () => {
    setOpenMobile(false);
    logout();
    router.push("/");
  };

  if (!isLoggedIn) return null;

  // Sequential index for staggered menu-item animation
  let itemIndex = 0;

  return (
    <AnimatePresence>
      {isLoggedIn && (
        <motion.div
          key="sidebar-wrapper"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "var(--sidebar-width, 16rem)", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="shrink-0 overflow-hidden hidden md:block"
        >
          <Sidebar className="top-16 h-[calc(100svh-4rem)]">
            {/*
              Mobile-only header: logo + close button.
              Uses CSS `md:hidden` so it only shows inside the Sheet drawer.
              On desktop, the Sidebar component hides this via its own `hidden md:block`.
            */}
            <SidebarHeader className="flex md:hidden flex-row items-center justify-between px-4 py-3 border-b border-border">
              <Link href="/dashboard" onClick={() => setOpenMobile(false)} className="shrink-0">
                <Image src={vinceup_logo} alt="VinceUp" loading="eager" className="w-28 h-auto" />
              </Link>
              <button
                type="button"
                onClick={() => setOpenMobile(false)}
                aria-label="Close sidebar"
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-5" />
              </button>
            </SidebarHeader>

            <SidebarContent className="px-3 pt-4 pb-2">
              {SIDEBAR_GROUPS.map((group) => (
                <SidebarGroup key={group.label} className="mb-1">
                  <motion.div variants={groupLabelVariant} initial="hidden" animate="visible">
                    <SidebarGroupLabel className={`text-xs font-semibold uppercase tracking-wider px-3 mb-1 ${group?.class || ""}`}>
                      {group.icon && <group.icon className="size-4 mr-1.5" />}
                      {group.label}
                    </SidebarGroupLabel>
                  </motion.div>

                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      const idx = itemIndex++;

                      return (
                        <SidebarMenuItem key={item.href}>
                          <motion.div custom={idx} variants={itemVariant} initial="hidden" animate="visible">
                            <SidebarMenuButton
                              asChild
                              data-active={active}
                              tooltip={item.label}
                              className={`
                                gap-3 h-10 rounded-lg font-medium
                                transition-all duration-150
                                text-muted-foreground hover:text-foreground
                                hover:bg-primary/8
                                data-[active=true]:bg-primary
                                data-[active=true]:text-primary-foreground
                                data-[active=true]:shadow-sm
                                data-[active=true]:hover:bg-primary/90
                              `}
                            >
                              <Link href={item.href}>
                                <Icon className="size-4.5 shrink-0" />
                                <span className="truncate">{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </motion.div>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>
              ))}
            </SidebarContent>

            <SidebarFooter className="px-3 pb-4 pt-2 border-t border-border">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="gap-3 h-10 rounded-lg cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="size-4.5" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </motion.div>
            </SidebarFooter>
          </Sidebar>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
