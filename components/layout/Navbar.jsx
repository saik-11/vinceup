"use client";
import Link from "next/link";
import { SidebarProvider, useSidebar } from "../ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import vinceup_logo from "../../public/assets/vinceup_logo.svg";
import NextImage from "next/image";
import { useState } from "react";
import { useLayout } from "@/hooks/useLayout";
import dynamic from "next/dynamic";
import { Menu, X } from "lucide-react";
import AuthButtons from "./AuthButtons";
import { NAV_LINKS } from "@/config/navigation";
import Footer from "./Footer";

const AppSidebar = dynamic(() => import("./AppSidebar"), { ssr: false });

const stagger = {
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  hidden: { opacity: 0, transition: { staggerChildren: 0.08, staggerDirection: -1 } },
};
const fadeSlideUp = {
  hidden: { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/**
 * Inner layout shell — must live inside <SidebarProvider> so it can call useSidebar().
 * Handles the mobile sidebar toggle for authenticated (non-public) routes.
 */
function NavbarInner({ children }) {
  const { pathname, layout, isPublic } = useLayout();
  const { setOpenMobile } = useSidebar();
  const [hoveredHref, setHoveredHref] = useState(null);
  // Store the pathname at which the menu was opened instead of a boolean.
  // mobileOpen derives to true only when the stored pathname matches the
  // current one — no useEffect needed; route changes close the menu for free.
  const [menuOpenPathname, setMenuOpenPathname] = useState(null);
  const mobileOpen = menuOpenPathname === pathname;

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex min-h-svh w-full flex-col text-foreground">
      <header className="w-full sticky top-0 inset-x-0 z-50 flex h-16 md:h-20 shrink-0 items-center justify-between border-b border-border px-3 sm:px-4 bg-background/80 backdrop-blur-xl isolate">
        <div className="font-bold shrink-0">
          <Link href="/" onClick={() => setMenuOpenPathname(null)}>
            <NextImage src={vinceup_logo} alt="vinceup" loading="eager" className="w-28 sm:w-36 md:w-44 h-auto" />
          </Link>
        </div>

        {/* Desktop nav — public pages only */}
        <AnimatePresence mode="wait" initial={false}>
          {isPublic && (
            <motion.ul key="nav-links" className="hidden md:flex items-center gap-2 list-none" variants={stagger} initial="hidden" animate="visible" exit="hidden">
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} className="relative py-2" variants={fadeSlideUp} exit="hidden" onMouseEnter={() => setHoveredHref(link.href)} onMouseLeave={() => setHoveredHref(null)}>
                  <Link href={link.href} className={`transition-colors p-3 py-3 ${isActive(link.href) ? "text-primary font-bold" : "text-foreground hover:text-primary"}`}>
                    {link.label}
                  </Link>
                  {(hoveredHref ?? pathname) === link.href || (!hoveredHref && isActive(link.href)) ? (
                    <motion.span layoutId="underline" className="absolute left-0 bottom-0 h-0.5 w-full bg-primary" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                  ) : null}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Auth buttons — always visible on desktop */}
          <div className="hidden md:flex items-center gap-4">
            <AuthButtons layout={layout} />
          </div>

          {/* Auth buttons — visible on mobile for authenticated routes */}
          {!isPublic && (
            <div className="flex md:hidden items-center gap-2">
              <AuthButtons layout={layout} />
            </div>
          )}

          {/* Mobile hamburger — public site nav toggle */}
          {isPublic && (
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMenuOpenPathname(mobileOpen ? null : pathname)}
              className="md:hidden p-2 rounded-md hover:bg-muted text-foreground"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}

          {/* Mobile hamburger — authenticated sidebar Sheet trigger */}
          {!isPublic && (
            <button type="button" aria-label="Open navigation menu" onClick={() => setOpenMobile(true)} className="md:hidden p-2 rounded-md hover:bg-muted text-foreground">
              <Menu className="size-5" />
            </button>
          )}
        </div>

        {/* Mobile dropdown — public site nav */}
        <AnimatePresence>
          {isPublic && mobileOpen && (
            <motion.div
              key="mobile-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 border-b border-border bg-background/95 backdrop-blur-lg px-4 py-4 flex flex-col gap-2"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpenPathname(null)}
                  className={`px-3 py-2 rounded-md transition-colors ${isActive(link.href) ? "text-primary font-bold bg-muted" : "text-foreground hover:text-primary hover:bg-muted"}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-2 flex flex-col gap-2">
                <AuthButtons layout={layout} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative flex flex-1 flex-row">
        {/* Desktop sidebar — static inline panel, hidden on mobile */}
        {!isPublic && (
          <motion.div initial={{ width: 257 }} animate={{ width: 257 }} transition={{ duration: 0.3, ease: "easeOut" }} className="shrink-0 overflow-hidden hidden md:block">
            <AppSidebar />
          </motion.div>
        )}

        {/*
          Mobile sidebar — rendered outside the desktop motion wrapper.
          AppSidebar uses useSidebar().openMobile + a Sheet to render the
          drawer, so it must be mounted even when the inline panel is hidden.
        */}
        {!isPublic && (
          <div className="md:hidden">
            <AppSidebar />
          </div>
        )}

        <section className="grow min-w-0">{children}</section>
      </main>

      {isPublic && <Footer />}
    </div>
  );
}

const Navbar = ({ children }) => (
  <SidebarProvider defaultOpen={true}>
    <NavbarInner>{children}</NavbarInner>
  </SidebarProvider>
);

export default Navbar;
