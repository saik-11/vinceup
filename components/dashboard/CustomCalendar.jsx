"use client";

/**
 * CustomCalendar — Month grid view.
 * ─────────────────────────────────────────────────────────────────────────────
 * Props:
 *   statusMap        – Map<"YYYY-MM-DD", status>  from buildMonthStatusMap()
 *   focusDate        – Date  (controlled — any day in the month to show)
 *   onFocusDateChange– (Date) => void  called on prev/next/today nav
 *   selectedDate     – Date | null  (controlled)
 *   onDateSelect     – (Date) => void
 *   showLegend       – boolean (default true)
 *   showTodayButton  – boolean (default true)
 *   className        – extra class on the outer Card
 */

import { useMemo, useCallback } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { panelClass } from "@/components/dashboard/dashboard-shared";
import CalendarLegend from "@/components/dashboard/CalendarLegend";
import { STATUS_STYLES } from "@/lib/calendar-utils";

// ─── Constants ────────────────────────────────────────────────────────────────

// Month view starts on Sunday to match previous implementation
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Style helpers ─────────────────────────────────────────────────────────────

/** Map from unified STATUS_STYLES to month-specific class keys. */
function getMonthStyles(status) {
  const s = STATUS_STYLES[status];
  if (!s) {
    // Default (no status)
    return {
      cell: "bg-white text-slate-800 border-slate-200 dark:bg-(--dashboard-panel-muted) dark:text-(--dashboard-muted) dark:border-(--dashboard-border) hover:bg-slate-50 dark:hover:bg-white/4",
      dot: null,
    };
  }
  return {
    cell: cn(s.monthCell, s.monthHover),
    dot: s.monthDot,
  };
}

// ─── DayCell ──────────────────────────────────────────────────────────────────

function DayCell({ date, status, isCurrentMonth, isSelected, isPast, onSelect }) {
  if (!date) {
    return <div className="aspect-square rounded-xl" aria-hidden="true" />;
  }

  const today = isToday(date);
  const styles = getMonthStyles(isCurrentMonth && !isPast ? status : null);

  return (
    <button
      type="button"
      aria-label={format(date, "MMMM d, yyyy") + (status ? `, ${status}` : "") + (today ? ", today" : "")}
      aria-pressed={isSelected}
      onClick={() => isCurrentMonth && !isPast && onSelect?.(date)}
      className={cn(
        "group relative flex flex-col items-center justify-center aspect-square rounded-xl border text-sm font-semibold transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 gap-0.5",
        isCurrentMonth && !isPast ? styles.cell : "opacity-40 bg-slate-50/50 text-slate-400 border-transparent dark:bg-white/4 cursor-default",
        isPast && isCurrentMonth && "text-slate-400 opacity-50 bg-slate-50/50 border-slate-100 cursor-not-allowed pointer-events-none dark:border-white/5",
        isSelected && isCurrentMonth && !isPast && "ring-2 ring-offset-1 ring-violet-700 dark:ring-violet-300 scale-[1.08]",
        (!isCurrentMonth || isPast) && "pointer-events-none",
      )}
    >
      {/* Today: filled purple circle on the number — matches week view treatment */}
      {today && isCurrentMonth ? (
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#7c3aed] text-white text-sm font-bold leading-none">
          {format(date, "d")}
        </span>
      ) : (
        <span className="leading-none">{format(date, "d")}</span>
      )}
      {isCurrentMonth && !isPast && styles.dot && <span className={cn("size-1 rounded-full shrink-0", styles.dot)} />}
    </button>
  );
}

// ─── Nav button ───────────────────────────────────────────────────────────────

function NavBtn({ onClick, ariaLabel, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex size-8 items-center justify-center rounded-xl border border-(--dashboard-border) bg-(--dashboard-panel-strong) text-(--dashboard-subtle) transition-all duration-150 hover:border-[rgba(124,58,237,0.3)] hover:text-(--dashboard-purple) active:scale-95"
    >
      {children}
    </button>
  );
}

// ─── CustomCalendar ───────────────────────────────────────────────────────────

export default function CustomCalendar({
  statusMap = new Map(),
  focusDate,
  onFocusDateChange,
  selectedDate = null,
  onDateSelect,
  showLegend = true,
  showTodayButton = true,
  className,
}) {
  // Derive the month to display from the controlled focusDate
  const viewDate = useMemo(() => startOfMonth(focusDate ?? new Date()), [focusDate]);

  // Build the 42-cell grid (6 weeks × 7 days, Sunday-first)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
    while (days.length < 42) days.push(null);
    return days;
  }, [viewDate]);

  const todayNorm = useMemo(() => startOfDay(new Date()), []);

  // Navigation — delegated to parent via onFocusDateChange
  const goToPrevMonth = useCallback(() => {
    onFocusDateChange?.(subMonths(viewDate, 1));
  }, [viewDate, onFocusDateChange]);

  const goToNextMonth = useCallback(() => {
    onFocusDateChange?.(addMonths(viewDate, 1));
  }, [viewDate, onFocusDateChange]);

  const goToToday = useCallback(() => {
    onFocusDateChange?.(new Date());
  }, [onFocusDateChange]);

  const handleDateSelect = useCallback(
    (date) => {
      onDateSelect?.(date);
      // Also update the focus so week view jumps to this date's week
      onFocusDateChange?.(date);
    },
    [onDateSelect, onFocusDateChange],
  );

  return (
    <Card className={cn(panelClass, "px-0 py-0", className)}>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Month navigation header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-xl font-bold tracking-tight text-(--dashboard-text) sm:text-2xl">{format(viewDate, "MMMM yyyy")}</h2>

          <div className="flex items-center gap-1.5">
            <NavBtn onClick={goToPrevMonth} ariaLabel="Previous month">
              <ChevronLeft className="size-4" strokeWidth={2} />
            </NavBtn>

            {showTodayButton && (
              <button
                type="button"
                onClick={goToToday}
                className="px-3 h-8 rounded-xl border border-(--dashboard-border) bg-(--dashboard-panel-strong) text-sm font-medium text-(--dashboard-purple) transition-all duration-150 hover:border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.06)] active:scale-95"
              >
                Today
              </button>
            )}

            <NavBtn onClick={goToNextMonth} ariaLabel="Next month">
              <ChevronRight className="size-4" strokeWidth={2} />
            </NavBtn>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1.5" role="row">
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              role="columnheader"
              className="text-center text-[11px] font-semibold uppercase tracking-wide text-(--dashboard-subtle) py-1 select-none"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1.5" role="grid" aria-label={format(viewDate, "MMMM yyyy")}>
          {calendarDays.map((date, i) => {
            if (!date) {
              return <div key={`pad-${i}`} className="aspect-square" aria-hidden="true" />;
            }
            const key = format(date, "yyyy-MM-dd");
            const status = statusMap.get(key) ?? null;
            const inMonth = isSameMonth(date, viewDate);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isPast = date < todayNorm;

            return (
              <DayCell key={key} date={date} status={status} isCurrentMonth={inMonth} isSelected={isSelected} isPast={isPast} onSelect={handleDateSelect} />
            );
          })}
        </div>

        {/* Shared Legend */}
        {showLegend && <CalendarLegend showBorder={false} />}
      </CardContent>
    </Card>
  );
}
