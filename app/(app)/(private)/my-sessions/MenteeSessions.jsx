"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, ChevronRight, Sparkles, FileText, AlertCircle, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DashboardShell,
  panelClass,
  interactivePanelClass,
  metaTextClass,
  DashboardHeader,
} from "@/components/dashboard/dashboard-shared";
import { menteeApi } from "@/services/service";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  confirmed: "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/12 dark:text-emerald-300",
  pending: "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/12 dark:text-amber-300",
  completed: "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/12 dark:text-blue-300",
  cancelled: "border-red-200/80 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/12 dark:text-red-300",
  blocked: "border-gray-200/80 bg-gray-50 text-gray-600 dark:border-gray-400/20 dark:bg-gray-500/12 dark:text-gray-400",
};

const STATUS_LABELS = {
  confirmed: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
  blocked: "Blocked",
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.blocked;
  const label = STATUS_LABELS[status] ?? status;
  return (
    <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-0", style)}>
      {label}
    </Badge>
  );
}

// ─── Date/Time Helpers ────────────────────────────────────────────────────────

function parseLocalDate(scheduledAtLocal) {
  if (!scheduledAtLocal) return null;
  const d = new Date(scheduledAtLocal);
  return isNaN(d.getTime()) ? null : d;
}

function formatSessionDateTime(scheduledAtLocal) {
  const d = parseLocalDate(scheduledAtLocal);
  if (!d) return { date: "—", time: "—" };
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

function isTodaySession(scheduledAtLocal) {
  const d = parseLocalDate(scheduledAtLocal);
  if (!d) return false;
  return d.toDateString() === new Date().toDateString();
}

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ session, variant }) {
  const { date, time } = formatSessionDateTime(session.scheduled_at_local);
  const isUpcomingVariant = variant === "upcoming" || variant === "today";

  return (
    <Card
      className={cn(
        panelClass,
        interactivePanelClass,
        "group flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        "[&]:p-5 [&]:md:p-6",
      )}
    >
      {/* Session info */}
      <article className="flex flex-col min-w-0 gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight md:text-lg text-(--dashboard-text)">
            {session.service_type}
          </h3>
          <StatusBadge status={session.status} />
        </div>

        {session.notes && (
          <p className={cn("text-sm line-clamp-1", metaTextClass)}>{session.notes}</p>
        )}

        <div className={cn("flex items-center gap-2 mt-1 text-sm", metaTextClass)}>
          <Calendar className="w-4 h-4 opacity-60 shrink-0" aria-hidden="true" />
          <time dateTime={session.scheduled_at_local}>
            {date}&nbsp;&bull;&nbsp;{time}
          </time>
        </div>
      </article>

      {/* Actions */}
      <div className="flex items-center shrink-0 gap-2 mt-2 sm:mt-0">
        {isUpcomingVariant && session.status !== "cancelled" && (
          <>
            <Button className="gap-2 px-5 text-sm text-white rounded-full shadow-sm bg-[linear-gradient(135deg,#7c3aed,#c026d3)] hover:opacity-90 hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)] active:scale-95 transition-all duration-200">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              View Prep
            </Button>
            <Button
              variant="ghost"
              className="gap-1 px-4 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 group/btn rounded-full"
            >
              Details
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
            </Button>
          </>
        )}

        {variant === "past" && (
          <Button
            variant="ghost"
            className="gap-1 px-4 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 group/btn rounded-full"
          >
            <FileText className="w-4 h-4" />
            View Notes
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
          </Button>
        )}
      </div>
    </Card>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SessionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={cn(panelClass, "p-5 animate-pulse flex items-center justify-between gap-4")}
        >
          <div className="flex-1 space-y-2.5">
            <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-64 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="h-9 w-28 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty / Error States ─────────────────────────────────────────────────────

function EmptyState({ message }) {
  return (
    <div className={cn(panelClass, "p-10 text-center")}>
      <p className={cn("text-sm", metaTextClass)}>{message}</p>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className={cn(panelClass, "p-10 flex flex-col items-center gap-3")}>
      <AlertCircle className="size-8 text-red-400" />
      <p className={cn("text-sm", metaTextClass)}>Failed to load sessions</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 cursor-pointer">
        <RotateCcw className="size-3.5" />
        Retry
      </Button>
    </div>
  );
}

// ─── Session Tabs ─────────────────────────────────────────────────────────────

const TAB_LIST = [
  { key: "upcoming", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "past", label: "Past" },
];

function SessionTabs({ activeTab, onTabChange, counts }) {
  return (
    <div
      role="tablist"
      className="flex gap-1 rounded-xl border border-(--dashboard-border) bg-(--dashboard-panel-muted) p-1 w-fit"
    >
      {TAB_LIST.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          type="button"
          aria-selected={activeTab === key}
          onClick={() => onTabChange(key)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer",
            activeTab === key
              ? "bg-(--dashboard-panel-strong) text-(--dashboard-text) shadow-sm"
              : "text-(--dashboard-subtle) hover:text-(--dashboard-muted)",
          )}
        >
          {label}
          {counts[key] > 0 && (
            <span
              className={cn(
                "inline-flex min-w-4.5 h-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                activeTab === key
                  ? "bg-(--dashboard-purple) text-white"
                  : "bg-(--dashboard-border) text-(--dashboard-subtle)",
              )}
            >
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MenteeSessions() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [displayTimezone, setDisplayTimezone] = useState("");
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    let active = true;

    async function fetchSessions() {
      setLoading(true);
      setError(false);
      try {
        const res = await menteeApi.getMenteeBookings();
        if (active) {
          const data = res?.data ?? {};
          setDisplayTimezone(data.display_timezone ?? "");
          setUpcoming(data.upcoming ?? []);
          setPast(data.past ?? []);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchSessions();
    return () => {
      active = false;
    };
  }, [retryCount]);

  const todaySessions = useMemo(
    () => upcoming.filter((s) => isTodaySession(s.scheduled_at_local)),
    [upcoming],
  );

  const futureSessions = useMemo(
    () => upcoming.filter((s) => !isTodaySession(s.scheduled_at_local)),
    [upcoming],
  );

  const counts = {
    upcoming: futureSessions.length,
    today: todaySessions.length,
    past: past.length,
  };

  const tabData = {
    upcoming: futureSessions,
    today: todaySessions,
    past,
  };

  const emptyMessages = {
    upcoming: "No upcoming sessions scheduled.",
    today: "No sessions scheduled for today.",
    past: "No past sessions yet.",
  };

  const renderContent = () => {
    if (loading) return <SessionSkeleton />;
    if (error) return <ErrorState onRetry={() => setRetryCount((c) => c + 1)} />;
    const sessions = tabData[activeTab];
    if (!sessions.length) return <EmptyState message={emptyMessages[activeTab]} />;
    return (
      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} variant={activeTab} />
        ))}
      </div>
    );
  };

  return (
    <DashboardShell ariaLabel="My sessions" maxWidth="max-w-4xl">
      <DashboardHeader
        heading="My Sessions"
        subheading="View your past and upcoming mentorship sessions."
        timezone={displayTimezone || undefined}
      />

      <SessionTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      {renderContent()}
    </DashboardShell>
  );
}
