import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboardThemeClass, panelClass } from "@/components/dashboard/dashboard-shared";

export default function StatusPage({ badge = "In Progress", title, description, primaryHref = "/", primaryLabel = "Go Home", secondaryHref, secondaryLabel }) {
  return (
    <section className={cn(dashboardThemeClass, "min-h-[calc(100vh-5rem)] px-6 py-16")}>
      <div className={cn(panelClass, "mx-auto flex max-w-3xl flex-col items-center px-8 py-14 text-center")}>
        {/* Icon */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(124,58,237,0.1)] text-(--dashboard-purple) dark:bg-[rgba(167,139,250,0.15)]">
          <Clock3 className="h-6 w-6" />
        </div>

        {/* Badge */}
        <span className="rounded-full border border-[rgba(124,58,237,0.18)] bg-[rgba(124,58,237,0.06)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dashboard-purple)] dark:border-[rgba(167,139,250,0.22)] dark:bg-[rgba(124,58,237,0.12)]">
          {badge}
        </span>

        {/* Title */}
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--dashboard-text)] sm:text-4xl">{title}</h1>

        {/* Description */}
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--dashboard-muted)] sm:text-base">{description}</p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="cursor-pointer rounded-full bg-[linear-gradient(135deg,#7c3aed,#c026d3)] px-5 text-white shadow-[0_6px_16px_-6px_rgba(124,58,237,0.5)] transition-all duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)]"
          >
            <Link href={primaryHref}>
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {secondaryHref && secondaryLabel ? (
            <Button
              asChild
              variant="outline"
              className="cursor-pointer rounded-full border-[var(--dashboard-border-strong)] bg-[var(--dashboard-panel-strong)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-panel-muted)]"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
