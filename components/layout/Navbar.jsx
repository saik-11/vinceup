"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import vinceup_logo from "../../public/assets/vinceup_logo.svg";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AuthButtons from "./AuthButtons";

const Navbar = ({ children }) => {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = useState(null);
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mentor", label: "Mentor" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
  ];
    const isActive = (href) => {
    if (typeof pathname !== "string") return false;
    if (href === "/dashboard") {return pathname === "/dashboard";}
    return pathname.startsWith(href);
  };
  return (
    <SidebarProvider>
      <div className="flex flex-col">
        <header className="w-screen sticky top-0 inset-0 z-50 flex h-20 shrink-0 items-center justify-between border-b px-4 backdrop-blur-lg">
          <div className="font-bold">
            <Link href={"/"}>
              <Image src={vinceup_logo} alt="vinceup" loading="eager" className="size-44" />
            </Link>
          </div>
          <ul className="flex items-center gap-2 list-none">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className="relative py-2"
                onMouseEnter={() => setHoveredHref(link.href)} // ← moved here
                onMouseLeave={() => setHoveredHref(null)} // ← moved here
              >
                <Link
                  href={link.href}
                  className={`transition-colors p-3 py-3   ${
                    isActive(link.href)
                      ? "text-primary font-bold"
                      : "text-[#0A0A0A] hover:text-foreground border-b-white"
                  }`}
                >
                  {link.label}
                </Link>

                {(hoveredHref ?? pathname) === link.href ||
                (!hoveredHref && isActive(link.href)) ? (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 bottom-0 h-0.5 w-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                ) : null}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <AuthButtons />
            <Button asChild className="cursor-pointer" size="lg">
              <Link href="/book-session">
                <Calendar />
                Book a Session
              </Link>
            </Button>
          </div>
        </header>
        <main className="flex flex-row min-h-[calc(100%-4rem)]!">
          <AppSidebar />
          <section className="grow" >{children}</section>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Navbar;
