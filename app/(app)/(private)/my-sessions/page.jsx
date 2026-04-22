import { Calendar, Sparkles, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardShell, panelClass, interactivePanelClass, metaTextClass, sectionTitleClass, SectionHeading } from "@/components/dashboard/dashboard-shared";

export const metadata = {
  title: "My Sessions",
  description: "View your upcoming and completed mentorship sessions on VinceUP.",
  robots: { index: false, follow: false },
};


// ─── Mock Data ────────────────────────────────────────────────────────────────

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

// ─── FormattedDateTime ────────────────────────────────────────────────────────

function FormattedDateTime({ date, time }) {
  return (
    <div className={cn("flex items-center gap-2 mt-2 text-sm", metaTextClass)}>
      <Calendar className="w-4 h-4 opacity-60 shrink-0" aria-hidden="true" />
      <time dateTime={`${date}T${time}`}>
        {date}&nbsp;&bull;&nbsp;{time}
      </time>
    </div>
  );
}

// ─── SessionItem ──────────────────────────────────────────────────────────────

function SessionItem({ session }) {
  const isUpcoming = session.status === "upcoming";

  return (
    <Card
      className={cn(
        panelClass,
        interactivePanelClass,
        "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 px-0 py-0",
        // extra specificity reset for panelClass padding override
        "[&]:p-5 [&]:md:p-6",
      )}
    >
      {/* Session info */}
      <article className="flex flex-col min-w-0">
        <h3 className="text-base font-semibold tracking-tight md:text-lg text-(--dashboard-text)">{session.title}</h3>
        <p className={cn("mt-1 text-sm", metaTextClass)}>
          with <span className="font-semibold text-(--dashboard-text)">{session.mentor}</span>
        </p>
        <FormattedDateTime date={session.date} time={session.time} />
      </article>

      {/* Action */}
      <div className="flex items-center shrink-0 mt-2 sm:mt-0">
        {isUpcoming ? (
          <Button
            className="w-full gap-2 px-6 text-white rounded-full shadow-sm sm:w-auto
                       bg-[linear-gradient(135deg,#7c3aed,#c026d3)]
                       hover:opacity-90
                       shadow-[0_6px_16px_-6px_rgba(124,58,237,0.5)]
                       hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.6)]
                       active:scale-95 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            {session.actionLabel}
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="justify-between w-full gap-1 px-4 sm:justify-center sm:w-auto
                       text-violet-600 dark:text-violet-400
                       hover:text-violet-700 dark:hover:text-violet-300
                       hover:bg-violet-50 dark:hover:bg-violet-500/10
                       group/btn"
          >
            {session.actionLabel}
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
          </Button>
        )}
      </div>
    </Card>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function SessionSection({ title, sessions }) {
  if (!sessions.length) return null;
  return (
    <section className="space-y-4" aria-label={title}>
      <h2 className={sectionTitleClass}>{title}</h2>
      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <SessionItem key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MySessionsDashboard() {
  const upcomingSessions = SESSIONS.filter((s) => s.status === "upcoming");
  const completedSessions = SESSIONS.filter((s) => s.status === "completed");

  return (
    <DashboardShell ariaLabel="My sessions" maxWidth="max-w-4xl">
      {/* Page Header */}
      <SectionHeading title="My Sessions" description="View your past and upcoming mentorship sessions." />

      <SessionSection title="Upcoming Sessions" sessions={upcomingSessions} />
      <SessionSection title="Completed Sessions" sessions={completedSessions} />
    </DashboardShell>
  );
}
