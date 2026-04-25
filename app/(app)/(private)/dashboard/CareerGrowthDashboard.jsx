"use client";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  CircleAlert,
  Clock3,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRoundSearch,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

import {
  dashboardThemeClass,
  DashboardShell,
  DashboardHeader,
  interactivePanelClass,
  metaTextClass,
  panelClass,
  sectionActionClass,
  sectionTitleClass,
  SectionHeading,
  statAccentStyles,
  MetricCard,
  subCardClass,
} from "@/components/dashboard/dashboard-shared";



const actionIcons = {
  mentor: UserRoundSearch,
  roadmap: LayoutDashboard,
  profile: ShieldCheck,
  admin: BriefcaseBusiness,
};

const statIcons = {
  calendar: CalendarDays,
  check: CheckCheck,
  brain: BrainCircuit,
  trend: TrendingUp,
};

const insightIcons = [Target, TrendingUp, Sparkles];

const priorityTone = {
  high: "border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/12 dark:text-rose-200",
  medium: "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/12 dark:text-amber-200",
  low: "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/12 dark:text-emerald-200",
};

// dashboardThemeClass, panelClass, interactivePanelClass, subCardClass,
// sectionActionClass, metaTextClass, sectionTitleClass — imported from dashboard-shared.jsx

function formatMetric(stat) {
  if (stat?.value == null) {
    return "--";
  }

  if (stat.format === "percentage") {
    return `${stat.value}%`;
  }

  return stat.total == null ? `${stat.value}` : `${stat.value}/${stat.total}`;
}

function getInitials(name) {
  if (!name) {
    return "VU";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// DashboardShell — imported from dashboard-shared.jsx

function StatsGrid({ stats }) {
  if (!stats) return null;

  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Progress stats">
      {stats.map((stat) => {
        const Icon = statIcons[stat.icon] ?? CheckCheck;
        const accentStyles = statAccentStyles[stat.accent] ?? statAccentStyles.blue;
        
        // Adapt formatMetric output to what MetricCard expects
        const displayValue = formatMetric(stat);

        return (
          <li key={stat.id} className="min-w-0 h-full">
            <MetricCard 
              stat={{...stat, value: displayValue}} 
              icon={Icon} 
              accentStyles={accentStyles} 
            />
          </li>
        );
      })}
    </ul>
  );
}

// SectionHeading — imported from dashboard-shared.jsx

function EmptyBlock({ icon: Icon, title, description, ctaLabel, ctaHref }) {
  return (
    <Empty className="rounded-[20px] border border-dashed border-(--dashboard-border-strong) bg-(--dashboard-panel-muted) px-6 py-10 text-(--dashboard-text)">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-(--dashboard-panel-strong) text-(--dashboard-purple)">
          <Icon className="size-5" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="text-(--dashboard-subtle)">{description}</EmptyDescription>
      </EmptyHeader>

      {ctaLabel && ctaHref ? (
        <Button asChild className="h-11 rounded-full px-5">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      ) : null}
    </Empty>
  );
}

function SessionsCard({ sessions }) {
  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <SectionHeading title="Upcoming Sessions" description="Keep your coaching cadence tight and prep before each call." actionLabel="View all" actionHref="/my-sessions" />

        {sessions.length ? (
          <ul className="space-y-3" aria-label="Upcoming sessions">
            {sessions.map((session) => (
              <li key={session.id}>
                <div
                  className={cn(
                    subCardClass,
                    "flex flex-col gap-4 p-4 hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_18px_46px_-30px_rgba(124,58,237,0.18)] dark:hover:border-[rgba(167,139,250,0.24)] sm:p-5 lg:flex-row lg:items-start lg:justify-between",
                  )}
                >
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#7552ff,#8b5cf6)] text-white shadow-[0_10px_24px_-18px_rgba(117,82,255,0.9)]">
                      <CalendarDays className="size-5" />
                    </div>

                    <div className="min-w-0 space-y-2">
                      <h3 className="text-lg font-semibold leading-7 tracking-[-0.03em] text-(--dashboard-text)" title={session.title ?? "Session details pending"}>
                        {session.title ?? "Session details pending"}
                      </h3>
                      <p className="text-sm leading-6 text-(--dashboard-muted)" title={session.mentorName ?? "Mentor to be assigned"}>
                        with {session.mentorName ?? "Mentor to be assigned"}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-6 text-(--dashboard-subtle)">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-4" />
                          {session.date ?? "Date TBD"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="size-4" />
                          {session.time ?? "Time TBD"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="h-11 w-full shrink-0 rounded-full bg-[linear-gradient(135deg,#7c3aed,#c026d3)] px-5 text-white shadow-[0_16px_32px_-22px_rgba(168,85,247,0.66)] transition-all duration-200 hover:opacity-95 sm:w-auto"
                  >
                    <Link href={session.prepHref ?? "/clarity-capsule"}>
                      <Sparkles className="size-4" />
                      Prep with VEGA
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyBlock
            icon={CalendarDays}
            title="No upcoming sessions"
            description="Your next coaching session will appear here once it is booked."
            ctaLabel="Book another session"
            ctaHref="/book-session"
          />
        )}

        <Button
          asChild
          className="h-11 w-full rounded-[16px] bg-[linear-gradient(135deg,#5b52f2,#4f46e5)] text-sm font-medium text-white shadow-[0_18px_40px_-24px_rgba(79,70,229,0.72)] transition-all duration-200 hover:opacity-95"
        >
          <Link href="/book-session">
            Book Another Session
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function TasksCard({ tasks }) {
  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <SectionHeading title="Priority Tasks" description="Action items that will move your job search forward this week." actionLabel="View all" actionHref="/action-board" />

        {tasks.length ? (
          <ul className="space-y-3" aria-label="Priority tasks">
            {tasks.map((task) => (
              <li key={task.id}>
                <div className={cn(subCardClass, "flex items-start justify-between gap-3 p-4 hover:border-(--dashboard-border-strong) hover:-translate-y-0.5 sm:p-5")}>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium leading-7 text-(--dashboard-text)" title={task.title ?? "Task details pending"}>
                      {task.title ?? "Task details pending"}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm leading-6 text-(--dashboard-subtle)">
                      <Badge className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold ring-0", priorityTone[task.priority ?? "low"])}>{task.priority ?? "low"}</Badge>
                      <span>Due {task.dueDate ?? "TBD"}</span>
                    </div>
                  </div>

                  <CheckCheck className={cn("mt-0.5 size-5 shrink-0", task.status === "done" ? "text-emerald-500 dark:text-emerald-300" : "text-slate-300 dark:text-slate-600")} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyBlock
            icon={Target}
            title="No tasks in focus"
            description="Once your coach assigns next steps, your priority list will surface here."
            ctaLabel="Open action board"
            ctaHref="/action-board"
          />
        )}
      </CardContent>
    </Card>
  );
}

function VegaInsightsCard({ insights }) {
  return (
    <Card className="overflow-hidden rounded-[24px] border-0 bg-[linear-gradient(180deg,#7c3aed_0%,#b832e0_100%)] px-0 py-0 text-white shadow-[0_28px_72px_-34px_rgba(124,58,237,0.82)] ring-0 dark:shadow-[0_30px_80px_-36px_rgba(91,33,182,0.88)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_42%)]"
      />
      <CardContent className="relative space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-[16px] bg-white/14 ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">VEGA Insights</h2>
            <p className="text-sm leading-6 text-white/78">AI guidance tuned to your coaching momentum</p>
          </div>
        </div>

        <ul className="space-y-3" aria-label="VEGA insights">
          {insights.map((insight, index) => {
            const InsightIcon = insightIcons[index] ?? insightIcons[insightIcons.length - 1];

            return (
              <li key={insight.id}>
                <div className="rounded-[20px] border border-white/12 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-sm transition-colors duration-200 hover:bg-white/12">
                  <div className="mb-2 flex items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
                    <span className="flex size-7 items-center justify-center rounded-full bg-white/12">
                      <InsightIcon className="size-4" />
                    </span>
                    <span>{insight.title}</span>
                  </div>
                  <p className="text-sm leading-6 text-white/84">{insight.body}</p>
                  {insight.ctaLabel ? (
                    <Button asChild variant="ghost" className="mt-3 h-9 rounded-full px-3 text-sm font-medium text-white hover:bg-white/10 hover:text-white">
                      <Link href={insight.ctaHref ?? "/dashboard"}>
                        {insight.ctaLabel}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function RecentInsightsCard({ items }) {
  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <SectionHeading title="Recent Insights" actionLabel="View all" actionHref="/clarity-capsule" />

        <ul className="space-y-3" aria-label="Recent insights">
          {items.map((item) => (
            <li key={item.id}>
              <div className={cn(subCardClass, "p-4 sm:p-5")}>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium leading-6 text-(--dashboard-subtle)">
                  <Sparkles className="size-4 text-(--dashboard-purple)" />
                  {item.date ?? "Date pending"}
                </div>
                <div className="text-base leading-7 text-(--dashboard-text)" title={item.summary ?? "Insight summary pending sync"}>
                  {item.summary ?? "Insight summary pending sync"}
                </div>
                {item.meta ? <div className="mt-3 text-sm leading-6 text-(--dashboard-purple) dark:text-violet-300">{item.meta}</div> : null}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ actions, userRole }) {
  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardHeader className="gap-2 px-4 pt-4 sm:px-6 sm:pt-6">
        <CardTitle className={sectionTitleClass}>Quick Actions</CardTitle>
        <CardDescription className={metaTextClass}>
          {userRole === "admin" ? "Direct links for ops, roadmap, and profile management." : "Jump into the next action that advances your career plan."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
        <ul className="space-y-3" aria-label="Quick actions">
          {actions.map((action) => {
            const Icon = actionIcons[action.icon];

            return (
              <li key={action.id}>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full justify-between rounded-[16px] border-(--dashboard-border) bg-(--dashboard-panel-strong) px-4 text-(--dashboard-muted) shadow-none transition-colors duration-200 hover:border-(--dashboard-border-strong) hover:bg-(--dashboard-panel-muted) hover:text-(--dashboard-text)"
                >
                  <Link href={action.href}>
                    <span className="inline-flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[14px] bg-(--dashboard-panel-muted) text-(--dashboard-subtle)">
                        <Icon className="size-4" />
                      </span>
                      <span className="truncate">{action.label}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-(--dashboard-subtle)" />
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export function CareerGrowthDashboard({ data, activeScenario }) {
  const { user: authUser } = useAuth();
  const mergedData = {
    ...data,
    user: {
      ...data.user,
      name: authUser?.first_name
        ? authUser.first_name
            .trim()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ")
        : data.user.name,
      avatarUrl: authUser?.avatar_url ?? data.user.avatarUrl,
    },
  };
  return (
    <DashboardShell>
      <DashboardHeader 
        heading={`Welcome back, ${mergedData?.user?.name ?? "Vinny"}!`}
        subheading={mergedData?.user?.subtitle ?? "Here's your career growth overview"}
      />
      <StatsGrid stats={mergedData?.stats} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.95fr)]">
        <div className="space-y-6">
          <SessionsCard sessions={mergedData?.sessions} />
          <TasksCard tasks={mergedData?.tasks} />
        </div>

        <aside className="space-y-6" aria-label="Insights and actions">
          <VegaInsightsCard insights={mergedData?.insights} />
          <RecentInsightsCard items={mergedData?.recentInsights} />
          <QuickActionsCard actions={mergedData?.quickActions} userRole={mergedData?.user.role} />
        </aside>
      </div>
    </DashboardShell>
  );
}

export function CareerGrowthDashboardSkeleton() {
  return (
    <DashboardShell>
      <Card className={cn(panelClass, "px-0 py-0")}>
        <CardContent className="space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-full bg-(--dashboard-panel-muted)" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-32 rounded-full bg-(--dashboard-panel-muted)" />
                <Skeleton className="h-10 w-72 max-w-[75vw] bg-(--dashboard-panel-muted)" />
                <Skeleton className="h-4 w-56 max-w-[65vw] bg-(--dashboard-panel-muted)" />
              </div>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <Skeleton className="h-11 w-full rounded-[16px] bg-(--dashboard-panel-muted) md:w-72" />
              <Skeleton className="size-11 rounded-[16px] bg-(--dashboard-panel-muted)" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`stat-skeleton-${index}`} className={cn(panelClass, "px-0 py-0")}>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <Skeleton className="size-12 rounded-[16px] bg-(--dashboard-panel-muted)" />
              <div className="space-y-3">
                <Skeleton className="h-9 w-28 bg-(--dashboard-panel-muted)" />
                <Skeleton className="h-4 w-36 bg-(--dashboard-panel-muted)" />
                <Skeleton className="h-4 w-24 bg-(--dashboard-panel-muted)" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.95fr)]">
        <div className="space-y-6">
          <Card className={cn(panelClass, "px-0 py-0")}>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <Skeleton className="h-8 w-48 bg-(--dashboard-panel-muted)" />
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`session-skeleton-${index}`} className={cn(subCardClass, "p-4 sm:p-5")}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <Skeleton className="size-12 rounded-[16px] bg-(--dashboard-panel-muted)" />
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-64 max-w-[55vw] bg-(--dashboard-panel-muted)" />
                        <Skeleton className="h-4 w-32 bg-(--dashboard-panel-muted)" />
                        <Skeleton className="h-4 w-48 bg-(--dashboard-panel-muted)" />
                      </div>
                    </div>
                    <Skeleton className="h-11 w-full rounded-full bg-(--dashboard-panel-muted) sm:w-40" />
                  </div>
                </div>
              ))}
              <Skeleton className="h-11 w-full rounded-[16px] bg-(--dashboard-panel-muted)" />
            </CardContent>
          </Card>

          <Card className={cn(panelClass, "px-0 py-0")}>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <Skeleton className="h-8 w-40 bg-(--dashboard-panel-muted)" />
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`task-skeleton-${index}`} className={cn(subCardClass, "p-4 sm:p-5")}>
                  <Skeleton className="h-5 w-full max-w-[70%] bg-(--dashboard-panel-muted)" />
                  <div className="mt-3 flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full bg-(--dashboard-panel-muted)" />
                    <Skeleton className="h-5 w-24 bg-(--dashboard-panel-muted)" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[24px] border-0 bg-[linear-gradient(180deg,#8a5cf6,#c94dff)] px-0 py-0 shadow-[0_28px_72px_-34px_rgba(124,58,237,0.72)] ring-0">
            <CardContent className="space-y-4 p-4 sm:p-6">
              <Skeleton className="h-8 w-40 rounded-full bg-white/20" />
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={`insight-skeleton-${index}`} className="h-30 rounded-[20px] bg-white/18" />
              ))}
            </CardContent>
          </Card>
          <Card className={cn(panelClass, "px-0 py-0")}>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <Skeleton className="h-8 w-40 bg-(--dashboard-panel-muted)" />
              <Skeleton className="h-28 rounded-[20px] bg-(--dashboard-panel-muted)" />
              <Skeleton className="h-28 rounded-[20px] bg-(--dashboard-panel-muted)" />
            </CardContent>
          </Card>
          <Card className={cn(panelClass, "px-0 py-0")}>
            <CardContent className="space-y-3 p-4 sm:p-6">
              <Skeleton className="h-8 w-36 bg-(--dashboard-panel-muted)" />
              <Skeleton className="h-12 rounded-[16px] bg-(--dashboard-panel-muted)" />
              <Skeleton className="h-12 rounded-[16px] bg-(--dashboard-panel-muted)" />
              <Skeleton className="h-12 rounded-[16px] bg-(--dashboard-panel-muted)" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

export function DashboardErrorState({ error, retryLabel, onRetry }) {
  return (
    <DashboardShell>
      <Card className={cn(panelClass, "mx-auto max-w-2xl px-0 py-0")}>
        <CardHeader className="gap-3 px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="flex size-14 items-center justify-center rounded-[20px] bg-rose-50 text-rose-500 dark:bg-rose-500/12 dark:text-rose-200">
            <CircleAlert className="size-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-(--dashboard-text)">Dashboard data could not be loaded</CardTitle>
          <CardDescription className="max-w-xl text-sm leading-6 text-(--dashboard-muted)">
            {error?.message ?? "The dashboard hit an unexpected issue while rendering your career snapshot."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="rounded-[20px] border border-(--dashboard-border) bg-(--dashboard-panel-muted) p-4 text-sm leading-6 text-(--dashboard-muted)">
            Try refreshing the route or switching back to the default scenario. Route-level errors are handled by Next 16 in this segment through `error.js`, so this state is recoverable without
            leaving the page.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={onRetry} className="h-11 rounded-full bg-[linear-gradient(135deg,#7c3aed,#c026d3)] px-5 text-white shadow-[0_16px_32px_-22px_rgba(168,85,247,0.66)]">
              {retryLabel}
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full border-(--dashboard-border) bg-(--dashboard-panel-strong) px-5 text-(--dashboard-text) hover:bg-(--dashboard-panel-muted)">
              <Link href="/dashboard">Open default dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
