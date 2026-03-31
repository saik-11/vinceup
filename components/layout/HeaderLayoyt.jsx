"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import vinceup_logo from "../../public/assets/vinceup_logo.png";
import AuthButtons from "../auth/AuthButtons";
import { Button } from "../ui/button";
import Footer from "./Footer";

const HeaderLayout = ({ children }) => {
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

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };
  return (
    <div className="relative flex h-screen w-full flex-col">
      {/* Top Navbar — full width, always on top */}
      <header className="sticky top-0 inset-0 z-50 flex h-20 shrink-0 items-center justify-between border-b px-4 backdrop-blur-lg">
        <div className="font-bold">
          <Link href={"/"}>
            <Image src={vinceup_logo} alt="vinceup" loading="eager" />
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
                    : "text-muted-foreground hover:text-foreground border-b-white"
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
      <section className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </section>
      <Footer />
    </div>
  );
};

export default HeaderLayout;
