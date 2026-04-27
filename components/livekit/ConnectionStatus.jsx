"use client";

import { ConnectionState } from "livekit-client";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Loader2, AlertCircle } from "lucide-react";

const STATE_CONFIG = {
  [ConnectionState.Disconnected]: {
    label: "Disconnected",
    icon: WifiOff,
    className: "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
    dot: "bg-slate-400",
  },
  [ConnectionState.Connecting]: {
    label: "Connecting...",
    icon: Loader2,
    className: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-400",
    spin: true,
  },
  [ConnectionState.Connected]: {
    label: "Connected",
    icon: Wifi,
    className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-400",
    pulse: true,
  },
  [ConnectionState.Reconnecting]: {
    label: "Reconnecting...",
    icon: Loader2,
    className: "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400",
    dot: "bg-orange-400",
    spin: true,
  },
};

export function ConnectionStatus({ connectionState, className }) {
  const cfg = STATE_CONFIG[connectionState] ?? STATE_CONFIG[ConnectionState.Disconnected];
  const Icon = cfg.icon;

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium", cfg.className, className)}>
      <span className="relative flex h-2 w-2">
        {cfg.pulse && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", cfg.dot)} />
        )}
        <span className={cn("relative inline-flex rounded-full h-2 w-2", cfg.dot)} />
      </span>
      <Icon className={cn("h-3.5 w-3.5", cfg.spin && "animate-spin")} />
      {cfg.label}
    </div>
  );
}
