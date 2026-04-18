import React from "react";
import { Calendar, Sparkles, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- Mock Data ---
const SESSIONS = [
  {
    id: "sess_1",
    title: "Technical Interview Guidance",
    mentor: "Sarah Chen",
    date: "2026-03-18",
    time: "10:00 AM",
    status: "upcoming",
    actionLabel: "Prepare",
  },
  {
    id: "sess_2",
    title: "Career Mentorship",
    mentor: "Priya Sharma",
    date: "2026-03-21",
    time: "2:00 PM",
    status: "upcoming",
    actionLabel: "Prepare",
  },
  {
    id: "sess_3",
    title: "Resume Masterclass",
    mentor: "Michael Rodriguez",
    date: "2026-03-10",
    time: "11:00 AM",
    status: "completed",
    actionLabel: "View Insights",
  },
  {
    id: "sess_4",
    title: "Video Mock Interview",
    mentor: "David Kim",
    date: "2026-03-05",
    time: "3:00 PM",
    status: "completed",
    actionLabel: "Clarity Capsule",
  },
];

// --- Sub-components ---

const FormattedDateTime = ({ date, time }) => (
  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
    <Calendar className="w-4 h-4 opacity-70" aria-hidden="true" />
    <time dateTime={`${date}T${time}`}>
      {date} &nbsp;&bull;&nbsp; {time}
    </time>
  </div>
);

const SessionItem = ({ session }) => {
  const isUpcoming = session.status === "upcoming";

  return (
    <Card className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 transition-all duration-300 ease-out hover:shadow-md hover:border-slate-300">
      <article className="flex flex-col">
        <h3 className="text-base font-semibold tracking-tight md:text-lg text-foreground">
          {session.title}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          with <span className="font-medium text-slate-800">{session.mentor}</span>
        </p>
        <FormattedDateTime date={session.date} time={session.time} />
      </article>

      <div className="flex items-center shrink-0 mt-2 sm:mt-0">
        {isUpcoming ? (
          <Button
            className="w-full gap-2 px-6 text-white transition-transform rounded-full shadow-sm sm:w-auto bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 active:scale-95"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            {session.actionLabel}
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="justify-between w-full gap-1 px-4 sm:justify-center sm:w-auto text-violet-600 hover:text-violet-700 hover:bg-violet-50 group/btn"
          >
            {session.actionLabel}
            <ChevronRight 
              className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" 
              aria-hidden="true" 
            />
          </Button>
        )}
      </div>
    </Card>
  );
};

// --- Main Layout ---

export default function MySessionsDashboard() {
  const upcomingSessions = SESSIONS.filter((s) => s.status === "upcoming");
  const completedSessions = SESSIONS.filter((s) => s.status === "completed");

  return (
    <main className="min-h-screen px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Page Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">
            My Sessions
          </h1>
          <p className="text-base text-muted-foreground">
            View your past and upcoming mentorship sessions.
          </p>
        </header>

        {/* Upcoming Sessions Section */}
        {upcomingSessions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Upcoming Sessions
            </h2>
            <div className="flex flex-col gap-4">
              {upcomingSessions.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Sessions Section */}
        {completedSessions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Completed Sessions
            </h2>
            <div className="flex flex-col gap-4">
              {completedSessions.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}