"use client";
// ← Client component; metadata lives in page.jsx (Server Component).

import { useState, useMemo, useEffect } from "react";
import { CalendarDays, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardShell, panelClass, subCardClass, sectionTitleClass, metaTextClass } from "@/components/dashboard/dashboard-shared";
import CustomCalendar from "@/components/dashboard/CustomCalendar";
import WeeklyCalendar from "@/components/dashboard/WeeklyCalendar";
import AvailabilityModal from "@/components/dashboard/availability-modal/AvailabilityModal";
import { INSIGHTS, QUICK_ACTIONS } from "@/lib/calendar-data";
import { formatDateKey, formatTimeWithTimezone } from "@/lib/calendar-utils";
import { mentorApi } from "@/services/service";
import { useAuth } from "@/hooks/useAuth";

// ─── VEGA Scheduling Insights ─────────────────────────────────────────────────

function InsightMiniCard({ insight }) {
  const { Icon } = insight;
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/8 p-3 sm:p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-lg", insight.iconBg)}>
          <Icon className={cn("size-3.5", insight.iconClass)} strokeWidth={2.2} />
        </span>
        <p className="text-sm font-semibold text-slate-800 dark:text-(--dashboard-text)">{insight.title}</p>
      </div>
      <p className="text-xs leading-5 text-slate-600 dark:text-(--dashboard-muted)">{insight.body}</p>
    </div>
  );
}

function VegaInsightsCard({ view }) {
  const insights = INSIGHTS[view] ?? INSIGHTS.month;
  return (
    <div className="overflow-hidden rounded-[20px] border border-[rgba(124,58,237,0.2)] bg-[linear-gradient(135deg,rgba(237,233,254,0.92)_0%,rgba(221,214,254,0.65)_50%,rgba(237,233,254,0.85)_100%)] p-4 sm:p-5 dark:border-[rgba(167,139,250,0.2)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.14)_0%,rgba(192,38,211,0.1)_50%,rgba(124,58,237,0.06)_100%)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_8px_20px_-6px_rgba(124,58,237,0.5)]">
          <Sparkles className="size-5 text-white" strokeWidth={2} />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-(--dashboard-text)">✨ VEGA Scheduling Insights</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {insights.map((ins) => (
          <InsightMiniCard key={ins.id} insight={ins} />
        ))}
      </div>
    </div>
  );
}

// ─── Right panel ──────────────────────────────────────────────────────────────

function BookingItem({ booking }) {
  return (
    <div className={cn(subCardClass, "flex flex-col gap-1 p-3.5 hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_8px_20px_-12px_rgba(124,58,237,0.2)]")}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-(--dashboard-subtle)">
        <CalendarDays className="size-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
        <span>
          <span className="text-(--dashboard-text)">{formatDateKey(booking.date)}</span>
          &nbsp;{booking.time}
        </span>
      </div>
      <p className="text-sm font-bold text-(--dashboard-text)">{booking.name}</p>
      <p className={cn(metaTextClass, "text-xs")}>{booking.type}</p>
    </div>
  );
}

function RightPanel({ upcomingBookings, onQuickAction }) {
  return (
    <Card className={cn(panelClass, "px-0 py-0 w-full lg:w-72 xl:w-80 shrink-0")}>
      <CardContent className="p-4 sm:p-5 space-y-5">
        {/* Upcoming Bookings */}
        <section aria-label="Upcoming bookings" className="space-y-3">
          <h2 className={cn(sectionTitleClass, "text-base")}>Upcoming Bookings</h2>
          <div className="flex flex-col gap-2.5">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((bk) => (
                <BookingItem key={bk.id} booking={bk} />
              ))
            ) : (
              <p className="text-sm text-(--dashboard-subtle) italic px-2">No upcoming bookings.</p>
            )}
          </div>
        </section>

        <hr className="border-(--dashboard-border)" />

        {/* Quick Actions */}
        <section aria-label="Quick actions" className="space-y-2.5">
          <h2 className={cn(sectionTitleClass, "text-base")}>Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {QUICK_ACTIONS.map((qa) => {
              const { Icon } = qa;
              return qa.variant === "primary" ? (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => onQuickAction?.(qa.id)}
                  className="flex items-center justify-center gap-2 w-full rounded-[14px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_-6px_rgba(124,58,237,0.5)] transition-all duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)] active:scale-[0.98]"
                >
                  <Icon className="size-4" strokeWidth={2} />
                  {qa.label}
                </button>
              ) : (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => onQuickAction?.(qa.id)}
                  className="flex items-center justify-center gap-2 w-full rounded-[14px] border border-(--dashboard-border-strong) bg-(--dashboard-panel-strong) px-4 py-2.5 text-sm font-semibold text-(--dashboard-muted) transition-all duration-200 hover:border-[rgba(124,58,237,0.25)] hover:text-(--dashboard-purple) hover:bg-(--dashboard-panel-muted) active:scale-[0.98]"
                >
                  <Icon className="size-4" strokeWidth={2} />
                  {qa.label}
                </button>
              );
            })}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────

function PageHeader({ view, setView, onSetAvailability }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-(--dashboard-text) sm:text-4xl">Calendar</h1>
        <p className={cn(metaTextClass, "mt-1")}>Manage your availability and bookings</p>
      </div>

      <div className="flex shrink-0 items-center gap-2 flex-wrap">
        {/* Month / Week toggle */}
        <div className="flex rounded-[12px] border border-(--dashboard-border) bg-(--dashboard-panel-strong) p-0.5 shadow-sm">
          {["month", "week"].map((v) => (
            <button
              key={v}
              type="button"
              id={`calendar-view-${v}`}
              onClick={() => setView(v)}
              className={cn(
                "px-3.5 py-1.5 text-sm font-medium rounded-[10px] capitalize transition-all duration-150",
                view === v ? "bg-[#7c3aed] text-white shadow-sm" : "text-(--dashboard-subtle) hover:text-(--dashboard-muted)",
              )}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <button
          type="button"
          id="set-availability-btn"
          onClick={onSetAvailability}
          className="flex items-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_16px_-6px_rgba(124,58,237,0.5)] transition-all duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)] active:scale-[0.98]"
        >
          Set Availability
        </button>
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function MentorCalendarContent() {
  // ── Shared state ───────────────────────────────────────────────────────────
  const [view, setView] = useState("month");
  const [focusDate, setFocusDate] = useState(() => new Date()); 
  const [selectedDate, setSelectedDate] = useState(null);

  const [modalState, setModalState] = useState({ isOpen: false, screen: "options" });
  
  const [apiSlots, setApiSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const openModal = (screen = "options") => setModalState({ isOpen: true, screen });
  const closeModal = (didChange = false) => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setSelectedDate(null);
    if (didChange === true) {
      fetchSlots();
    }
  };
  
  // Safe timezone-agnostic date parsing from YYYY-MM-DD
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const { isAuthenticated } = useAuth();

  const handleQuickAction = (id) => {
    if (id === "qa_recurring") openModal("recurring");
    else if (id === "qa_block") openModal("block");
    else console.log("Unmapped quick action:", id);
  };

  const fetchSlots = () => {
    setIsLoading(true);
    mentorApi.getAvailability()
      .then((res) => {
        const dataSlots = res.slots || (res.data && res.data.slots) || [];
        setApiSlots(dataSlots);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch calendar slots.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const { monthStatusMap, weekSlotMap } = useMemo(() => {
    const monthMap = new Map();
    const weekMap = {};
    const PRIORITY = { booked: 4, blocked: 2, available: 1 };

    for (const s of apiSlots) {
      const status = s.is_booked ? "booked" : "available";
      
      const prevPriority = PRIORITY[monthMap.get(s.date)] || 0;
      const nextPriority = PRIORITY[status] || 0;
      if (nextPriority > prevPriority) monthMap.set(s.date, status);

      const timeParts = (s.start_time || "00:00").split(":");
      const hourNum = parseInt(timeParts[0], 10);
      if (!isNaN(hourNum)) {
        if (!weekMap[s.date]) weekMap[s.date] = {};
        
        let timeLabel = formatTimeWithTimezone(s.start_time, s.timezone);

        weekMap[s.date][hourNum] = {
           id: s.id,
           date: s.date,
           hour: hourNum,
           status: status,
           name: "Booked Session", 
           type: s.service_type || "Session", 
           time: timeLabel
        };
      }
    }
    return { monthStatusMap: monthMap, weekSlotMap: weekMap };
  }, [apiSlots]);

  const upcomingBookings = useMemo(() => {
    const y = focusDate.getFullYear();
    const m = String(focusDate.getMonth() + 1).padStart(2, "0");
    const d = String(focusDate.getDate()).padStart(2, "0");
    const fromKey = `${y}-${m}-${d}`;

    const filtered = apiSlots.filter((s) => s.is_booked && s.date >= fromKey);
    return filtered.map((s) => {
      const timeParts = (s.start_time || "00:00").split(":");
      const hourNum = parseInt(timeParts[0], 10) || 0;
      let timeLabel = formatTimeWithTimezone(s.start_time, s.timezone);

      return {
         id: s.id,
         date: s.date,
         hour: hourNum,
         time: timeLabel,
         name: s.service_type || "Booked Session",
         type: s.service_type || "Session"
      };
    }).sort((a, b) => {
       if (a.date !== b.date) return a.date < b.date ? -1 : 1;
       return a.hour - b.hour;
    }).slice(0, 5);
  }, [apiSlots, focusDate]);

  return (
    <DashboardShell ariaLabel="Mentor calendar availability dashboard" maxWidth="max-w-6xl">
      <PageHeader view={view} setView={setView} onSetAvailability={() => openModal()} />

      {/* Insights swap content but keep same design */}
      <VegaInsightsCard view={view} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {isLoading ? (
          <div className="flex-1 min-w-0 flex items-center justify-center min-h-[400px] border border-(--dashboard-border) rounded-[20px] bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(15,23,42,0.4)] shadow-sm backdrop-blur-md">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="size-10 animate-spin text-[#7c3aed]" />
              <p className="text-sm font-semibold text-(--dashboard-muted)">Loading your schedule...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 min-w-0 flex items-center justify-center min-h-[400px] border border-red-500/20 rounded-[20px] bg-red-50/50 dark:bg-red-500/5 shadow-sm backdrop-blur-md">
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="size-10 text-red-500" />
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-3 text-xs font-bold px-5 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 rounded-[14px] text-red-700 dark:text-red-300 transition-colors shadow-sm">
                Try Again
              </button>
            </div>
          </div>
        ) : view === "week" ? (
          // ── Week view ── focusDate controls which week is shown
          <WeeklyCalendar
            slotMap={weekSlotMap}
            focusDate={focusDate}
            onFocusDateChange={setFocusDate}
            onSlotClick={(slot) => {
              setSelectedDate(parseLocalDate(slot.date));
              openModal("options");
            }}
            onEmptySlotClick={(info) => {
              setSelectedDate(parseLocalDate(info.dateKey));
              openModal("options");
            }}
            className="flex-1 min-w-0"
          />
        ) : (
          // ── Month view ── focusDate controls which month is shown
          <CustomCalendar
            statusMap={monthStatusMap}
            focusDate={focusDate}
            onFocusDateChange={setFocusDate}
            selectedDate={selectedDate}
            onDateSelect={(d) => {
              setSelectedDate(d);
              openModal("options");
            }}
            showLegend
            showTodayButton
            className="flex-1 min-w-0"
          />
        )}

        <RightPanel upcomingBookings={upcomingBookings} onQuickAction={handleQuickAction} />
      </div>

      <AvailabilityModal isOpen={modalState.isOpen} onClose={closeModal} initialScreen={modalState.screen} selectedDate={selectedDate} />
    </DashboardShell>
  );
}
