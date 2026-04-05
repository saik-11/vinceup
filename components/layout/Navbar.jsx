"use client";
import Link from "next/link";
import { SidebarProvider } from "../ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import vinceup_logo from "../../public/assets/vinceup_logo.svg";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";
import dynamic from "next/dynamic";
import AuthButtons from "./AuthButtons";
import { NAV_LINKS } from "@/config/navigation";

const AppSidebar = dynamic(() => import("./AppSidebar"), { ssr: false });

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
const fadeSlideUp = {
  hidden: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: "easeIn" },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
const Navbar = ({ children }) => {
  const { pathname, layout, isPublic } = useLayout();
  const [hoveredHref, setHoveredHref] = useState(null);

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col">
        <header className="w-screen sticky top-0 inset-0 z-50 flex h-20 shrink-0 items-center justify-between border-b px-4 backdrop-blur-lg">
          <motion.div
            className="font-bold"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Link href="/">
              <Image
                src={vinceup_logo}
                alt="vinceup"
                loading="eager"
                className="size-44"
              />
            </Link>
          </motion.div>
          <AnimatePresence mode="wait" initial={false}>
            {isPublic && (
              <motion.ul
                key="nav-links"
                layout
                className="flex items-center gap-2 list-none"
                variants={stagger}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {NAV_LINKS.map((link) => (
                  <motion.li
                    key={link.href}
                    className="relative py-2"
                    variants={fadeSlideUp}
                    exit="hidden"
                    onMouseEnter={() => setHoveredHref(link.href)}
                    onMouseLeave={() => setHoveredHref(null)}
                  >
                    <Link
                      href={link.href}
                      className={`transition-colors p-3 py-3 ${
                        isActive(link.href)
                          ? "text-primary font-bold"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {(hoveredHref ?? pathname) === link.href ||
                    (!hoveredHref && isActive(link.href)) ? (
                      <motion.span
                        layoutId="underline"
                        className="absolute left-0 bottom-0 h-0.5 w-full bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    ) : null}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            <AuthButtons layout={layout} />
          </motion.div>
        </header>

        <motion.main layout className="flex flex-row relative">
          <motion.div
            layout
            animate={{ width: isPublic ? 0 : 260 }}
            className="shrink-0 overflow-hidden"
          >
            {!isPublic && <AppSidebar />}
          </motion.div>

          <motion.section layout className="grow">
            {children}
          </motion.section>
        </motion.main>
      </div>
    </SidebarProvider>
  );
};

export default Navbar;
