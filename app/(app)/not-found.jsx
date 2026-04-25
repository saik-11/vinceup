"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="h-full w-full flex flex-1 flex-col items-center justify-center gap-4 text-center px-4 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        404 — Page Not Found
      </p>
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Oops, wrong turn.
      </h1>
      <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <Button
          onClick={handleBack}
          size="lg"
          className="group cursor-pointer gap-2"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
