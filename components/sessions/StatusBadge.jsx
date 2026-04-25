import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Check, XCircle } from "lucide-react";

export const StatusBadge = ({ status }) => {
  const styles = {
    Confirmed: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
    Pending: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
    Completed: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    Cancelled: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
  };

  const icons = {
    Confirmed: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    Pending: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
    Completed: <Check className="w-3.5 h-3.5 mr-1" />,
    Cancelled: <XCircle className="w-3.5 h-3.5 mr-1" />,
  };

  const style = styles[status] || "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  const icon = icons[status] || null;

  return (
    <Badge variant="outline" className={`font-medium px-2.5 py-1 rounded-full flex items-center ${style}`}>
      {icon}
      {status}
    </Badge>
  );
};
