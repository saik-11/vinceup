"use client";

import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Shared design system (theme variables, style constants, shell, heading) ──
import {
  DashboardShell,
  interactivePanelClass,
  metaTextClass,
  panelClass,
  SectionHeading,
  sectionTitleClass,
  subCardClass,
} from "@/components/dashboard/dashboard-shared";

import {
  mentorStats,
  milestones,
  ratingDistributionData,
  sessionsTrendData,
  upcomingSessions,
  vegaInsights,
} from "@/data/mentorDashboardData";

// ─── KPI stat accent styles ───────────────────────────────────────────────────
// Same pattern as career-growth-dashboard — tinted translucent icon backgrounds.

const statAccentStyles = {
  purple: {
    iconWrap:
      "bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(192,38,211,0.22))] text-[var(--dashboard-purple)] dark:bg-[linear-gradient(135deg,rgba(139,92,246,0.24),rgba(217,70,239,0.28))]",
    hoverBorder: "hover:border-[rgba(124,58,237,0.22)] dark:hover:border-[rgba(167,139,250,0.32)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(124,58,237,0.32)] dark:hover:shadow-[0_24px_60px_-32px_rgba(124,58,237,0.36)]",
    badge: "border-violet-200/80 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/12 dark:text-violet-200",
  },
  orange: {
    iconWrap:
      "bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(234,88,12,0.22))] text-[var(--dashboard-orange)] dark:bg-[linear-gradient(135deg,rgba(251,146,60,0.24),rgba(249,115,22,0.28))]",
    hoverBorder: "hover:border-[rgba(249,115,22,0.24)] dark:hover:border-[rgba(251,146,60,0.34)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(249,115,22,0.34)] dark:hover:shadow-[0_24px_60px_-32px_rgba(234,88,12,0.34)]",
    badge: "border-orange-200/80 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/12 dark:text-orange-200",
  },
  teal: {
    iconWrap:
      "bg-[linear-gradient(135deg,rgba(8,145,178,0.14),rgba(14,116,144,0.22))] text-[var(--dashboard-teal)] dark:bg-[linear-gradient(135deg,rgba(6,182,212,0.22),rgba(8,145,178,0.3))]",
    hoverBorder: "hover:border-[rgba(8,145,178,0.22)] dark:hover:border-[rgba(34,211,238,0.32)]",
    hoverShadow: "hover:shadow-[0_22px_54px_-32px_rgba(8,145,178,0.3)] dark:hover:shadow-[0_24px_60px_-32px_rgba(6,182,212,0.3)]",
    badge: "border-cyan-200/80 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/12 dark:text-cyan-200",
  },
  green: {
    iconWrap:
      "bg-[linear-gradient(135deg,rgba(18,183,106,0.14),rgba(5,150,105,0.22))] text-[var(--dashboard-green)] dark:bg-[linear-gradient(135deg,rgba(18,183,106,0.22),rgba(5,150,105,0.3))]",
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
};

const insightIcons = {
  "trending-up": TrendingUp,
  users: Users,
  clock: Clock,
};

// ─── Dashboard Header ─────────────────────────────────────────────────────────

function DashboardHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-(--dashboard-text) sm:text-3xl">Welcome back, Dr. Alex Rivera!</h1>
        <p className={cn(metaTextClass, "mt-0.5")}>Here&apos;s your mentorship impact overview</p>
      </div>

      {/* Right: VEGA weekly highlight pill */}
      <div className="inline-flex shrink-0 items-center gap-2.5 rounded-[20px] border border-[rgba(124,58,237,0.18)] bg-[rgba(124,58,237,0.06)] px-4 py-2.5 shadow-[0_2px_8px_-3px_rgba(124,58,237,0.12)] dark:border-[rgba(167,139,250,0.22)] dark:bg-[rgba(124,58,237,0.12)]">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_6px_14px_-4px_rgba(124,58,237,0.55)]">
          <Sparkles className="size-4 text-white" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-(--dashboard-purple)">VEGA Weekly Highlight</p>
          <p className="text-xs font-medium text-(--dashboard-muted)">Your mentees achieved 18 career milestones</p>
        </div>
      </div>
    </div>
  );
}

// ─── KPI Stats Grid ───────────────────────────────────────────────────────────

function KpiCard({ stat }) {
  const Icon = statIcons[stat.icon] ?? BookOpen;
  const accentStyles = statAccentStyles[stat.badgeColor] ?? statAccentStyles.purple;

  return (
    <li className="min-w-0">
      <Card className={cn(panelClass, interactivePanelClass, accentStyles.hoverBorder, accentStyles.hoverShadow, "h-full px-0 py-0")}>
        <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
                accentStyles.iconWrap,
              )}
            >
              <Icon className="size-5" />
            </div>
            <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ring-0", accentStyles.badge)}>
              {stat.badge}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-[2rem] font-bold leading-none tracking-[-0.04em] text-(--dashboard-text)">{stat.value}</p>
            <p className="text-sm font-medium leading-6 text-(--dashboard-muted)">{stat.label}</p>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}

function KpiStatsGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Mentorship KPI stats">
      {mentorStats.map((stat) => (
        <KpiCard key={stat.id} stat={stat} />
      ))}
    </ul>
  );
}

// ─── Sessions Trend (Area Chart) ──────────────────────────────────────────────

function SessionsTrendCard() {
  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className={sectionTitleClass}>Sessions Trend</h2>
            <p className={metaTextClass}>Monthly session delivery</p>
          </div>
          <TrendingUp className="mt-1 size-4 text-(--dashboard-teal)" strokeWidth={2.5} />
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessionsTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mentorSessionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.26} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 36]}
                ticks={[0, 8, 16, 24, 32]}
              />
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
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#mentorSessionGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#7c3aed", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
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

function RatingDistributionCard() {
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

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ratingDistributionData}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <YAxis
                type="category"
                dataKey="star"
                tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--dashboard-border-strong)",
                  boxShadow: "var(--dashboard-shadow)",
                  fontSize: "12px",
                  background: "var(--dashboard-panel-strong)",
                  color: "var(--dashboard-text)",
                }}
                formatter={(v) => [`${v}%`, "Share"]}
                cursor={{ fill: "var(--dashboard-panel-muted)" }}
              />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} shape={<CustomRatingBar />}>
                {ratingDistributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#f97316" : "#fdba74"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Milestone Achievements ───────────────────────────────────────────────────

function MilestoneCard({ milestone }) {
  const Icon = statIcons[milestone.icon] ?? Star;
  const achieved = milestone.achieved;

  return (
    // h-full on both li and inner div ensures equal card heights across the grid row
    <li className="flex min-w-0">
      <div
        className={cn(
          "flex w-full flex-col items-center justify-between gap-3 rounded-[20px] border px-4 py-5 transition-all duration-200",
          achieved
            ? "border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.06)] hover:-translate-y-0.5 hover:border-[rgba(245,158,11,0.5)] hover:shadow-[0_12px_30px_-16px_rgba(245,158,11,0.3)] dark:border-[rgba(251,191,36,0.2)] dark:bg-[rgba(245,158,11,0.08)]"
            : "border-(--dashboard-border) bg-(--dashboard-panel-muted) opacity-40",
        )}
      >
        <Icon
          className={cn("size-7", achieved ? "text-(--dashboard-amber)" : "text-(--dashboard-subtle)")}
          strokeWidth={1.8}
          fill={achieved ? "rgba(245,158,11,0.18)" : "none"}
        />
        <p className={cn("text-center text-sm font-semibold", achieved ? "text-(--dashboard-text)" : "text-(--dashboard-subtle)")}>
          {milestone.label}
        </p>
        {achieved ? (
          <CheckCircle2 className="size-4 text-(--dashboard-green)" strokeWidth={2.5} />
        ) : (
          // Placeholder keeps height consistent on the disabled card
          <span className="size-4" />
        )}
      </div>
    </li>
  );
}

function MilestonesSection() {
  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Award className="size-5 text-(--dashboard-amber)" />
          <h2 className={sectionTitleClass}>Milestone Achievements</h2>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Milestone achievements">
          {milestones.map((m) => (
            <MilestoneCard key={m.id} milestone={m} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── VEGA AI Insights ─────────────────────────────────────────────────────────

function VegaInsightCard({ insight }) {
  const Icon = insightIcons[insight.icon] ?? TrendingUp;

  return (
    // h-full stretches each card to match the tallest sibling in the grid row
    <li className="flex min-w-0">
      <div
        className={cn(
          subCardClass,
          "flex w-full flex-col gap-3 p-4 hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_12px_28px_-16px_rgba(124,58,237,0.18)]",
        )}
      >
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-[10px]", insight.iconBg)}>
          <Icon className="size-4" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-(--dashboard-text)">{insight.title}</p>
          <p className="mt-0.5 text-xs leading-5 text-(--dashboard-muted)">{insight.body}</p>
        </div>
      </div>
    </li>
  );
}

function VegaInsightsSection() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[rgba(124,58,237,0.18)] bg-[linear-gradient(135deg,rgba(124,58,237,0.07)_0%,rgba(192,38,211,0.05)_50%,rgba(124,58,237,0.03)_100%)] p-5 shadow-(--dashboard-shadow) backdrop-blur-xl dark:border-[rgba(167,139,250,0.2)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.14)_0%,rgba(192,38,211,0.1)_50%,rgba(124,58,237,0.06)_100%)]">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)]">
          <Sparkles className="size-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h2 className={sectionTitleClass}>VEGA AI Insights</h2>
          <p className={metaTextClass}>Personalized recommendations for you</p>
        </div>
      </div>

      {/* 3-column grid — items stretch to equal height via flex on li */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="VEGA AI insights">
        {vegaInsights.map((insight) => (
          <VegaInsightCard key={insight.id} insight={insight} />
        ))}
      </ul>
    </div>
  );
}

// ─── Upcoming Sessions ────────────────────────────────────────────────────────

function SessionRow({ session }) {
  return (
    <div
      className={cn(
        subCardClass,
        "flex flex-col gap-4 p-4 hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_12px_28px_-16px_rgba(124,58,237,0.16)] sm:flex-row sm:items-center sm:justify-between sm:p-5",
      )}
    >
      {/* Left: avatar + info */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.3)]",
            session.avatarColor,
          )}
        >
          {session.initials}
        </div>

        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-(--dashboard-text)">{session.name}</span>
            {session.isNew && (
              <Badge className="rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-0 dark:border-emerald-400/20 dark:bg-emerald-500/12 dark:text-emerald-300">
                New
              </Badge>
            )}
            <Badge className="rounded-full border border-(--dashboard-border-strong) bg-(--dashboard-panel-muted) px-2 py-0.5 text-[10px] font-medium text-(--dashboard-subtle) ring-0">
              {session.sessionTag}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs leading-6 text-(--dashboard-subtle)">
            <span className="inline-flex items-center gap-1">
              <FileText className="size-3" />
              {session.type}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {session.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3" />
              {session.date}
            </span>
          </div>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 cursor-pointer rounded-[12px] border-(--dashboard-border-strong) bg-(--dashboard-panel-strong) px-3.5 text-xs font-semibold text-(--dashboard-muted) shadow-none hover:border-[rgba(124,58,237,0.22)] hover:bg-(--dashboard-panel-muted) hover:text-(--dashboard-purple)"
        >
          View Prep
        </Button>
        <Button
          size="sm"
          className="h-8 cursor-pointer gap-1.5 rounded-[12px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] px-3.5 text-xs font-semibold text-white shadow-[0_6px_16px_-6px_rgba(124,58,237,0.6)] transition-all duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.7)]"
        >
          <Video className="size-3.5" />
          Join Session
        </Button>
      </div>
    </div>
  );
}

function UpcomingSessionsSection() {
  return (
    <Card className={cn(panelClass, "px-0 py-0")}>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <SectionHeading title="Upcoming Sessions" description="Your schedule for today and tomorrow" actionLabel="View All" />

        <ul className="space-y-3" aria-label="Upcoming sessions">
          {upcomingSessions.map((session) => (
            <li key={session.id}>
              <SessionRow session={session} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

const MentorDashboard = () => {
  return (
    <DashboardShell ariaLabel="Mentor dashboard" maxWidth="max-w-6xl">
      {/* 1. Header */}
      <DashboardHeader />

      {/* 2. KPI Stats Row */}
      <KpiStatsGrid />

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SessionsTrendCard />
        <RatingDistributionCard />
      </div>

      {/* 4. Milestone Achievements */}
      <MilestonesSection />

      {/* 5. VEGA AI Insights */}
      <VegaInsightsSection />

      {/* 6. Upcoming Sessions */}
      <UpcomingSessionsSection />
    </DashboardShell>
  );
};

export default MentorDashboard;
