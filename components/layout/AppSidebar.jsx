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
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SIDEBAR_GROUPS } from "@/config/navigation";
import { AnimatePresence, motion } from "framer-motion";

const sidebarVariants = {
  hidden: {
    x: -260,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",

      when: "beforeChildren", // 👈 ensures order
      staggerChildren: 0.08, // 👈 ONLY here
      delayChildren: 0.15, // 👈 smooth delay
    },
  },
};

const stagger = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1, // reverse exit
    },
  },
};

const fadeSlideIn = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const titleAnimation = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
};

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, logout } = useAuth();
  const isLoggedIn = !!token;

  const isActive = (href) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  const renderMenu = (items) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.href);
      return (
        <SidebarMenuItem key={item.href}>
          <motion.div variants={titleAnimation}>
            <SidebarMenuButton
              asChild
              data-active={active}
              className={`
              gap-3 h-10 rounded-lg font-medium
              text-foreground hover:text-foreground
              data-[active=true]:bg-primary
              data-[active=true]:text-white
              data-[active=true]:hover:bg-primary/90
            `}
            >
              {isLoggedIn ? (
                <Link href={item.href}>
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-3 opacity-50">
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
              )}
            </SidebarMenuButton>
          </motion.div>
        </SidebarMenuItem>
      );
    });

  return (
    <AnimatePresence mode="wait">
      {isLoggedIn && (
        <motion.div
          key="sidebar"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Sidebar className="fixed left-0 top-20 h-[calc(100vh-5rem)] border-r bg-background">
            <SidebarContent className="px-2 pt-6">
              {SIDEBAR_GROUPS.map((group, groupIdx) => (
                <SidebarGroup key={group.label}>
                  <motion.div variants={fadeSlideIn}>
                    <SidebarGroupLabel className={group?.class || ''} >
                      {group.icon && <group.icon className="size-4" />}
                      {group.label}
                    </SidebarGroupLabel>
                  </motion.div>
                  <SidebarMenu>
                    {isLoggedIn ? renderMenu(group.items) : null}
                  </SidebarMenu>
                </SidebarGroup>
              ))}
            </SidebarContent>
            <SidebarFooter className="px-2 pb-6">
              {isLoggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
                >
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        <LogOut className="size-5" />
                        Logout
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </motion.div>
              )}
            </SidebarFooter>
          </Sidebar>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
