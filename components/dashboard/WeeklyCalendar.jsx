"use client";

/**
 * WeeklyCalendar
 * ─────────────────────────────────────────────────────────────────────────────
 * Props:
 *   slotMap          – Record<dateKey, Record<hour, slot>>  from buildWeekSlotMap()
 *   focusDate        – Date  (controlled — the current "anchor" date shown)
 *   onFocusDateChange– (Date) => void  called on prev/next/today navigation
 *   onSlotClick      – (slot) => void
 *   onEmptySlotClick – ({ dateKey, hour }) => void
 *   className        – extra CSS class
 */

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { panelClass, sectionTitleClass } from "@/components/dashboard/dashboard-shared";
import CalendarLegend from "@/components/dashboard/CalendarLegend";
import {
  MONTH_NAMES,
  CALENDAR_HOURS,
  ROW_HEIGHT_PX,
  STATUS_STYLES,
  addDays,
  getMonday,
  toDateKey,
  formatHour,
  formatWeekRange,
  startOfDay,
  isSameDaySimple,
} from "@/lib/calendar-utils";

// ─── Day column labels ─────────────────────────────────────────────────────────

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

// ─── Slot block ───────────────────────────────────────────────────────────────

function SlotBlock({ slot, onClick }) {
  const styles = STATUS_STYLES[slot.status] ?? STATUS_STYLES.available;
  const isBooked = slot.status === "booked";

  return (
    <button
      type="button"
      onClick={() => onClick?.(slot)}
      aria-label={`${slot.status}${isBooked ? `: ${slot.name} – ${slot.type}` : ""}`}
      className={cn(
        "w-full h-full overflow-hidden",
        "rounded-xl border px-2.5 py-2",
        "text-left text-[11px] font-semibold leading-tight",
        "transition-all duration-150 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] focus-visible:ring-offset-1",
        styles.cell,
        styles.hover,
      )}
    >
      {isBooked ? (
        <>
          <div className="flex items-center gap-1 mb-0.5">
            <User className="size-2.5 shrink-0 opacity-80" strokeWidth={2.5} />
            <span className="truncate font-bold opacity-95">{slot.name}</span>
          </div>
          <span className="block truncate opacity-75">{slot.type}</span>
        </>
      ) : (
        <span className="capitalize">{slot.status}</span>
      )}
    </button>
  );
}

// ─── Empty cell ───────────────────────────────────────────────────────────────

function EmptyCell({ dateKey, hour, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.({ dateKey, hour })}
      aria-label={`Add slot at ${formatHour(hour)}`}
      className={cn(
        "w-full h-full rounded-xl border border-dashed",
        "border-[rgba(15,23,42,0.09)] dark:border-[rgba(148,163,184,0.1)]",
        "bg-transparent transition-all duration-150",
        "hover:border-[rgba(124,58,237,0.28)] hover:bg-[rgba(124,58,237,0.03)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]",
        "cursor-pointer",
      )}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WeeklyCalendar({ slotMap = {}, focusDate, onFocusDateChange, onSlotClick, onEmptySlotClick, className }) {
  // Derive Monday from the controlled focusDate
  const monday = useMemo(() => getMonday(focusDate ?? new Date()), [focusDate]);

  // The 7 Date objects for this week (Mon … Sun)
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(monday, i)), [monday]);

  const todayNorm = useMemo(() => startOfDay(new Date()), []);

  // Navigation — always updates by calling onFocusDateChange so parent keeps state
  const goToPrev = () => onFocusDateChange?.(addDays(monday, -7));
  const goToNext = () => onFocusDateChange?.(addDays(monday, 7));
  const goToToday = () => onFocusDateChange?.(new Date());

  const colTemplate = "56px repeat(7, 1fr)";

  return (
    <Card className={cn(panelClass, "px-0 py-0 flex-1 min-w-0", className)}>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-xl font-bold tracking-tight text-(--dashboard-text) sm:text-2xl">{formatWeekRange(monday)}</h2>

          <div className="flex items-center gap-1.5">
            <NavBtn onClick={goToPrev} ariaLabel="Previous week">
              <ChevronLeft className="size-4" strokeWidth={2} />
            </NavBtn>
            <button
              type="button"
              onClick={goToToday}
              className="px-3 h-8 rounded-xl border border-(--dashboard-border) bg-(--dashboard-panel-strong) text-sm font-medium text-(--dashboard-purple) transition-all duration-150 hover:border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.06)] active:scale-95"
            >
              Today
            </button>
            <NavBtn onClick={goToNext} ariaLabel="Next week">
              <ChevronRight className="size-4" strokeWidth={2} />
            </NavBtn>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="overflow-x-auto -mx-1 px-1">
          <div className="min-w-[580px]">
            {/* Day header row */}
            <div className="grid mb-2" style={{ gridTemplateColumns: colTemplate, gap: "4px" }}>
              {/* Time gutter corner */}
              <div />

              {weekDays.map((day, idx) => {
                const key = toDateKey(day);
                const isToday = isSameDaySimple(day, todayNorm);
                return (
                  <div key={key} className="text-center">
                    <p
                      className={cn(
                        "text-[11px] font-semibold uppercase tracking-wide",
                        isToday ? "text-(--dashboard-purple)" : "text-(--dashboard-subtle)",
                      )}
                    >
                      {DAY_LABELS[idx]}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 font-bold",
                        isToday
                          ? "inline-flex size-7 items-center justify-center rounded-full bg-[#7c3aed] text-white mx-auto text-sm"
                          : "text-sm text-(--dashboard-text)",
                      )}
                    >
                      {day.getDate()}
                    </p>
                    <p className="text-[10px] text-(--dashboard-subtle) mt-0.5">
                      {MONTH_NAMES[day.getMonth()].slice(0, 3)} {day.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Hour rows — all exactly ROW_HEIGHT_PX tall */}
            <div className="flex flex-col" style={{ gap: "4px" }}>
              {CALENDAR_HOURS.map((hour) => (
                <div
                  key={hour}
                  className="grid"
                  style={{
                    gridTemplateColumns: colTemplate,
                    gap: "4px",
                    height: `${ROW_HEIGHT_PX}px`,
                  }}
                >
                  {/* Time label — vertically centred */}
                  <div className="flex items-center justify-end pr-2">
                    <span className="text-[10px] font-medium text-(--dashboard-subtle) whitespace-nowrap">{formatHour(hour)}</span>
                  </div>

                  {/* 7 day cells */}
                  {weekDays.map((day) => {
                    const key = toDateKey(day);
                    const slot = slotMap[key]?.[hour];
                    return (
                      <div key={key} className="h-full">
                        {slot ? (
                          <SlotBlock slot={slot} onClick={onSlotClick} />
                        ) : (
                          <EmptyCell dateKey={key} hour={hour} onClick={onEmptySlotClick} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shared legend */}
        <CalendarLegend />
      </CardContent>
    </Card>
  );
}
