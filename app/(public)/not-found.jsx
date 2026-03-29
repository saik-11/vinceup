// app/not-found.jsx

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-full w-full flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Link href="/">
        <Button size="lg" className="group cursor-pointer">
          <ArrowLeft className="transition-transform duration-300 group-hover:scale-125" />
          Go Home
        </Button>
      </Link>
    </div>
  );
}
