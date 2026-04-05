import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <section
      className="min-h-full bg-[#F9F9FB] dark:bg-[#0B0B0F]"
      aria-label="Dashboard"
    >
      {/* Dot-grid
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(99,84,216,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      /> */}

      <div className="relative z-10 mx-auto md:px-6 md:py-16 px-10 py-20">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Welcome back, Vinny!
          </h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Book a Session to access our features
          </p>
        </header>

        {/* Card */}
        <Card className="rounded-2xl border border-[rgba(99,84,216,0.10)] bg-[#F0EFFE]/60 dark:bg-[#1A1A2E] shadow-none">
          <CardContent className="flex flex-col items-center justify-center px-8 py-20 text-center">
            
            {/* Icon */}
            <div
              aria-hidden="true"
              className="mb-6 flex h-18 w-18 items-center justify-center rounded-2xl bg-white dark:bg-[#111118] shadow-sm"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Icon</title>
                <circle cx="18" cy="18" r="15" stroke="#5C47D4" strokeWidth="1.6" strokeOpacity="0.25" />
                <circle cx="18" cy="18" r="10" stroke="#5C47D4" strokeWidth="1.6" strokeOpacity="0.45" />
                <circle cx="18" cy="18" r="5.5" stroke="#5C47D4" strokeWidth="1.6" strokeOpacity="0.75" />
                <circle cx="18" cy="18" r="2.2" fill="#5C47D4" />
              </svg>
            </div>

            {/* Text */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              No sessions yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Start your growth journey by booking your first mentorship session
            </p>

            {/* Button */}
            <Button className="mt-8 gap-2 rounded-lg bg-[#4B3CC7] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3D30B3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B3CC7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B0B0F]">
              Book Your First Session
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}