import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CalendarDays, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBadge } from "./StatusBadge";
import { SessionActions } from "./SessionActions";
import { useTimeFormat } from "@/hooks/useTimeFormat";

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export const SessionCard = ({ session, category, index, onAction }) => {
  const mentee = session.mentee ?? {};
  const name = mentee.name ?? "Unknown";
  const email = mentee.email ?? "";
  const avatar = mentee.avatar ?? "";
  const isAvatarUrl = avatar.startsWith("http");
  const initials = getInitials(name);

  const sessionNumber = session.session_number ?? 1;
  const tags = session.tags ?? [];
  const serviceType = session.service_type ?? "";
  const scheduledAtLocal = session.scheduled_at_local ?? "";
  const status = session.status ?? "";
  const requestedAgo = session.requested_ago ?? null;
  const capsuleStatus = session.capsule_status ?? null;
  const duration = session.duration_minutes || session.duration;

  const isRequestsTab = category === "requests";

  const { formatSessionDateTime } = useTimeFormat();
  const { date, time } = formatSessionDateTime(scheduledAtLocal);
  const formattedScheduledAt = scheduledAtLocal ? `${date} • ${time}` : "—";

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-none hover:shadow-sm transition-all bg-white dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          {/* Top Row — avatar + name block + status badge */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white dark:border-slate-900 shadow-sm shrink-0 mt-0.5">
              {isAvatarUrl && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback className="bg-linear-to-br from-purple-100 dark:from-purple-900/50 to-indigo-100 dark:to-indigo-900/50 text-purple-700 dark:text-purple-300 font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name / email / badges — fills remaining space */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-base truncate leading-snug">
                  {name}
                </h4>
                {/* Status badge pulled here so it never overflows */}
                <StatusBadge status={status} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{email}</p>
              {/* Session # + tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <Badge
                  variant="secondary"
                  className="bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-md px-2 py-0.5 text-xs font-medium"
                >
                  Session #{ordinal(sessionNumber)}
                </Badge>
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md px-2 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Row — type & date/time info grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Type</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug break-words">
                {serviceType}
              </p>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                {isRequestsTab ? (
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {isRequestsTab ? "Requested" : "Scheduled"}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug break-words">
                {isRequestsTab && requestedAgo ? `${requestedAgo} ago` : formattedScheduledAt}
              </p>
            </div>
          </div>

          {/* Bottom Row — actions */}
          <SessionActions
            category={category}
            capsuleStatus={capsuleStatus}
            sessionId={session.id}
            duration={duration}
            onAction={onAction}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
