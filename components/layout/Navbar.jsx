"use client";
import Link from "next/link";
import { SidebarProvider } from "../ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import vinceup_logo from "../../public/assets/vinceup_logo.svg";
import Image from "next/image";
import { useState, useEffect } from "react";
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

const Navbar = ({ children }) => {
  const { pathname, layout, isPublic } = useLayout();
  const [hoveredHref, setHoveredHref] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change — derived from pathname, no effect needed
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col w-full bg-background text-foreground">
        <header className="w-full sticky top-0 inset-x-0 z-50 flex h-16 md:h-20 shrink-0 items-center justify-between border-b border-border px-3 sm:px-4 bg-background/80 backdrop-blur-xl isolate">
          <div className="font-bold shrink-0">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image src={vinceup_logo} alt="vinceup" loading="eager" className="w-28 sm:w-36 md:w-44 h-auto" />
            </Link>
          </div>

          {/* Desktop nav */}
          <AnimatePresence mode="wait" initial={false}>
            {isPublic && (
              <motion.ul
                key="nav-links"
                className="hidden md:flex items-center gap-2 list-none"
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
                        isActive(link.href) ? "text-primary font-bold" : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {(hoveredHref ?? pathname) === link.href || (!hoveredHref && isActive(link.href)) ? (
                      <motion.span
                        layoutId="underline"
                        className="absolute left-0 bottom-0 h-0.5 w-full bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    ) : null}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-4">
              <AuthButtons layout={layout} />
            </div>
            {!isPublic && (
              <div className="flex md:hidden items-center gap-2">
                <AuthButtons layout={layout} />
              </div>
            )}
            {isPublic && (
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-md hover:bg-muted text-foreground"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            )}
          </div>

          {/* Mobile menu panel */}
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
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      isActive(link.href) ? "text-primary font-bold bg-muted" : "text-foreground hover:text-primary hover:bg-muted"
                    }`}
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

        <main className="flex flex-row flex-1 relative bg-background">
          {!isPublic && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 257 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="shrink-0 overflow-hidden hidden md:block"
            >
              <AppSidebar />
            </motion.div>
          )}
          <section className="grow min-w-0 bg-background">{children}</section>
        </main>
        {isPublic && <Footer />}
      </div>
    </SidebarProvider>
  );
};

export default Navbar;
