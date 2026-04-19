"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Award, BookOpen, CheckCircle2, Clock, Globe, Loader2, Sparkles, Star, Target, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { DashboardShell, interactivePanelClass, metaTextClass, panelClass, sectionTitleClass, subCardClass } from "@/components/dashboard/dashboard-shared";
import { mentorApi } from "@/services/service";
import Link from "next/link";

// ─── KPI stat accent styles ───────────────────────────────────────────────────
// Same pattern as career-growth-dashboard — tinted translucent icon backgrounds.

const statAccentStyles = {
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
  green: {
    iconWrap: "bg-[linear-gradient(135deg,rgba(18,183,106,0.14),rgba(5,150,105,0.22))] text-[var(--dashboard-green)] dark:bg-[linear-gradient(135deg,rgba(18,183,106,0.22),rgba(5,150,105,0.3))]",
    hoverBorder: "hover:border-[rgba(18,183,106,0.22)] dark:hover:border-[rgba(52,211,153,0.32)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(18,183,106,0.3)] dark:hover:shadow-[0_24px_60px_-32px_rgba(5,150,105,0.34)]",
    badge: "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/12 dark:text-emerald-200",
  },
};

// ─── Icon map ─────────────────────────────────────────────────────────────────

const statIcons = {
  book: BookOpen,
  star: Star,
  users: Users,
  clock: Clock,
  award: Award,
  target: Target,
  "trending-up": TrendingUp,
  first_session: Target,
  ten_mentees: Users,
  fifty_sessions: Award,
  hundred_sessions: Star,
  four_week_streak: TrendingUp,
  founding_mentor: Sparkles,
};

const insightIcons = {
  "trending-up": TrendingUp,
  users: Users,
  clock: Clock,
  milestone_proximity: Target,
};

// ─── Dashboard Header ─────────────────────────────────────────────────────────

function DashboardHeader({ welcome, timezone }) {
  if (!welcome) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-(--dashboard-text) sm:text-3xl">Welcome back, {welcome.first_name || "Mentor"}!</h1>
          {welcome.founding_mentor && (
            <Badge className="rounded-full bg-[linear-gradient(135deg,#f59e0b,#d97706)] text-white shadow-[0_2px_10px_-2px_rgba(245,158,11,0.5)] border-0 font-bold px-3 py-1 text-[10px] uppercase tracking-wider">
              Founding Mentor
            </Badge>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <p className={cn(metaTextClass, "text-[15px]")}>Here&apos;s your mentorship impact overview</p>
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

      {/* Right: VEGA weekly highlight pill */}
      {welcome.vega_weekly_highlight && (
        <div className="inline-flex shrink-0 items-center gap-2.5 rounded-[20px] border border-[rgba(124,58,237,0.18)] bg-[rgba(124,58,237,0.06)] px-4 py-2.5 shadow-[0_2px_8px_-3px_rgba(124,58,237,0.12)] dark:border-[rgba(167,139,250,0.22)] dark:bg-[rgba(124,58,237,0.12)]">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_6px_14px_-4px_rgba(124,58,237,0.55)]">
            <Sparkles className="size-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-(--dashboard-purple)">VEGA Weekly Highlight</p>
            <p className="text-xs font-medium text-(--dashboard-muted)">{welcome.vega_weekly_highlight}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── KPI Stats Grid ───────────────────────────────────────────────────────────

function KpiCard({ stat }) {
  const Icon = statIcons[stat.icon] ?? BookOpen;
  const accentStyles = statAccentStyles[stat.badgeColor] ?? statAccentStyles.purple;

  return (
    <li className="min-w-0">
      <Card className={cn(panelClass, interactivePanelClass, accentStyles.hoverBorder, accentStyles.hoverShadow, "h-full px-0 py-0 flex flex-col")}>
        <CardContent className="flex flex-1 flex-col justify-between p-4 sm:p-5 lg:p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className={cn("flex size-12 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]", accentStyles.iconWrap)}>
                <Icon className="size-5" />
              </div>
              <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-0", accentStyles.badge)}>{stat.badge}</Badge>
            </div>

            <div className="space-y-1 mt-1">
              <p className={cn("text-[2rem] font-bold leading-none tracking-[-0.04em] text-(--dashboard-text)", stat.valueClass)}>{stat.value}</p>
              <p className="text-sm font-medium leading-6 text-(--dashboard-muted)">{stat.label}</p>
            </div>
          </div>

          {stat.action && <div className="mt-5 pt-3 border-t border-(--dashboard-border) flex items-center">{stat.action}</div>}
        </CardContent>
      </Card>
    </li>
  );
}

function KpiStatsGrid({ stats }) {
  if (!stats) return null;

  const noRatings = stats.average_rating === null;

  const kpiData = [
    {
      id: "s1",
      icon: "book",
      badgeColor: "purple",
      badge: "All Time",
      value: stats.sessions_delivered?.toLocaleString() ?? 0,
      label: "Sessions Delivered",
    },
    {
      id: "s2",
      icon: "star",
      badgeColor: "orange",
      badge: "Avg Rating",
      value: noRatings ? "—" : stats.average_rating,
      valueClass: noRatings ? "text-xl font-medium text-(--dashboard-subtle) mb-3 mt-4" : "",
      label: noRatings ? "No ratings yet" : "Average Rating",
    },
    {
      id: "s3",
      icon: "users",
      badgeColor: "teal",
      badge: "Retention",
      value: `${stats.repeat_mentee_rate_pct ?? 0}%`,
      label: "Repeat Mentee Rate",
    },
    {
      id: "s4",
      icon: "clock",
      badgeColor: "green",
      badge: "Total Hours",
      value: stats.mentorship_hours ? `${stats.mentorship_hours.toLocaleString()}h` : "0h",
      label: "Mentorship Hours",
    },
    {
      id: "s5",
      icon: "book",
      badgeColor: "purple",
      badge: "This Month",
      value: stats.sessions_this_month?.toLocaleString() ?? 0,
      label: "Sessions This Month",
    },
    {
      id: "s6",
      icon: "target",
      badgeColor: "orange",
      badge: "Availability",
      value: stats.open_slots?.toLocaleString() ?? 0,
      label: "Open Slots",
      action:
        stats.open_slots === 0 ? (
          <Link href="/mentor-calendar" className="text-xs font-semibold text-(--dashboard-orange) hover:opacity-80 transition-opacity">
            Open Calendar &rarr;
          </Link>
        ) : null,
    },
    {
      id: "s7",
      icon: "star",
      badgeColor: "teal",
      badge: "Feedback",
      value: stats.total_ratings?.toLocaleString() ?? 0,
      label: "Total Ratings",
    },
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Mentorship KPI stats">
      {kpiData.map((stat) => (
        <KpiCard key={stat.id} stat={stat} />
      ))}
    </ul>
  );
}

// ─── Sessions Trend (Area Chart) ──────────────────────────────────────────────

function SessionsTrendCard({ data }) {
  const safeData = data?.length > 0 ? data : [];

  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className={sectionTitleClass}>Sessions Trend</h2>
            <p className={metaTextClass}>Weekly session delivery</p>
          </div>
          <TrendingUp className="mt-1 size-4 text-(--dashboard-teal)" strokeWidth={2.5} />
        </div>

        <div className="h-52">
          {safeData.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center border-2 border-dashed border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] rounded-[16px] text-sm text-(--dashboard-muted) p-6 text-center transition-colors hover:bg-(--dashboard-panel-muted) hover:border-[rgba(124,58,237,0.2)]">
              <TrendingUp className="mb-2 size-8 text-(--dashboard-subtle) opacity-40" />
              <p className="font-semibold text-(--dashboard-text)">No session trends yet</p>
              <p className="mt-1 max-w-[200px] text-xs leading-5">Complete your first few sessions to track your weekly progress over time.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={safeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mentorSessionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-border)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }} axisLine={false} tickLine={false} domain={[0, 36]} ticks={[0, 8, 16, 24, 32]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--dashboard-border-strong)",
                    boxShadow: "var(--dashboard-shadow)",
                    fontSize: "12px",
                    background: "var(--dashboard-panel-strong)",
                    color: "var(--dashboard-text)",
                  }}
                  itemStyle={{ color: "#7c3aed" }}
                  formatter={(v) => [v, "Sessions"]}
                />
                <Area type="monotone" dataKey="sessions" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#mentorSessionGrad)" dot={false} activeDot={{ r: 5, fill: "#7c3aed", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Rating Distribution (Horizontal Bar Chart) ───────────────────────────────

const CustomRatingBar = (props) => {
  const { x, y, width, height, index } = props;
  return <rect x={x} y={y} width={width} height={height} rx={4} fill={index === 0 ? "#f97316" : "#fdba74"} />;
};

function RatingDistributionCard({ distribution }) {
  const chartData = [
    { star: "5 Stars", pct: distribution?.["5"] || 0 },
    { star: "4 Stars", pct: distribution?.["4"] || 0 },
    { star: "3 Stars", pct: distribution?.["3"] || 0 },
    { star: "2 Stars", pct: distribution?.["2"] || 0 },
    { star: "1 Star", pct: distribution?.["1"] || 0 },
  ];

  const total = chartData.reduce((acc, curr) => acc + curr.pct, 0);

  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className={sectionTitleClass}>Rating Distribution</h2>
            <p className={metaTextClass}>Mentee feedback breakdown</p>
          </div>
          <Star className="mt-1 size-4 text-(--dashboard-amber)" fill="var(--dashboard-amber)" strokeWidth={0} />
        </div>

        <div className="h-52">
          {total === 0 ? (
            <div className="flex h-full flex-col items-center justify-center border-2 border-dashed border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] rounded-[16px] p-6 text-center transition-colors hover:bg-(--dashboard-panel-muted) hover:border-[rgba(245,158,11,0.3)]">
              <Star className="mb-2 size-8 text-(--dashboard-subtle) opacity-40" />
              <p className="text-sm font-semibold text-(--dashboard-text)">No ratings received</p>
              <p className="mt-1 max-w-[200px] text-xs leading-5 text-(--dashboard-muted)">When mentees rate your completed sessions, their feedback breakdown will appear here.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }} axisLine={false} tickLine={false} domain={[0, "dataMax"]} />
                <YAxis type="category" dataKey="star" tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }} axisLine={false} tickLine={false} width={45} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--dashboard-border-strong)",
                    boxShadow: "var(--dashboard-shadow)",
                    fontSize: "12px",
                    background: "var(--dashboard-panel-strong)",
                    color: "var(--dashboard-text)",
                  }}
                  formatter={(v) => [v, "Count"]}
                  cursor={{ fill: "var(--dashboard-panel-muted)" }}
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]} shape={<CustomRatingBar />}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#f97316" : "#fdba74"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Milestone Achievements ───────────────────────────────────────────────────

function MilestoneCard({ milestone }) {
  const Icon = statIcons[milestone.key] ?? Award;
  const achieved = milestone.earned;

  return (
    <li className="flex min-w-0">
      <div
        className={cn(
          "flex w-full flex-col items-center justify-between gap-3 rounded-[20px] border px-4 py-5 transition-all duration-200",
          achieved
            ? "border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.06)] hover:-translate-y-0.5 hover:border-[rgba(245,158,11,0.5)] hover:shadow-[0_12px_30px_-16px_rgba(245,158,11,0.3)] dark:border-[rgba(251,191,36,0.2)] dark:bg-[rgba(245,158,11,0.08)]"
            : "border-(--dashboard-border) bg-(--dashboard-panel-muted) opacity-40",
        )}
      >
        <Icon className={cn("size-7", achieved ? "text-(--dashboard-amber)" : "text-(--dashboard-subtle)")} strokeWidth={1.8} fill={achieved ? "rgba(245,158,11,0.18)" : "none"} />
        <div className="text-center">
          <p className={cn("text-sm font-semibold", achieved ? "text-(--dashboard-text)" : "text-(--dashboard-subtle)")}>{milestone.label}</p>
          {milestone.progress_text && !achieved && <p className="mt-0.5 text-[10px] text-(--dashboard-subtle)">{milestone.progress_text}</p>}
        </div>
        {achieved ? <CheckCircle2 className="size-4 text-(--dashboard-green)" strokeWidth={2.5} /> : <span className="size-4" />}
      </div>
    </li>
  );
}

function MilestonesSection({ milestones }) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Award className="size-5 text-(--dashboard-amber)" />
          <h2 className={sectionTitleClass}>Milestone Achievements</h2>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Milestone achievements">
          {milestones.map((m) => (
            <MilestoneCard key={m.key} milestone={m} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── VEGA AI Insights ─────────────────────────────────────────────────────────

function VegaInsightCard({ insight }) {
  const Icon = insightIcons[insight.type] ?? TrendingUp;
  return (
    <li className="flex min-w-0">
      <div className={cn(subCardClass, "flex w-full flex-col gap-3 p-4 hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_12px_28px_-16px_rgba(124,58,237,0.18)]")}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">
          <Icon className="size-4" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-(--dashboard-text) capitalize">{insight.type}</p>
          <p className="mt-0.5 text-xs leading-5 text-(--dashboard-muted)">{insight.message}</p>
        </div>
      </div>
    </li>
  );
}

function VegaInsightsSection({ nudges }) {
  if (!nudges || nudges.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-[rgba(124,58,237,0.18)] bg-[linear-gradient(135deg,rgba(124,58,237,0.07)_0%,rgba(192,38,211,0.05)_50%,rgba(124,58,237,0.03)_100%)] p-5 shadow-(--dashboard-shadow) backdrop-blur-xl dark:border-[rgba(167,139,250,0.2)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.14)_0%,rgba(192,38,211,0.1)_50%,rgba(124,58,237,0.06)_100%)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)]">
          <Sparkles className="size-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h2 className={sectionTitleClass}>VEGA AI Insights</h2>
          <p className={metaTextClass}>Personalized recommendations for you</p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="VEGA AI insights">
        {nudges.map((insight, idx) => (
          <VegaInsightCard key={idx} insight={insight} />
        ))}
      </ul>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

const MentorDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    mentorApi
      .getDashboard()
      .then((res) => {
        if (mounted) {
          setData(res.data || res);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load dashboard data.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <DashboardShell ariaLabel="Mentor dashboard" maxWidth="max-w-6xl">
        <div className="flex min-h-[500px] items-center justify-center rounded-[24px] border border-[rgba(124,58,237,0.18)] bg-[linear-gradient(135deg,rgba(124,58,237,0.07)_0%,rgba(192,38,211,0.05)_50%,rgba(124,58,237,0.03)_100%)] shadow-(--dashboard-shadow) backdrop-blur-xl dark:border-[rgba(167,139,250,0.2)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.14)_0%,rgba(192,38,211,0.1)_50%,rgba(124,58,237,0.06)_100%)]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-10 animate-spin text-(--dashboard-purple)" />
            <p className="text-sm font-semibold text-(--dashboard-muted)">Loading your mentor dashboard...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell ariaLabel="Mentor dashboard" maxWidth="max-w-6xl">
        <div className="flex min-h-[500px] items-center justify-center rounded-[24px] border border-red-500/20 bg-red-50/50 shadow-sm backdrop-blur-xl dark:bg-red-500/5">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="size-10 text-red-500" />
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-2 h-9 rounded-[12px] text-xs shadow-none">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!data) return null;

  return (
    <DashboardShell ariaLabel="Mentor dashboard" maxWidth="max-w-6xl">
      {/* 1. Header */}
      <DashboardHeader welcome={data.welcome} timezone={data.display_timezone} />

      {/* Getting Started Banner for Mentors with Zero Sessions */}
      {data.stats && data.stats.sessions_delivered === 0 && (
        <div className="rounded-[20px] border border-[rgba(16,185,129,0.25)] bg-[linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.03))] p-5 shadow-[0_4px_16px_-4px_rgba(16,185,129,0.12)] sm:flex sm:items-center sm:justify-between dark:border-[rgba(16,185,129,0.15)]">
          <div>
            <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-400">Ready for your first session?</h3>
            <p className="mt-1.5 text-sm text-(--dashboard-muted) max-w-lg leading-relaxed">
              Set up your calendar and open availability slots to start accepting mentee bookings and kickstart your mentorship journey!
            </p>
          </div>
          <Button asChild className="mt-5 sm:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm h-10 px-5 rounded-[12px] shrink-0">
            <Link href="/mentor-calendar">Manage Availability</Link>
          </Button>
        </div>
      )}

      {/* 2. KPI Stats Row */}
      <KpiStatsGrid stats={data.stats} />

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SessionsTrendCard data={data.sessions_trend} />
        <RatingDistributionCard distribution={data.rating_distribution} />
      </div>

      {/* 4. Milestone Achievements */}
      <MilestonesSection milestones={data.milestone_badges} />

      {/* 5. VEGA AI Insights */}
      <VegaInsightsSection nudges={data.vega_nudges} />
    </DashboardShell>
  );
};

export default MentorDashboard;
