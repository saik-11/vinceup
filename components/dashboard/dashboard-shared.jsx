"use client";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── CSS custom-property theme (light + dark) ─────────────────────────────────
// Single source of truth consumed by both career-growth-dashboard and MentorDashboard.

export const dashboardThemeClass = cn(
  "[--dashboard-bg:#f4f7fb]",
  "[--dashboard-bg-bottom:#edf2ff]",
  "[--dashboard-panel:rgba(255,255,255,0.82)]",
  "[--dashboard-panel-strong:#ffffff]",
  "[--dashboard-panel-muted:#f8fafc]",
  "[--dashboard-border:rgba(15,23,42,0.08)]",
  "[--dashboard-border-strong:rgba(15,23,42,0.12)]",
  "[--dashboard-text:#0f172a]",
  "[--dashboard-muted:#475569]",
  "[--dashboard-subtle:#64748b]",
  "[--dashboard-shadow:0_18px_48px_-30px_rgba(15,23,42,0.18)]",
  "[--dashboard-shadow-hover:0_24px_60px_-32px_rgba(15,23,42,0.22)]",
  "[--dashboard-inner-shadow:0_14px_32px_-28px_rgba(15,23,42,0.34)]",
  "[--dashboard-purple:#7c3aed]",
  "[--dashboard-blue:#3b82f6]",
  "[--dashboard-green:#12b76a]",
  "[--dashboard-orange:#f97316]",
  "[--dashboard-amber:#f59e0b]",
  "[--dashboard-teal:#0891b2]",
  "dark:[--dashboard-bg:#0b1120]",
  "dark:[--dashboard-bg-bottom:#080d18]",
  "dark:[--dashboard-panel:rgba(15,23,42,0.84)]",
  "dark:[--dashboard-panel-strong:#111827]",
  "dark:[--dashboard-panel-muted:#0f172a]",
  "dark:[--dashboard-border:rgba(148,163,184,0.18)]",
  "dark:[--dashboard-border-strong:rgba(148,163,184,0.24)]",
  "dark:[--dashboard-text:#f8fafc]",
  "dark:[--dashboard-muted:#cbd5e1]",
  "dark:[--dashboard-subtle:#94a3b8]",
  "dark:[--dashboard-shadow:0_22px_56px_-32px_rgba(2,8,23,0.72)]",
  "dark:[--dashboard-shadow-hover:0_30px_72px_-34px_rgba(2,8,23,0.82)]",
  "dark:[--dashboard-inner-shadow:0_16px_36px_-30px_rgba(2,8,23,0.68)]",
);

// ─── Shared style constants ───────────────────────────────────────────────────

/** Glassmorphic panel card used as the outer wrapper of every section. */
export const panelClass =
  "overflow-visible rounded-[24px] border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] text-[var(--dashboard-text)] shadow-[var(--dashboard-shadow)] ring-0 backdrop-blur-xl";

/** Hover animation applied on top of panelClass for interactive lift effect. */
export const interactivePanelClass =
  "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--dashboard-shadow-hover)]";

/** Inner sub-cards (sessions, tasks, insights) inside a panel. */
export const subCardClass =
  "rounded-[20px] border border-[var(--dashboard-border)] bg-[var(--dashboard-panel-strong)] shadow-[var(--dashboard-inner-shadow)] transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out";

/** Ghost action button at the top-right of a section heading. */
export const sectionActionClass =
  "h-9 cursor-pointer shrink-0 rounded-full px-3 text-sm font-medium text-[var(--dashboard-purple)] hover:bg-[var(--dashboard-panel-muted)] hover:text-[var(--dashboard-purple)] dark:hover:bg-white/6";

/** Small muted caption / description below a heading. */
export const metaTextClass = "text-sm leading-6 text-[var(--dashboard-subtle)]";

/** Primary section / card heading. */
export const sectionTitleClass = "text-xl font-semibold tracking-[-0.03em] text-[var(--dashboard-text)]";

// ─── Shared Components ────────────────────────────────────────────────────────

/**
 * Page-level shell — sets the CSS-variable theme and background gradient.
 * Both career-growth-dashboard and MentorDashboard wrap their content in this.
 */
export function DashboardShell({ children, ariaLabel = "Dashboard", maxWidth = "max-w-350" }) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        dashboardThemeClass,
        "min-h-full bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.11),transparent_26%),linear-gradient(180deg,var(--dashboard-bg)_0%,var(--dashboard-bg-bottom)_100%)] px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8",
        "dark:bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_24%),linear-gradient(180deg,var(--dashboard-bg)_0%,var(--dashboard-bg-bottom)_100%)]",
      )}
    >
      <div className={cn("mx-auto flex w-full flex-col gap-6", maxWidth)}>{children}</div>
    </section>
  );
}

/**
 * Reusable section heading with optional action button.
 * Used identically in both dashboards.
 */
export function SectionHeading({ title, description, actionLabel, actionHref, onAction }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className={sectionTitleClass}>{title}</h2>
        {description ? <p className={metaTextClass}>{description}</p> : null}
      </div>

      {actionLabel ? (
        <Button asChild={!!actionHref} variant="ghost" className={sectionActionClass} onClick={onAction}>
          {actionHref ? (
            <a href={actionHref}>
              {actionLabel}
              <ChevronRight className="size-4" />
            </a>
          ) : (
            <>
              {actionLabel}
              <ChevronRight className="size-4" />
            </>
          )}
        </Button>
      ) : null}
    </div>
  );
}
