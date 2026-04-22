"use client";

/**
 * CalendarLegend — shared by both Month and Week calendar views.
 * Renders a row of coloured swatches with status labels.
 *
 * Props:
 *   className  – extra class on the wrapper div
 *   showBorder – whether to show a top border separator (default true)
 */

import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/calendar-utils";

export default function CalendarLegend({ className, showBorder = true }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", showBorder && "pt-4 border-t border-(--dashboard-border)", className)}>
      {Object.entries(STATUS_STYLES).map(([key, s]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span className={cn("size-3 rounded-sm shrink-0 border border-black/5", s.swatch)} />
          <span className="text-xs font-medium text-(--dashboard-subtle) capitalize">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
