"use client";

import { motion } from "framer-motion";
import { Sparkles, CalendarDays, Repeat, AlertCircle } from "lucide-react";

export default function AvailabilityOptions({ onSelectOption }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col space-y-6"
    >
      {/* Recommendations Box */}
      <div className="rounded-[16px] border border-purple-100 bg-purple-50/50 p-4 shadow-sm dark:border-purple-900/30 dark:bg-purple-900/10">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#7c3aed,#c026d3)]">
            <Sparkles className="size-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">VEGA Recommendations</h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Based on your booking patterns:</p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 list-inside space-y-1">
              <li className="flex items-start gap-1.5 before:content-['•'] before:text-purple-400">
                <span>Evening slots (3-5 PM) get 40% more bookings</span>
              </li>
              <li className="flex items-start gap-1.5 before:content-['•'] before:text-purple-400">
                <span>Tuesday and Wednesday are your peak demand days</span>
              </li>
              <li className="flex items-start gap-1.5 before:content-['•'] before:text-purple-400">
                <span>Consider 15-minute buffer times between sessions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Choose how {`you'd`} like to set your availability:</p>

        <div className="space-y-3">
          <OptionCard
            icon={<CalendarDays className="size-5 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            title="Single Day Availability"
            subtitle="Set availability for a specific date with custom time ranges and breaks"
            onClick={() => onSelectOption("single")}
          />
          <OptionCard
            icon={<Repeat className="size-5 text-purple-600 dark:text-purple-400" />}
            iconBg="bg-purple-100 dark:bg-purple-900/30"
            title="Recurring Availability"
            subtitle="Set repeating availability for specific days of the week"
            onClick={() => onSelectOption("recurring")}
          />
          <OptionCard
            icon={<AlertCircle className="size-5 text-red-600 dark:text-red-400" />}
            iconBg="bg-red-100 dark:bg-red-900/30"
            title="Block Time"
            subtitle="Mark specific time slots as unavailable"
            onClick={() => onSelectOption("block")}
          />
        </div>
      </div>
    </motion.div>
  );
}

function OptionCard({ icon, iconBg, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-md dark:border-slate-800 dark:bg-(--dashboard-panel) dark:hover:border-purple-500/50"
    >
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconBg} transition-transform duration-200 group-hover:scale-110`}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 mb-1 transition-colors group-hover:text-purple-700 dark:group-hover:text-purple-400">
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </button>
  );
}
