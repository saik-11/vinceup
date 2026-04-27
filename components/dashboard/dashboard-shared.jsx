"use client";

import { ChevronRight, Globe, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── CSS custom-property theme (light + dark) ─────────────────────────────────
// Single source of truth consumed by both CareerGrowthDashboard and MentorDashboard.

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
  "overflow-visible rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] text-[var(--dashboard-text)] shadow-[var(--dashboard-shadow)] ring-0 backdrop-blur-xl";

/** Hover animation applied on top of panelClass for interactive lift effect. */
export const interactivePanelClass = "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--dashboard-shadow-hover)]";

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

export const statAccentStyles = {
  blue: {
    iconWrap: "bg-[linear-gradient(135deg,rgba(88,110,255,0.16),rgba(60,130,246,0.22))] text-[var(--dashboard-blue)] dark:bg-[linear-gradient(135deg,rgba(88,110,255,0.22),rgba(60,130,246,0.28))]",
    hoverBorder: "hover:border-[rgba(59,130,246,0.22)] dark:hover:border-[rgba(96,165,250,0.32)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(59,130,246,0.34)] dark:hover:shadow-[0_24px_60px_-32px_rgba(37,99,235,0.34)]",
    badge: "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/12 dark:text-blue-200",
  },
  green: {
    iconWrap: "bg-[linear-gradient(135deg,rgba(18,183,106,0.14),rgba(5,150,105,0.22))] text-[var(--dashboard-green)] dark:bg-[linear-gradient(135deg,rgba(18,183,106,0.22),rgba(5,150,105,0.3))]",
    hoverBorder: "hover:border-[rgba(18,183,106,0.22)] dark:hover:border-[rgba(52,211,153,0.32)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(18,183,106,0.3)] dark:hover:shadow-[0_24px_60px_-32px_rgba(5,150,105,0.34)]",
    badge: "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/12 dark:text-emerald-200",
  },
  purple: {
    iconWrap: "bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(192,38,211,0.22))] text-[var(--dashboard-purple)] dark:bg-[linear-gradient(135deg,rgba(139,92,246,0.24),rgba(217,70,239,0.28))]",
    hoverBorder: "hover:border-[rgba(124,58,237,0.22)] dark:hover:border-[rgba(167,139,250,0.32)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(124,58,237,0.32)] dark:hover:shadow-[0_24px_60px_-32px_rgba(124,58,237,0.36)]",
    badge: "border-violet-200/80 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/12 dark:text-violet-200",
  },
  orange: {
    iconWrap: "bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(234,88,12,0.22))] text-[var(--dashboard-orange)] dark:bg-[linear-gradient(135deg,rgba(251,146,60,0.24),rgba(249,115,22,0.28))]",
    hoverBorder: "hover:border-[rgba(249,115,22,0.24)] dark:hover:border-[rgba(251,146,60,0.34)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(249,115,22,0.34)] dark:hover:shadow-[0_24px_60px_-32px_rgba(234,88,12,0.34)]",
    badge: "border-orange-200/80 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/12 dark:text-orange-200",
  },
  teal: {
    iconWrap: "bg-[linear-gradient(135deg,rgba(8,145,178,0.14),rgba(14,116,144,0.22))] text-[var(--dashboard-teal)] dark:bg-[linear-gradient(135deg,rgba(6,182,212,0.22),rgba(8,145,178,0.3))]",
    hoverBorder: "hover:border-[rgba(8,145,178,0.22)] dark:hover:border-[rgba(34,211,238,0.32)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(8,145,178,0.3)] dark:hover:shadow-[0_24px_60px_-32px_rgba(6,182,212,0.3)]",
    badge: "border-cyan-200/80 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/12 dark:text-cyan-200",
  },
};

// ─── Shared Components ────────────────────────────────────────────────────────

/**
 * Page-level shell — sets the CSS-variable theme and background gradient.
 * Both CareerGrowthDashboard and MentorDashboard wrap their content in this.
 */
export function DashboardShell({ children, ariaLabel = "Dashboard", maxWidth = "max-w-6xl" }) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        dashboardThemeClass,
        "bg-background",
        "min-h-[calc(100vh-64px)] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.025)_0%,transparent_55%),linear-gradient(180deg,#fafafa_0%,#f8fafc_100%)] px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8",
        "dark:bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.08),transparent_24%),linear-gradient(180deg,var(--dashboard-bg)_0%,var(--dashboard-bg-bottom)_100%)]",
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

/**
 * Reusable dashboard header across mentee and mentor dashboards
 */
export function DashboardHeader({ heading, subheading, badge, timezone, highlight }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-(--dashboard-text) sm:text-3xl">{heading}</h1>
          {badge && badge}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <p className={cn(metaTextClass, "text-[15px]")}>{subheading}</p>
          {timezone && (
            <Badge
              variant="outline"
              className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold text-(--dashboard-subtle) rounded-full shadow-none border-(--dashboard-border) bg-(--dashboard-panel-muted) py-0 h-5 px-2.5 tracking-wider"
            >
              <Globe className="mr-1.5 size-3 opacity-70" />
              {timezone.replace("_", " ")}
            </Badge>
          )}
        </div>
      </div>

      {/* Right: VEGA highlight pill */}
      {highlight && (
        <div className="inline-flex shrink-0 items-center gap-2.5 rounded-[20px] border border-[rgba(124,58,237,0.18)] bg-[rgba(124,58,237,0.06)] px-4 py-2.5 shadow-[0_2px_8px_-3px_rgba(124,58,237,0.12)] dark:border-[rgba(167,139,250,0.22)] dark:bg-[rgba(124,58,237,0.12)]">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_6px_14px_-4px_rgba(124,58,237,0.55)]">
            <Sparkles className="size-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-(--dashboard-purple)">{highlight.label ?? "VEGA Weekly Highlight"}</p>
            <p className="text-xs font-medium text-(--dashboard-muted)">{highlight.value}</p>
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Unified Metric Card used by StatsGrid and KpiStatsGrid
 */
export function MetricCard({ stat, icon: Icon, accentStyles }) {
  return (
    <div className="min-w-0 h-full">
      <div className={cn(panelClass, interactivePanelClass, accentStyles.hoverBorder, accentStyles.hoverShadow, "h-full px-0 py-0 flex flex-col rounded-[24px]")}>
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 lg:p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className={cn("flex size-12 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]", accentStyles.iconWrap)}>
                <Icon className="size-5" />
              </div>
              {stat.badge && <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-0", accentStyles.badge)}>{stat.badge}</Badge>}
            </div>

            <div className="space-y-1 mt-1">
              <p className={cn("text-[2rem] font-bold leading-none tracking-[-0.04em] text-(--dashboard-text)", stat.valueClass)}>{stat.value}</p>
              <p className="text-sm font-medium leading-6 text-(--dashboard-muted)">{stat.label}</p>
              {stat.helper && <p className="text-sm leading-6 text-(--dashboard-subtle)">{stat.helper}</p>}
            </div>
          </div>

          {stat.action && <div className="mt-5 pt-3 border-t border-(--dashboard-border) flex items-center">{stat.action}</div>}
        </div>
      </div>
    </div>
  );
}
