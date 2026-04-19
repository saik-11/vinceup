/**
 * calendar-data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for the Mentor Calendar dashboard.
 *
 * ALL_SLOTS is the canonical dataset consumed by both views:
 *   - Month view   → derives a date-keyed status for each day
 *   - Week view    → derives date+hour-keyed slot objects
 *   - Sidebar      → upcoming bookings are a filtered subset
 *
 * Format:
 *   date    "YYYY-MM-DD"
 *   hour    0–23  (omit for all-day / day-level status only)
 *   status  "booked" | "available" | "blocked" | "pending"
 *   name    mentee display name (booked only)
 *   type    session type        (booked only)
 *   time    "H:MM AM/PM"        (booked only — used in sidebar)
 */

// ─── Canonical slot list ───────────────────────────────────────────────────────

export const ALL_SLOTS = [
  // ── Early June (day-level only — no hour; used by month grid) ──
  { date: "2026-06-02", status: "available" },
  { date: "2026-06-04", status: "available" },
  { date: "2026-06-05", status: "booked",    name: "David Park",    type: "Resume Review",      time: "10:00 AM" },
  { date: "2026-06-06", status: "available" },
  { date: "2026-06-07", status: "blocked" },
  { date: "2026-06-08", status: "booked",    name: "Nina Patel",    type: "Career Strategy",    time: "2:00 PM"  },
  { date: "2026-06-09", status: "available" },
  { date: "2026-06-10", status: "pending",   name: "Ryan Lee",      type: "Mock Interview",     time: "11:00 AM" },
  { date: "2026-06-11", status: "available" },
  { date: "2026-06-12", status: "booked",    name: "Zoe Adams",     type: "Technical Review",   time: "3:00 PM"  },
  { date: "2026-06-13", status: "available" },
  { date: "2026-06-14", status: "blocked" },

  // ── Week of Jun 15–21 (hour-level — used by BOTH month AND week grids) ──
  // Monday Jun 15
  { date: "2026-06-15", hour: 9,  status: "available" },
  { date: "2026-06-15", hour: 10, status: "booked",    name: "Alex Morgan",   type: "Resume Review",       time: "10:00 AM" },
  { date: "2026-06-15", hour: 14, status: "available" },

  // Tuesday Jun 16
  { date: "2026-06-16", hour: 10, status: "available" },
  { date: "2026-06-16", hour: 11, status: "booked",    name: "Sarah Johnson", type: "Mock Interview",      time: "11:00 AM" },
  { date: "2026-06-16", hour: 14, status: "available" },

  // Wednesday Jun 17
  { date: "2026-06-17", hour: 9,  status: "booked",    name: "Priya Sharma",  type: "Resume Review",       time: "9:00 AM"  },
  { date: "2026-06-17", hour: 11, status: "available" },
  { date: "2026-06-17", hour: 13, status: "blocked" },
  { date: "2026-06-17", hour: 14, status: "blocked" },

  // Thursday Jun 18
  { date: "2026-06-18", hour: 10, status: "available" },
  { date: "2026-06-18", hour: 11, status: "available" },
  { date: "2026-06-18", hour: 14, status: "booked",    name: "James Wilson",  type: "Technical Interview", time: "2:00 PM"  },

  // Friday Jun 19
  { date: "2026-06-19", hour: 9,  status: "available" },
  { date: "2026-06-19", hour: 10, status: "booked",    name: "Emma Davis",    type: "Career Strategy",     time: "10:00 AM" },
  { date: "2026-06-19", hour: 11, status: "available" },

  // Saturday Jun 20
  { date: "2026-06-20", hour: 10, status: "available" },
  { date: "2026-06-20", hour: 11, status: "available" },
  { date: "2026-06-20", hour: 14, status: "available" },

  // Sunday Jun 21
  { date: "2026-06-21", hour: 11, status: "blocked" },
  { date: "2026-06-21", hour: 12, status: "blocked" },
  { date: "2026-06-21", hour: 13, status: "blocked" },

  // ── Late June ──
  { date: "2026-06-22", status: "booked",    name: "Liam Carter",   type: "Career Guidance",    time: "11:00 AM" },
  { date: "2026-06-23", status: "available" },
  { date: "2026-06-24", status: "pending",   name: "Mia Turner",    type: "Resume Review",      time: "3:00 PM"  },
  { date: "2026-06-25", status: "booked",    name: "Noah Williams", type: "Mock Interview",     time: "10:00 AM" },
  { date: "2026-06-26", status: "available" },
  { date: "2026-06-27", status: "available" },
  { date: "2026-06-28", status: "booked",    name: "Olivia Brown",  type: "Technical Review",   time: "2:00 PM"  },
  { date: "2026-06-29", status: "available" },
];

// ─── Derived helpers ───────────────────────────────────────────────────────────

/**
 * Returns a Map<"YYYY-MM-DD", status> for the Month grid.
 * Hour-level slots contribute their date's dominant status
 * (booked > pending > blocked > available).
 */
export function buildMonthStatusMap(slots = ALL_SLOTS) {
  const PRIORITY = { booked: 4, pending: 3, blocked: 2, available: 1 };
  const map = new Map();
  for (const s of slots) {
    const prev = map.get(s.date);
    const prevPriority = PRIORITY[prev] ?? 0;
    const nextPriority = PRIORITY[s.status] ?? 0;
    if (nextPriority > prevPriority) map.set(s.date, s.status);
  }
  return map;
}

/**
 * Returns slot objects that have an `hour` — used by the Week grid.
 * slotMap[dateKey][hour] = slot
 */
export function buildWeekSlotMap(slots = ALL_SLOTS) {
  const map = {};
  for (const s of slots) {
    if (s.hour === undefined) continue;
    if (!map[s.date]) map[s.date] = {};
    map[s.date][s.hour] = s;
  }
  return map;
}

/**
 * Returns booked/pending slots sorted by date then time — used in the sidebar.
 * Filters to slots that are "upcoming" from the reference date (inclusive).
 */
export function getUpcomingBookings(slots = ALL_SLOTS, fromDate = new Date()) {
  const fromKey = toDateKeyFromDate(fromDate);
  return slots
    .filter(
      (s) =>
        (s.status === "booked" || s.status === "pending") &&
        s.name &&
        s.time &&
        s.date >= fromKey,
    )
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return (a.hour ?? 0) - (b.hour ?? 0);
    })
    .slice(0, 5); // show at most 5 upcoming
}

function toDateKeyFromDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ─── Shared bookings array (for CustomCalendar "bookings" prop) ────────────────

/**
 * Month-view bookings: one entry per day with the dominant status.
 */
export function buildMonthBookings(slots = ALL_SLOTS) {
  const statusMap = buildMonthStatusMap(slots);
  return Array.from(statusMap.entries()).map(([date, status]) => ({ date, status }));
}

// ─── Insights (one system, two contexts) ──────────────────────────────────────

import { TrendingUp, Clock, LayoutGrid, RefreshCw } from "lucide-react";

export const INSIGHTS = {
  month: [
    {
      id: "ins_peak",
      Icon: TrendingUp,
      iconClass: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
      title: "Peak Demand",
      body: "Tuesday afternoons have 40% more bookings",
    },
    {
      id: "ins_slots",
      Icon: Clock,
      iconClass: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-500/15",
      title: "Optimal Slots",
      body: "Consider adding 3–5 PM time blocks",
    },
    {
      id: "ins_buffer",
      Icon: RefreshCw,
      iconClass: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-500/15",
      title: "Buffer Time",
      body: "Add 15 min breaks between sessions",
    },
  ],
  week: [
    {
      id: "ins_busiest",
      Icon: TrendingUp,
      iconClass: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
      title: "Busiest Day",
      body: "Tuesday has the most sessions this week",
    },
    {
      id: "ins_gaps",
      Icon: Clock,
      iconClass: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-500/15",
      title: "Available Gaps",
      body: "12 open slots remaining this week",
    },
    {
      id: "ins_tip",
      Icon: LayoutGrid,
      iconClass: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-500/15",
      title: "Scheduling Tip",
      body: "Group sessions Mon–Wed for a clear end-of-week",
    },
  ],
};

// ─── Quick actions ─────────────────────────────────────────────────────────────

import { Repeat, Ban, CalendarDays } from "lucide-react";

export const QUICK_ACTIONS = [
  { id: "qa_recurring",  label: "Set Recurring Availability",  variant: "primary",  Icon: Repeat },
  { id: "qa_block",      label: "Block Time Off",              variant: "outline",  Icon: Ban },
  { id: "qa_sync",       label: "Sync with Google Calendar",   variant: "outline",  Icon: CalendarDays },
];
