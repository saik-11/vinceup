/**
 * calendar-utils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared date utilities and style constants used by BOTH Month and Week views.
 * No React imports — pure JS so it can be imported anywhere.
 */

// ─── Month names ──────────────────────────────────────────────────────────────

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Date helpers ──────────────────────────────────────────────────────────────

/** "YYYY-MM-DD" from a Date object. */
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Add n days to a date (immutable). */
export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/** Return the Monday of the week containing `date`. */
export function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Return midnight of a date (immutable, normalised). */
export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** True if two Date objects resolve to the same calendar day. */
export function isSameDaySimple(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Format hour (0-23) as "8:00 AM" / "2:00 PM". */
export function formatHour(h) {
  if (h === 0) return "12:00 AM";
  if (h < 12) return `${h}:00 AM`;
  if (h === 12) return "12:00 PM";
  return `${h - 12}:00 PM`;
}

/** Format a "YYYY-MM-DD" string as "Jun 15". */
export function formatDateKey(key) {
  const [, m, d] = key.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1].slice(0, 3)} ${parseInt(d, 10)}`;
}

/** Format week range: "June 15 – 21, 2026" or cross-month "May 30 – Jun 5, 2026". */
export function formatWeekRange(monday) {
  const sunday = addDays(monday, 6);
  const sMonth = MONTH_NAMES[monday.getMonth()];
  const eMonth = MONTH_NAMES[sunday.getMonth()];
  const year = sunday.getFullYear();
  if (monday.getMonth() === sunday.getMonth()) {
    return `${sMonth} ${monday.getDate()} – ${sunday.getDate()}, ${year}`;
  }
  return `${sMonth} ${monday.getDate()} – ${eMonth.slice(0, 3)} ${sunday.getDate()}, ${year}`;
}

// ─── Hour rows shown in the Week grid ─────────────────────────────────────────

export const CALENDAR_HOURS = [8, 9, 10, 11, 12, 13, 14];

/** Fixed pixel height for every hour row — ensures identical cell heights. */
export const ROW_HEIGHT_PX = 80;

// ─── Shared status styles ──────────────────────────────────────────────────────
//
// One definition → used by WeeklyCalendar slots AND CalendarLegend.
// CustomCalendar has its own legacy getStatusStyles() but the legend
// is now replaced by the shared CalendarLegend component.

export const STATUS_STYLES = {
  booked: {
    // Week grid slot
    cell: "bg-[#7c3aed] border-[#6d28d9] text-white shadow-[0_4px_12px_-4px_rgba(124,58,237,0.45)]",
    hover: "hover:bg-[#6d28d9] hover:shadow-[0_6px_16px_-4px_rgba(124,58,237,0.55)]",
    // Month grid cell
    monthCell: "bg-[#5B3FE8] text-white border-transparent",
    monthHover: "hover:bg-[#4e35d4]",
    monthDot: "bg-white/70",
    // Legend swatch
    swatch: "bg-[#7c3aed]",
    label: "Booked",
  },
  available: {
    cell: "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-500/15 dark:border-emerald-500/40 dark:text-emerald-300",
    hover: "hover:bg-emerald-100 dark:hover:bg-emerald-500/25",
    monthCell: "bg-[#d1fadf] text-emerald-800 border-[#bbf7d0]",
    monthHover: "hover:bg-[#bbf7d0]",
    monthDot: "bg-emerald-500",
    swatch: "bg-emerald-500",
    label: "Available",
  },
  blocked: {
    cell: "bg-red-50 border-red-300 text-red-700 dark:bg-red-500/15 dark:border-red-500/40 dark:text-red-300",
    hover: "hover:bg-red-100 dark:hover:bg-red-500/25",
    monthCell: "bg-[#ffd5d5] text-red-700 border-[#fecaca]",
    monthHover: "hover:bg-[#fecaca]",
    monthDot: "bg-red-400",
    swatch: "bg-red-500",
    label: "Blocked",
  },
  pending: {
    cell: "bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-500/15 dark:border-amber-500/40 dark:text-amber-300",
    hover: "hover:bg-amber-100 dark:hover:bg-amber-500/25",
    monthCell: "bg-[#fef9c3] text-yellow-800 border-[#fef08a]",
    monthHover: "hover:bg-[#fef08a]",
    monthDot: "bg-yellow-400",
    swatch: "bg-amber-400",
    label: "Pending",
  },
};
