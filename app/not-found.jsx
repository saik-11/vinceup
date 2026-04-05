"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VINCEUP_NAV_PREV_KEY } from "@/components/layout/NavigationHistory";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (typeof window === "undefined") return;

    try {
      const prev = sessionStorage.getItem(VINCEUP_NAV_PREV_KEY);
      if (prev && prev !== pathname) {
        router.replace(prev);
        return;
      }
    } catch {
      // ignore
    }

    // No stored in-app path: try browser history, then home.
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace("/");
  };

  return (
    <div className="h-full w-full flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">
        The page {`you're`} looking for {`doesn't`} exist.
      </p>

      <Button size="lg" className="group cursor-pointer" onClick={handleBack}>
        <ArrowLeft className="transition-transform duration-300 group-hover:scale-125" />
        Go Back
      </Button>
    </div>
  );
}
