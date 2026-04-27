import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CalendarDays, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBadge } from "./StatusBadge";
import { SessionActions } from "./SessionActions";

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

  const isRequestsTab = category === "requests";

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-none hover:shadow-sm transition-all bg-white dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-6">
          {/* Top Row */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-900 shadow-sm shrink-0">
                {isAvatarUrl && <AvatarImage src={avatar} alt={name} />}
                <AvatarFallback className="bg-linear-to-br from-purple-100 dark:from-purple-900/50 to-indigo-100 dark:to-indigo-900/50 text-purple-700 dark:text-purple-300 font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg truncate">{name}</h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{email}</p>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
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
            <div className="ml-4 shrink-0">
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Type</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{serviceType}</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                {isRequestsTab ? <Clock className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
                <span className="text-xs font-medium uppercase tracking-wider">
                  {isRequestsTab ? "Requested" : "Scheduled"}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {isRequestsTab && requestedAgo ? `${requestedAgo} ago` : scheduledAtLocal}
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <SessionActions
            category={category}
            capsuleStatus={capsuleStatus}
            sessionId={session.id}
            onAction={onAction}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
