import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBadge } from "./StatusBadge";
import { SessionActions } from "./SessionActions";

export const SessionCard = ({ session, index }) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-none hover:shadow-sm transition-all bg-white dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-900 shadow-sm">
                {session.avatarUrl && <AvatarImage src={session.avatarUrl} />}
                <AvatarFallback className="bg-gradient-to-br from-purple-100 dark:from-purple-900/50 to-indigo-100 dark:to-indigo-900/50 text-purple-700 dark:text-purple-300 font-semibold">
                  {session.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{session.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{session.email}</p>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md px-2 py-0.5 text-xs font-medium">
                    {session.badgeType}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-md px-2 py-0.5 text-xs font-medium">
                    Session #{session.sessionNumber}
                  </Badge>
                </div>
              </div>
            </div>
            <StatusBadge status={session.status} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Type</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{session.type}</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Duration</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{session.duration}</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Scheduled</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{session.scheduledAt}</p>
            </div>
          </div>

          <SessionActions category={session.category} status={session.status} />
        </CardContent>
      </Card>
    </motion.div>
  );
};
