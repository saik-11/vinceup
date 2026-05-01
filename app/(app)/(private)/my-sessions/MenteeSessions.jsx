"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, ChevronRight, Sparkles, FileText, AlertCircle, RotateCcw, Video } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useTimeFormat } from "@/hooks/useTimeFormat";

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

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ session, variant }) {
  const { formatSessionDateTime } = useTimeFormat();
  const { date, time } = formatSessionDateTime(session.scheduled_at_local);
  const isUpcomingVariant = variant === "upcoming" || variant === "today";

  return (
    <Card
      className={cn(
        panelClass,
        interactivePanelClass,
        "group flex flex-col gap-3",
        "p-4 sm:p-5 md:p-6",
      )}
    >
      {/* Session info + status badge */}
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <article className="flex flex-col min-w-0 flex-1 gap-1">
          <h3 className="text-base font-semibold tracking-tight md:text-lg text-(--dashboard-text) leading-snug">
            {session.service_type}
          </h3>

          {session.notes && (
            <p className={cn("text-sm line-clamp-1", metaTextClass)}>{session.notes}</p>
          )}

          <div className={cn("flex items-center gap-2 mt-0.5 text-sm", metaTextClass)}>
            <Calendar className="w-3.5 h-3.5 opacity-60 shrink-0" aria-hidden="true" />
            <time dateTime={session.scheduled_at_local} className="leading-snug">
              {date}&nbsp;&bull;&nbsp;{time}
            </time>
          </div>
        </article>

        {/* Status badge — always top-right, never overflows */}
        <StatusBadge status={session.status} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {isUpcomingVariant && session.status !== "cancelled" && (
          <>
            {session.status === "confirmed" && (
              <Button
                onClick={() => {
                  const d = session.duration_minutes || session.duration;
                  window.location.href = `/session/${session.id}${d ? `?duration=${d}` : ""}`;
                }}
                className="gap-2 px-4 text-sm text-white rounded-full shadow-sm bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all duration-200"
              >
                <Video className="w-4 h-4" aria-hidden="true" />
                Join the session
              </Button>
            )}
            <Button className="gap-2 px-4 text-sm text-white rounded-full shadow-sm bg-[linear-gradient(135deg,#7c3aed,#c026d3)] hover:opacity-90 hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)] active:scale-95 transition-all duration-200">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              View Prep
            </Button>
            <Button
              variant="ghost"
              className="gap-1 px-3 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 group/btn rounded-full"
            >
              Details
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
            </Button>
          </>
        )}

        {variant === "past" && (
          <Button
            variant="ghost"
            className="gap-1 px-3 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 group/btn rounded-full"
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_LIST = [
  { key: "upcoming", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "past", label: "Past" },
];

export default function MenteeSessions() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [displayTimezone, setDisplayTimezone] = useState("");
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const { isTodaySession } = useTimeFormat();

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
    [upcoming, isTodaySession],
  );

  const futureSessions = useMemo(
    () => upcoming.filter((s) => !isTodaySession(s.scheduled_at_local)),
    [upcoming, isTodaySession],
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

  const renderContent = (tabKey) => {
    if (loading) return <SessionSkeleton />;
    if (error) return <ErrorState onRetry={() => setRetryCount((c) => c + 1)} />;
    const sessions = tabData[tabKey];
    if (!sessions.length) return <EmptyState message={emptyMessages[tabKey]} />;
    return (
      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} variant={tabKey} />
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <TabsList className="bg-transparent h-auto p-0 pb-[3.8rem] border-b border-slate-200 dark:border-slate-800 w-full grid grid-cols-3 rounded-none">
          {TAB_LIST.map((cat, index) => {
            const count = counts[cat.key] ?? 0;
            return (
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className={`group relative flex items-center justify-center gap-2 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-l-0 data-[state=active]:border-purple-600 data-[state=active]:dark:border-purple-800 border border-transparent rounded-none py-4 sm:py-5 font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all -mb-px
                  ${index === 0 ? "rounded-tl-xl" : ""} ${index === TAB_LIST.length - 1 ? "rounded-tr-xl" : ""}`}
              >
                <div className="flex items-center">
                  {cat.label}
                </div>
                <span className="py-0.5 px-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold group-data-[state=active]:bg-purple-100 dark:group-data-[state=active]:bg-purple-500/20 group-data-[state=active]:text-purple-700 dark:group-data-[state=active]:text-purple-300">
                  {count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence>
          {TAB_LIST.map((cat) => (
            <TabsContent key={cat.key} value={cat.key} className="mt-0 outline-none">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-6 flex flex-col gap-4 bg-slate-50 dark:bg-slate-900"
              >
                {renderContent(cat.key)}
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>
    </DashboardShell>
  );
}
