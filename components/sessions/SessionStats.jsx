import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, TrendingUp } from "lucide-react";

export const SessionStats = ({ stats }) => {
  const sessionsThisMonth = stats?.this_month_sessions ?? 0;
  const pendingRequests = stats?.pending_requests ?? 0;
  const completionRate = stats?.completion_rate_pct ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sessions This Month</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{sessionsThisMonth}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Requests</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{pendingRequests}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completion Rate</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{completionRate}%</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
