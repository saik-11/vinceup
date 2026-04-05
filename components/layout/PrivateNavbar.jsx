"use client";

import Image from "next/image";
import Link from "next/link";
import { SidebarProvider } from "@/components/ui/sidebar";
import vinceup_logo from "../../public/assets/vinceup_logo.png";
import AuthButtons from "../auth/AuthButtons";
import AppSidebar from "./AppSidebar";

const PrivateNavbar = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full flex-col">
        {/* ── Top Navbar ── */}
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur-lg">
          <div className="font-bold">
            <Link href="/dashboard">
              <Image src={vinceup_logo} alt="vinceup" loading="eager" />
            </Link>
          </div>

          <AuthButtons layout="private" />
        </header>

        {/* ── Below navbar: sidebar + content ── */}
        <section className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </section>
      </div>
    </SidebarProvider>
  );
};

export default PrivateNavbar;
