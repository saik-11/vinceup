import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionCard } from "./SessionCard";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "upcoming", label: "Upcoming" },
  { id: "requests", label: "Requests" },
  { id: "today", label: "Today" },
  { id: "past", label: "Past" },
];

export const SessionTabs = ({ sessions }) => {
  const groupedSessions = sessions.reduce(
    (acc, session) => {
      (acc[session.category] ??= []).push(session);
      return acc;
    },
    {
      upcoming: [],
      requests: [],
      today: [],
      past: [],
    },
  );

  return (
    <Tabs defaultValue="upcoming" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
      <TabsList className="bg-transparent h-auto p-0 pb-[3.8rem] border-b border-slate-200 dark:border-slate-800 w-full grid grid-cols-4 rounded-none">
        {categories.map((cat, index) => {
          const count = groupedSessions[cat.id]?.length ?? 0;
          const hasDot = cat.id === "requests" && count > 0;
          return (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className={`group relative flex items-center justify-center gap-2 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-none data-[state=active]:border-b-[3px]   data-[state=active]:border-t-0
                          data-[state=active]:border-r-0 data-[state=active]:border-l-0 data-[state=active]:border-purple-600 data-[state=active]:dark:border-purple-800 border border-transparent rounded-none py-4 sm:py-5 font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all -mb-px
                ${index === 0 ? "rounded-tl-xl" : ""} ${index === categories.length - 1 ? "rounded-tr-xl" : ""}`}
            >
              <div className="flex items-center">
                {hasDot && <span className="w-2 h-2 rounded-full bg-amber-400 mr-2" />}
                {cat.label}
              </div>
              <span className="py-0.5 px-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold group-data-[state=active]:bg-purple-100 dark:group-data-[state=active]:bg-purple-500/20 group-data-[state=active]:text-purple-700 dark:group-data-[state=active]:text-purple-300">
                {count}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <AnimatePresence>
        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="mt-0 outline-none">
            <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="p-4 sm:p-6 flex flex-col gap-4">
              {groupedSessions[cat.id].length > 0 ? (
                groupedSessions[cat.id].map((session, idx) => <SessionCard key={session.id} session={session} index={idx} />)
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm mb-4">
                    <span className="text-2xl text-slate-400">📂</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">No sessions found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    You {`don't`} have any {cat.label.toLowerCase()} sessions at the moment.
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </AnimatePresence>
    </Tabs>
  );
};
