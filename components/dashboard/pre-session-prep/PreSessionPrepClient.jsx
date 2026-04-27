"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Sparkles,
  Star,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DashboardShell,
  DashboardHeader,
  metaTextClass,
  sectionTitleClass,
} from "@/components/dashboard/dashboard-shared";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SESSIONS = [
  { id: 1, name: "Sarah Johnson",  type: "Mock Interview",   time: "Today at 2:00 PM",      avatar: "S", avatarColor: "bg-violet-600" },
  { id: 2, name: "Michael Chen",   type: "Career Guidance",  time: "Today at 4:30 PM",      avatar: "M", avatarColor: "bg-blue-600"   },
  { id: 3, name: "Priya Sharma",   type: "Resume Review",    time: "Tomorrow at 10:00 AM",  avatar: "P", avatarColor: "bg-emerald-600" },
  { id: 4, name: "David Kim",      type: "Mock Interview",   time: "Tomorrow at 2:00 PM",   avatar: "D", avatarColor: "bg-pink-600"    },
];

const MENTEE_DATA = {
  1: {
    name: "Sarah Johnson",
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    sessionCount: "#5",
    vegaContext: "Sarah is a mid-level software engineer with 4 years of experience, currently at a Series B startup. She's preparing for senior engineer interviews at FAANG companies.",
    lastSession: { date: "June 1, 2026", summary: "Discussed career progression from mid-level to senior engineer. Identified need for system design practice and leadership skills development.", rating: 0 },
    actionItems: [
      { label: "Practice system design - design Twitter feed", status: "completed" },
      { label: "Review distributed systems concepts", status: "completed" },
      { label: "Research senior engineer roles at target companies", status: "in_progress" },
    ],
    vegaTopics: ["Microservices architecture patterns", "Database sharding strategies", "Load balancing and caching", "Leadership principles and examples"],
    important: "Sarah mentioned she has a final round interview scheduled for next week at Google",
    strengths: ["Strong coding fundamentals", "Good communication skills", "Consistent preparation between sessions"],
    areasToFocus: ["System design scalability concepts", "Behavioral interview responses using STAR method", "Asking clarifying questions during interviews"],
    journey: [
      { date: "Mar 2026", label: "First session - Career assessment" },
      { date: "Mar 2026", label: "Resume review and optimization" },
      { date: "Apr 2026", label: "Mock interview - Behavioral" },
      { date: "May 2026", label: "System design fundamentals" },
      { date: "Jun 2026", label: "Advanced system design practice" },
      { date: "Today",    label: "Mock interview - System design", active: true },
    ],
  },
  2: {
    name: "Michael Chen",
    occupation: "Product Manager",
    location: "New York, NY",
    sessionCount: "#3",
    vegaContext: "Michael is transitioning from engineering to product management. He's targeting senior PM roles at mid-to-large tech companies.",
    lastSession: { date: "May 28, 2026", summary: "Explored PM fundamentals, product sense frameworks, and metrics-driven decision making. Practiced case study walk-throughs.", rating: 0 },
    actionItems: [
      { label: "Complete product teardown of 3 apps", status: "completed" },
      { label: "Prepare STAR stories for leadership questions", status: "in_progress" },
    ],
    vegaTopics: ["Product roadmap prioritization", "Stakeholder management", "Data-driven decision making", "Cross-functional leadership"],
    important: "Michael has a PM interview at Stripe next Friday.",
    strengths: ["Technical background", "Analytical thinking", "Strong problem framing"],
    areasToFocus: ["Product intuition and user empathy", "Metrics definition for product success", "Storytelling in interviews"],
    journey: [
      { date: "Apr 2026", label: "Career transition planning" },
      { date: "May 2026", label: "PM fundamentals" },
      { date: "Today",    label: "Career Guidance - Strategy", active: true },
    ],
  },
  3: {
    name: "Priya Sharma",
    occupation: "UX Designer",
    location: "Austin, TX",
    sessionCount: "#2",
    vegaContext: "Priya is a mid-level UX designer looking to move into senior design roles at top tech companies. Focused on portfolio strengthening.",
    lastSession: { date: "May 20, 2026", summary: "Reviewed existing portfolio pieces and discussed how to present design thinking clearly. Identified gaps in case study structure.", rating: 0 },
    actionItems: [
      { label: "Revamp portfolio case study for feature X", status: "in_progress" },
      { label: "Research senior UX roles at target companies", status: "in_progress" },
    ],
    vegaTopics: ["Design systems at scale", "Stakeholder presentations", "Measuring design impact", "Portfolio storytelling"],
    important: "Priya wants to target Airbnb and Figma for senior roles.",
    strengths: ["Visual design skills", "User research experience", "Attention to detail"],
    areasToFocus: ["Quantifying design impact with metrics", "Cross-functional collaboration stories", "Communicating design decisions confidently"],
    journey: [
      { date: "May 2026", label: "Portfolio audit" },
      { date: "Today",    label: "Resume Review - UX focus", active: true },
    ],
  },
  4: {
    name: "David Kim",
    occupation: "Data Scientist",
    location: "Seattle, WA",
    sessionCount: "#1",
    vegaContext: "David is a data scientist looking to transition into ML engineering. First session focused on career goal alignment.",
    lastSession: { date: "N/A", summary: "This is the first session with David. Review his background before the call.", rating: 0 },
    actionItems: [],
    vegaTopics: ["ML system design", "Python best practices", "Career transition to MLE", "Interview preparation"],
    important: "This is David's first session — review his background before the call.",
    strengths: ["Strong statistics background", "Python proficiency", "Research experience"],
    areasToFocus: ["Production ML systems", "Software engineering fundamentals", "System design for ML"],
    journey: [{ date: "Today", label: "Mock Interview - First session", active: true }],
  },
};

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

// ─── Session Selector ─────────────────────────────────────────────────────────

function SessionSelector({ sessions, activeId, onSelect }) {
  const itemsPerPage = 3;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const visible = sessions.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">Select Session</p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0} className="h-8 w-8 rounded-md">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-14 rounded-md border bg-muted/30 px-3 py-1.5 text-center text-xs font-medium text-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} disabled={page === totalPages - 1} className="h-8 w-8 rounded-md">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((s) => (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(s.id)}
              className={cn(
                "flex min-h-22 w-full flex-col justify-between rounded-lg border-2 p-4 text-left transition-all duration-200",
                activeId === s.id
                  ? "border-violet-500 bg-violet-50 shadow-[0_0_0_1px_rgba(124,58,237,0.25),0_8px_20px_-10px_rgba(124,58,237,0.25)] dark:bg-violet-950/30"
                  : "border-border bg-card hover:-translate-y-0.5 hover:border-violet-300/50 hover:shadow-sm",
              )}
            >
              <div className="space-y-0.5">
                <span className={cn("block text-sm font-semibold", activeId === s.id ? "text-violet-700 dark:text-violet-300" : "text-foreground")}>
                  {s.name}
                </span>
                <span className="text-xs text-muted-foreground">{s.type}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="size-3" />
                {s.time}
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Mentee Profile Card ──────────────────────────────────────────────────────

function MenteeProfileCard({ mentee }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#c026d3)] text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(124,58,237,0.4)]">
            <User className="size-5" />
          </div>
          <div>
            <h3 className={sectionTitleClass}>Mentee Profile</h3>
            <p className={metaTextClass}>Background and context</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {[
            { label: "Name",          value: mentee.name          },
            { label: "Occupation",    value: mentee.occupation    },
            { label: "Location",      value: mentee.location      },
            { label: "Session Count", value: mentee.sessionCount  },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-violet-200/60 bg-violet-50/60 p-4 dark:border-violet-400/20 dark:bg-violet-500/10">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">VEGA Context</span>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{mentee.vegaContext}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Last Session Summary ─────────────────────────────────────────────────────

function LastSessionSummaryCard({ session }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-violet-600 dark:text-violet-400" />
          <h3 className={sectionTitleClass}>Last Session Summary</h3>
          <span className="ml-auto text-xs text-muted-foreground">{session.date}</span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{session.summary}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Session Rating:</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("size-3.5", i < session.rating ? "fill-amber-400 text-amber-400" : "text-border")} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Action Items ─────────────────────────────────────────────────────────────

function ActionItemsCard({ items }) {
  if (!items.length) return null;

  const statusConfig = {
    completed:   { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", label: "Completed"   },
    in_progress: { icon: Clock,        color: "text-amber-600 dark:text-amber-400",     label: "In Progress" },
  };

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className={sectionTitleClass}>Action Items from Last Session</h3>
        </div>
        <ul className="space-y-2.5">
          {items.map((item, i) => {
            const cfg = statusConfig[item.status] ?? statusConfig.in_progress;
            const Icon = cfg.icon;
            return (
              <li key={i} className="flex items-start gap-3">
                <Icon className={cn("mt-0.5 size-4 shrink-0", cfg.color)} />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className={cn("text-xs font-medium", cfg.color)}>{cfg.label}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── VEGA Topics ──────────────────────────────────────────────────────────────

function VegaTopicsCard({ topics }) {
  return (
    <div className="overflow-hidden rounded-lg border border-violet-200/60 bg-[linear-gradient(135deg,rgba(124,58,237,0.07)_0%,rgba(192,38,211,0.05)_50%,rgba(124,58,237,0.03)_100%)] p-5 shadow-sm dark:border-violet-400/20 dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.14)_0%,rgba(192,38,211,0.1)_50%,rgba(124,58,237,0.06)_100%)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_6px_14px_-4px_rgba(124,58,237,0.55)]">
          <Sparkles className="size-4 text-white" strokeWidth={2} />
        </div>
        <div>
          <h3 className={sectionTitleClass}>VEGA Suggested Topics</h3>
          <p className={metaTextClass}>Based on mentee&apos;s goals and progress</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {topics.map((topic, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-violet-200/40 bg-white/60 px-3 py-2.5 dark:border-violet-400/15 dark:bg-black/20">
            <Zap className="size-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-medium text-foreground">{topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Important Alert ──────────────────────────────────────────────────────────

function ImportantAlert({ message }) {
  return (
    <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/8">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">Important</p>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
      </div>
    </div>
  );
}

// ─── Strengths / Areas to Focus ───────────────────────────────────────────────

function ChecklistCard({ title, items, iconColor, iconBg }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <h3 className={sectionTitleClass}>{title}</h3>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className={cn("mt-1 flex size-4 shrink-0 items-center justify-center rounded-full", iconBg)}>
                <CheckCircle2 className={cn("size-3", iconColor)} />
              </div>
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Mentee Journey ───────────────────────────────────────────────────────────

function MenteeJourneyCard({ journey }) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <h3 className={sectionTitleClass}>Mentee Journey</h3>
        <ol className="relative space-y-0 pl-4">
          {journey.map((step, i) => (
            <li key={i} className="relative pb-5 last:pb-0">
              {i < journey.length - 1 && (
                <div className="absolute -left-3.5 top-4 h-full w-px bg-border" />
              )}
              <div
                className={cn(
                  "absolute -left-4.5 top-1.5 size-2.5 rounded-full border-2",
                  step.active
                    ? "border-violet-600 bg-violet-600 shadow-[0_0_0_3px_rgba(124,58,237,0.2)]"
                    : "border-border bg-card",
                )}
              />
              <div className="pl-2">
                <p className="text-[11px] text-muted-foreground">{step.date}</p>
                <p className={cn("text-sm", step.active ? "font-bold text-violet-700 dark:text-violet-300" : "font-medium text-muted-foreground")}>
                  {step.label}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

// ─── Session Notes ────────────────────────────────────────────────────────────

function SessionNotesCard() {
  const [notes, setNotes] = useState("");
  const [shareWithVega, setShareWithVega] = useState(false);

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <h3 className={sectionTitleClass}>Session Notes</h3>
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your prep notes here..."
          className="min-h-25 resize-none rounded-lg text-sm"
        />
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={shareWithVega}
            onCheckedChange={setShareWithVega}
            className="rounded data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
          />
          <span className="text-xs text-muted-foreground">Share with VEGA for better insights</span>
        </label>
      </CardContent>
    </Card>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function PreSessionPrepClient() {
  const [activeSessionId, setActiveSessionId] = useState(1);
  const mentee = MENTEE_DATA[activeSessionId];

  return (
    <DashboardShell ariaLabel="Pre-Session Prep" maxWidth="max-w-6xl">
      <DashboardHeader heading="Pre-Session Prep" subheading="VEGA-powered preparation for your upcoming sessions" />

      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.3 }}>
        <SessionSelector sessions={SESSIONS} activeId={activeSessionId} onSelect={setActiveSessionId} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSessionId}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-4 lg:grid-cols-[1fr_340px]"
        >
          {/* Left column */}
          <motion.div variants={fadeUp} transition={{ duration: 0.3 }} className="flex flex-col gap-4">
            <MenteeProfileCard mentee={mentee} />
            <LastSessionSummaryCard session={mentee.lastSession} />
            <ActionItemsCard items={mentee.actionItems} />
            <VegaTopicsCard topics={mentee.vegaTopics} />
          </motion.div>

          {/* Right column */}
          <motion.div variants={fadeUp} transition={{ duration: 0.35 }} className="flex flex-col gap-4">
            <ImportantAlert message={mentee.important} />
            <ChecklistCard
              title="Strengths"
              items={mentee.strengths}
              iconColor="text-emerald-600 dark:text-emerald-400"
              iconBg="bg-emerald-100 dark:bg-emerald-500/20"
            />
            <ChecklistCard
              title="Areas to Focus"
              items={mentee.areasToFocus}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBg="bg-amber-100 dark:bg-amber-500/20"
            />
            <MenteeJourneyCard journey={mentee.journey} />
            <SessionNotesCard />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </DashboardShell>
  );
}
