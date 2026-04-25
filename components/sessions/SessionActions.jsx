import { Button } from "@/components/ui/button";
import { Play, Eye, Check, X, FileText } from "lucide-react";
import { motion } from "framer-motion";

export const SessionActions = ({ category, status }) => {
  if (category === "upcoming" || category === "today") {
    return (
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition-all">
          <Eye className="w-4 h-4 mr-2" />
          View Prep
        </Button>
        <Button className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition-all">
          <Play className="w-4 h-4 mr-2" />
          Join Session
        </Button>
      </div>
    );
  }

  if (category === "requests") {
    return (
      <div className="flex gap-4">
        <Button className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-none transition-all">
          Accept
        </Button>
        <Button variant="outline" className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-none transition-colors">
          Decline
        </Button>
      </div>
    );
  }

  if (category === "past" && status === "Completed") {
    return (
      <div className="flex gap-3">
        <Button variant="outline" className="w-full rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition-all">
          <FileText className="w-4 h-4 mr-2" />
          View Capsule
        </Button>
      </div>
    );
  }

  return null;
};
