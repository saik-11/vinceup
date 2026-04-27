"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Edit3,
  EditIcon,
  Flag,
  Lightbulb,
  LucideCheckCircle,
  MessageSquare,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardShell, DashboardHeader, panelClass, subCardClass, metaTextClass, sectionTitleClass, interactivePanelClass } from "@/components/dashboard/dashboard-shared";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CAPSULES = {
  sent: [
    {
      id: 1,
      mentee: "Sarah Johnson",
      avatar: "S",
      avatarColor: "bg-violet-600",
      type: "Mock Interview",
      subtype: "System Design",
      date: "Jun 14, 2026",
      sentStatus: "Auto-sent",
      isAI: true,
      status: "sent",
    },
    {
      id: 2,
      mentee: "James Brown",
      avatar: "J",
      avatarColor: "bg-blue-600",
      type: "Career Guidance",
      subtype: "",
      date: "Jun 13, 2026",
      sentStatus: "Auto-sent",
      isAI: true,
      status: "sent",
    },
  ],
  verified: [
    {
      id: 3,
      mentee: "Lisa Anderson",
      avatar: "L",
      avatarColor: "bg-emerald-600",
      type: "Resume Review",
      subtype: "",
      date: "Jun 12, 2026",
      sentStatus: "Verified",
      isAI: false,
      status: "verified",
    },
    {
      id: 4,
      mentee: "Priya Sharma",
      avatar: "P",
      avatarColor: "bg-pink-600",
      type: "Career Guidance",
      subtype: "",
      date: "Jun 10, 2026",
      sentStatus: "Verified",
      isAI: false,
      status: "verified",
    },
  ],
  flagged: [
    {
      id: 5,
      mentee: "Michael Chen",
      avatar: "M",
      avatarColor: "bg-amber-600",
      type: "Mock Interview",
      subtype: "Behavioral",
      date: "Jun 9, 2026",
      sentStatus: "Flagged",
      isAI: true,
      status: "flagged",
    },
  ],
};

const CAPSULE_DETAILS = {
  1: {
    progress: "+15% since last session",
    progressPositive: true,
    sessionSummary:
      "Sarah demonstrated strong understanding of microservices architecture and database sharding concepts. She successfully designed a scalable Twitter-like feed system with proper consideration for read-heavy workloads. Areas for improvement include more proactive discussion of trade-offs and asking clarifying questions upfront.",
    keyInsights: [
      "Excellent grasp of distributed systems fundamentals",
      "Good communication of technical concepts",
      "Needs practice with trade-off analysis",
      "Should work on asking clarifying questions earlier in the interview",
    ],
    decisionsMade: [
      "Continue practicing system design with increasingly complex scenarios",
      "Focus next session on behavioral interview preparation",
      "Schedule mock interview for leadership scenarios",
    ],
    actionItems: [
      {
        label: "Design a scalable messaging system (WhatsApp-like)",
        due: "Jun 21, 2026",
        priority: "high",
      },
      {
        label: "Prepare 5 STAR method examples for behavioral questions",
        due: "Jun 21, 2026",
        priority: "high",
      },
      {
        label: "Research distributed consensus algorithms",
        due: "Jun 28, 2026",
        priority: "medium",
      },
    ],
    nextSuggestions: ["Behavioral interview deep-dive with leadership scenarios", "Advanced system design: real-time systems", "Mock interview: final round preparation"],
  },
  2: {
    progress: "+8% since last session",
    progressPositive: true,
    sessionSummary:
      "James showed solid career clarity and has identified target companies. He needs to work on structuring his narrative around career pivots and better articulating his transferable skills.",
    keyInsights: ["Clear vision of target role", "Strong motivation and commitment", "Narrative around career transition needs work", "Networking strategy not fully developed"],
    decisionsMade: ["Build target company list and research roles", "Craft 3 career-pivot story versions", "Start reaching out to 2nd degree connections"],
    actionItems: [
      { label: "Research 10 target companies with open roles", due: "Jun 20, 2026", priority: "high" },
      { label: "Draft career-pivot LinkedIn headline", due: "Jun 22, 2026", priority: "medium" },
    ],
    nextSuggestions: ["Mock informational interview practice", "Resume deep-dive and ATS optimization", "LinkedIn profile overhaul"],
  },
};

const getDefaultDetail = (capsule) => ({
  progress: "+5% since last session",
  progressPositive: true,
  sessionSummary: `Session details for ${capsule.mentee}'s ${capsule.type} session on ${capsule.date}.`,
  keyInsights: ["Good session overall", "Continued progress from last time"],
  decisionsMade: ["Follow up next session"],
  actionItems: [{ label: "Review session notes", due: "Next week", priority: "medium" }],
  nextSuggestions: ["Continue current trajectory"],
});

const TABS = [
  { key: "sent", label: "Sent", countKey: "sent" },
  { key: "verified", label: "Verified", countKey: "verified" },
  { key: "flagged", label: "Flagged", countKey: "flagged" },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

// ─── Priority Badge ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }) {
  const config = {
    high: "border-red-200/80 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300",
    medium: "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300",
    low: "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300",
  };
  return <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", config[priority] ?? config.low)}>{priority}</span>;
}

// ─── Left: Capsule List ───────────────────────────────────────────────────────
function CapsuleListPanel({ activeTab, setActiveTab, selectedId, onSelect }) {
  const allCapsules = CAPSULES[activeTab] ?? [];

  return (
    <Card className="border-zinc-200 shadow-sm dark:border-zinc-800 bg-(--dashboard-panel)">
      <CardContent className="p-4">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);

            const first = CAPSULES[value]?.[0];
            if (first) onSelect(first.id);
          }}
          className="w-full"
        >
          <TabsList className="inline-flex h-auto gap-1 rounded-2xl bg-transparent p-1">
            {TABS.map((tab) => {
              const count = CAPSULES[tab.countKey]?.length ?? 0;

              return (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="
                    h-10 rounded-lg px-4 text-[14px] font-medium
                    bg-zinc-100 text-zinc-600
                    hover:bg-zinc-200
                    dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800

                    data-[state=active]:bg-violet-600
                    data-[state=active]:text-white
                    dark:data-[state=active]:bg-violet-500
                  "
                >
                  <span>{tab.label}</span>
                  <span className="ml-1 opacity-80">({count})</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Cards */}
        <div className="mt-6 space-y-3">
          {allCapsules.map((capsule) => {
            const isSelected = selectedId === capsule.id;

            return (
              <button
                key={capsule.id}
                type="button"
                onClick={() => onSelect(capsule.id)}
                className={cn(
                  "w-full rounded-lg border px-4 py-4 text-left transition-all duration-200",
                  isSelected
                    ? `
                      border-violet-500 bg-violet-50
                      dark:border-violet-500 dark:bg-violet-500/10
                    `
                    : `
                      border-zinc-200 bg-white hover:border-zinc-300
                      dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700
                    `,
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white", capsule.avatarColor)}>{capsule.avatar}</div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold leading-5 text-zinc-900 dark:text-zinc-100">{capsule.mentee}</p>

                        <p className="text-[14px] leading-5 text-zinc-500 dark:text-zinc-400">{capsule.type}</p>
                      </div>

                      {capsule.isAI && (
                        <span
                          className="
                            inline-flex shrink-0 items-center gap-1 rounded-full
                            bg-violet-100 px-3 py-1 text-[12px] font-medium leading-none text-violet-700
                            dark:bg-violet-500/15 dark:text-violet-300
                          "
                        >
                          <Sparkles className="size-3" />
                          AI Generated
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-[14px]">
                      <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                        <Calendar className="size-3.5" />
                        <span>{capsule.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                        <Send className="size-3.5" />
                        <span>{capsule.sentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
// ─── Right: Capsule Detail ────────────────────────────────────────────────────

function CapsuleDetailPanel({ capsule, detail, onMarkVerified }) {
  return (
    <motion.div key={capsule.id} variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
      {/* Mentee summary header */}
      <motion.div variants={fadeUp} className={cn(panelClass, "p-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md", capsule.avatarColor)}>{capsule.avatar}</div>
            <div>
              <h3 className="font-bold text-[var(--dashboard-text)]">{capsule.mentee}</h3>
              <p className="text-xs text-[var(--dashboard-subtle)]">
                {capsule.type}
                {capsule.subtype ? ` - ${capsule.subtype}` : ""}
              </p>
            </div>
          </div>
          {capsule.isAI && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles className="size-3" />
              AI Generated
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-[var(--dashboard-subtle)]">
            <Calendar className="size-3.5" />
            <span className="text-xs">Date</span>
            <span className="font-semibold text-[var(--dashboard-text)]">{capsule.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="size-3.5 text-emerald-500" />
            <span className="text-xs text-[var(--dashboard-subtle)]">Progress</span>
            <span className={cn("text-xs font-bold", detail.progressPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>{detail.progress}</span>
          </div>
        </div>
      </motion.div>

      {/* Session Summary */}
      <motion.div variants={fadeUp} className={cn(panelClass, "p-5 space-y-3")}>
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-(--dashboard-purple)" />
          <h3 className={sectionTitleClass}>Session Summary</h3>
        </div>
        <p className="text-sm leading-7 text-(--dashboard-muted)">{detail.sessionSummary}</p>
      </motion.div>

      {/* Key Insights */}
      <motion.div variants={fadeUp} className={cn(panelClass, "p-5 space-y-3")}>
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
          <h3 className={sectionTitleClass}>Key Insights</h3>
        </div>
        <ul className="space-y-2">
          {detail.keyInsights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3 rounded-[12px] border border-[var(--dashboard-border)] bg-violet-50/50 px-3 py-2.5 dark:bg-violet-500/5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-violet-600 dark:text-violet-400" />
              <span className="text-sm text-[var(--dashboard-text)]">{insight}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Decisions Made */}
      <motion.div variants={fadeUp} className={cn(panelClass, "p-5 space-y-3")}>
        <div className="flex items-center gap-2">
          <Target className="size-4 text-amber-600 dark:text-amber-400" />
          <h3 className={sectionTitleClass}>Decisions Made</h3>
        </div>
        <ul className="space-y-2.5">
          {detail.decisionsMade.map((d, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-400 dark:bg-amber-500" />
              <span className="text-sm text-[var(--dashboard-muted)]">{d}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Action Items */}
      <motion.div variants={fadeUp} className={cn(panelClass, "p-5 space-y-3")}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-[var(--dashboard-green)]" />
          <h3 className={sectionTitleClass}>Action Items</h3>
        </div>
        <ul className="space-y-2.5">
          {detail.actionItems.map((item, i) => (
            <li key={i} className="flex items-start justify-between gap-3 rounded-[12px] border border-[var(--dashboard-border)] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[var(--dashboard-text)]">{item.label}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--dashboard-subtle)]">
                  <Calendar className="size-3" />
                  Due: {item.due}
                </p>
              </div>
              <PriorityBadge priority={item.priority} />
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Next Session Suggestions */}
      <motion.div variants={fadeUp}>
        <div className="overflow-hidden rounded-lg border border-[rgba(124,58,237,0.18)] bg-[linear-gradient(135deg,rgba(124,58,237,0.07)_0%,rgba(192,38,211,0.05)_50%,rgba(124,58,237,0.03)_100%)] p-5 shadow-[var(--dashboard-shadow)] backdrop-blur-xl dark:border-[rgba(167,139,250,0.2)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.14)_0%,rgba(192,38,211,0.1)_50%,rgba(124,58,237,0.06)_100%)]">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="size-4 text-violet-600 dark:text-violet-400" />
            <h3 className={sectionTitleClass}>Next Session Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {detail.nextSuggestions.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-[12px] border border-[rgba(124,58,237,0.12)] bg-white/50 px-3.5 py-2.5 dark:bg-black/20">
                <div className="flex items-center gap-2">
                  <ChevronRight className="size-3.5 shrink-0 text-violet-500" />
                  <span className="text-sm text-(--dashboard-text)">{s}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function ClarityCapsuleClient() {
  const [activeTab, setActiveTab] = useState("sent");
  const [selectedId, setSelectedId] = useState(1);

  const allCapsules = Object.values(CAPSULES).flat();
  const selectedCapsule = allCapsules.find((c) => c.id === selectedId) ?? allCapsules[0];
  const detail = CAPSULE_DETAILS[selectedId] ?? getDefaultDetail(selectedCapsule);

  return (
    <DashboardShell ariaLabel="Clarity Capsules" maxWidth="max-w-6xl">
      {/* Header */}
      <DashboardHeader heading="Clarity Capsules" subheading="VEGA-generated post-session insights for your mentees" />

      {/* How Capsules Work banner */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-xl border border-[rgba(124,58,237,0.18)] bg-[linear-gradient(135deg,rgba(124,58,237,0.07)_0%,rgba(192,38,211,0.05)_50%,rgba(124,58,237,0.03)_100%)] p-5 shadow-[var(--dashboard-shadow)] backdrop-blur-xl dark:border-[rgba(167,139,250,0.2)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.14)_0%,rgba(192,38,211,0.1)_50%,rgba(124,58,237,0.06)_100%)]"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#7c3aed,#c026d3)] shadow-[0_6px_14px_-4px_rgba(124,58,237,0.55)]">
            <Sparkles className="size-5 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-(--dashboard-text)">How Capsules Work</h3>
            <p className="mt-1 text-sm leading-6 text-(--dashboard-muted)">
              VEGA automatically generates clarity capsules after each session and sends them to your mentees. You can review, edit, and verify them before or after {`they're`} sent.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              {[
                { icon: LucideCheckCircle, label: "Auto-generated within 5 minutes", color: "text-[#00A63E] dark:text-emerald-400" },
                { icon: Send, label: "Automatically sent to mentees", color: "text-blue-600 dark:text-blue-400" },
                { icon: EditIcon, label: "Edit anytime for better accuracy", color: "text-violet-600 dark:text-violet-400" },
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className={cn("flex items-center gap-1.5 text-xs font-medium")}>
                  <Icon className={`size-3.5 ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid gap-4 lg:grid-cols-[370px_1fr]">
        {/* Left sidebar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1, duration: 0.3 }} className="lg:sticky lg:top-4 lg:self-start">
          <CapsuleListPanel activeTab={activeTab} setActiveTab={setActiveTab} selectedId={selectedId} onSelect={setSelectedId} />
        </motion.div>

        {/* Right detail pane */}
        <div className="relative min-w-0">
          <AnimatePresence mode="wait">
            <CapsuleDetailPanel key={selectedId} capsule={selectedCapsule} detail={detail} onMarkVerified={() => {}} />
          </AnimatePresence>

          <div className="bottom-0 flex gap-3 rounded-b-lg py-4">
            <Button
              className="h-11 flex-3 rounded-lg bg-[linear-gradient(135deg,#7c3aed,#9333ea)] text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(124,58,237,0.55)] transition-all duration-200 hover:opacity-90 hover:shadow-[0_10px_24px_-6px_rgba(124,58,237,0.65)] border-0"
              onClick={() => {}}
            >
              <CheckCircle2 className="mr-2 size-4" />
              Mark as Verified
            </Button>
            <Button
              variant="outline"
              className="h-11 flex-[1.4] rounded-lg border-(--dashboard-border) text-sm font-semibold text-(--dashboard-text) shadow-none hover:bg-(--dashboard-panel-muted) dark:hover:bg-white/5"
              onClick={() => {}}
            >
              <Edit3 className="mr-2 size-4" />
              Edit Capsule
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
