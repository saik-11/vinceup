"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Clock, CreditCard, Download, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardShell, DashboardHeader, panelClass, metaTextClass, sectionTitleClass, interactivePanelClass, statAccentStyles } from "@/components/dashboard/dashboard-shared";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EARNINGS_6M = [
  { month: "Jan", amount: 2800 },
  { month: "Feb", amount: 3100 },
  { month: "Mar", amount: 2950 },
  { month: "Apr", amount: 3300 },
  { month: "May", amount: 4200 },
  { month: "Jun", amount: 4800 },
];

const EARNINGS_1Y = [
  { month: "Jul", amount: 1800 },
  { month: "Aug", amount: 2100 },
  { month: "Sep", amount: 2400 },
  { month: "Oct", amount: 2200 },
  { month: "Nov", amount: 2600 },
  { month: "Dec", amount: 2750 },
  ...EARNINGS_6M,
];

const EARNINGS_ALL = [{ month: "Mar '25", amount: 800 }, { month: "Apr '25", amount: 1100 }, { month: "May '25", amount: 1400 }, { month: "Jun '25", amount: 1600 }, ...EARNINGS_1Y];

const CHART_DATA = { "6M": EARNINGS_6M, "1Y": EARNINGS_1Y, All: EARNINGS_ALL };

const TRANSACTIONS = [
  {
    id: 1,
    avatar: "S",
    avatarColor: "bg-violet-600",
    mentee: "Sarah Johnson",
    type: "Mock Interview",
    date: "Jun 14, 2026",
    duration: "45 min",
    rate: "$3.5/min",
    amount: "$157.50",
    status: "completed",
  },
  {
    id: 2,
    avatar: "J",
    avatarColor: "bg-blue-600",
    mentee: "James Brown",
    type: "Career Guidance",
    date: "Jun 13, 2026",
    duration: "60 min",
    rate: "$3.5/min",
    amount: "$210.00",
    status: "completed",
  },
  {
    id: 3,
    avatar: "L",
    avatarColor: "bg-emerald-600",
    mentee: "Lisa Anderson",
    type: "Resume Review",
    date: "Jun 12, 2026",
    duration: "30 min",
    rate: "$3.5/min",
    amount: "$105.00",
    status: "completed",
  },
  {
    id: 4,
    avatar: "M",
    avatarColor: "bg-amber-600",
    mentee: "Michael Chen",
    type: "Career Guidance",
    date: "Jun 15, 2026",
    duration: "60 min",
    rate: "$3.5/min",
    amount: "$210.00",
    status: "pending",
  },
];

const PAYOUT_HISTORY = [
  { amount: "$4,200", date: "Jun 1, 2026", last4: "4242" },
  { amount: "$3,600", date: "May 1, 2026", last4: "4242" },
  { amount: "$2,800", date: "Apr 1, 2026", last4: "4242" },
];

const STAT_CARDS = [
  {
    label: "This Month",
    value: "$4,800",
    badge: "+14% from last month",
    icon: DollarSign,
    accent: "purple",
    badgeClass: "border-violet-200/80 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/12 dark:text-violet-200",
  },
  {
    label: "Last Month",
    value: "$4,200",
    badge: "Paid out",
    icon: CheckCircle2,
    accent: "green",
    badgeClass: "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/12 dark:text-emerald-200",
  },
  {
    label: "Lifetime Earnings",
    value: "$24,600",
    badge: "Since March 2026",
    icon: TrendingUp,
    accent: "orange",
    badgeClass: "border-orange-200/80 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/12 dark:text-orange-200",
  },
  {
    label: "Pending Payout",
    value: "$682.5",
    badge: "Processing",
    icon: Clock,
    accent: "teal",
    badgeClass: "border-cyan-200/80 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/12 dark:text-cyan-200",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const config = {
    completed: {
      label: "completed",
      className: "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/12 dark:text-emerald-300",
      icon: CheckCircle2,
    },
    pending: {
      label: "pending",
      className: "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/12 dark:text-amber-300",
      icon: Clock,
    },
  };
  const cfg = config[status] ?? config.pending;
  const Icon = cfg.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", cfg.className)}>
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

// ─── Earnings Trend Chart ─────────────────────────────────────────────────────

function EarningsTrendCard() {
  const [period, setPeriod] = useState("6M");
  const data = CHART_DATA[period];

  const customTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-[12px] border border-(--dashboard-border-strong) bg-(--dashboard-panel-strong) px-3 py-2 shadow-(--dashboard-shadow) text-xs" style={{ color: "var(--dashboard-text)" }}>
        <p className="font-semibold">{label}</p>
        <p className="text-violet-600 dark:text-violet-400">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className={cn(panelClass, "p-5 space-y-4")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className={sectionTitleClass}>Earnings Trend</h2>
          <p className={metaTextClass}>Monthly earnings over time</p>
        </div>
        <div className="flex rounded-lg border border-(--dashboard-border) bg-(--dashboard-panel-muted) p-0.5">
          {["6M", "1Y", "All"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-[8px] px-3 py-1 text-xs font-semibold transition-all duration-150",
                period === p ? "bg-[linear-gradient(135deg,#7c3aed,#9333ea)] text-white shadow-sm" : "text-(--dashboard-subtle) hover:text-(--dashboard-text)",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 min-h-0">
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--dashboard-subtle)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip content={customTooltip} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="url(#earningsLine)"
              strokeWidth={2.5}
              dot={{ fill: "#7c3aed", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#7c3aed", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Transactions Table ───────────────────────────────────────────────────────

function TransactionsCard() {
  return (
    <div className={cn(panelClass, "p-5 space-y-4")}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className={sectionTitleClass}>Recent Transactions</h2>
          <p className={metaTextClass}>Session earnings breakdown</p>
        </div>
        <button className="text-xs font-semibold text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--dashboard-border)">
              {["Mentee", "Session Type", "Date", "Duration", "Rate", "Amount", "Status"].map((col) => (
                <th key={col} className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-(--dashboard-subtle) first:pl-0 last:text-right">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, i) => (
              <motion.tr key={tx.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-(--dashboard-border) last:border-0">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white", tx.avatarColor)}>{tx.avatar}</div>
                    <span className="font-medium text-(--dashboard-text) whitespace-nowrap">{tx.mentee}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-(--dashboard-muted) whitespace-nowrap">{tx.type}</td>
                <td className="py-3 pr-4 text-(--dashboard-muted) whitespace-nowrap">{tx.date}</td>
                <td className="py-3 pr-4 text-(--dashboard-muted)">{tx.duration}</td>
                <td className="py-3 pr-4 text-(--dashboard-muted)">{tx.rate}</td>
                <td className="py-3 pr-4 font-semibold text-(--dashboard-text)">{tx.amount}</td>
                <td className="py-3 text-right">
                  <StatusBadge status={tx.status} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Payout History ───────────────────────────────────────────────────────────

function PayoutHistoryCard() {
  return (
    <div className={cn(panelClass, "p-5 space-y-4")}>
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-violet-600 dark:text-violet-400" />
        <h2 className={sectionTitleClass}>Payout History</h2>
      </div>
      <ul className="divide-y divide-(--dashboard-border)">
        {PAYOUT_HISTORY.map((p, i) => (
          <li key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <div>
              <p className="font-semibold text-(--dashboard-text)">{p.amount}</p>
              <p className="text-xs text-(--dashboard-subtle)">{p.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" />
                Paid
              </span>
              <span className="text-xs text-(--dashboard-subtle)">****{p.last4}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Payout Method ────────────────────────────────────────────────────────────

function PayoutMethodCard() {
  return (
    <div className={cn(panelClass, "p-5 space-y-4")}>
      <div className="flex items-center gap-2">
        <CreditCard className="size-4 text-violet-600 dark:text-violet-400" />
        <h2 className={sectionTitleClass}>Payout Method</h2>
      </div>

      {/* Bank card visual */}
      <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#7c3aed_0%,#9333ea_50%,#6d28d9_100%)] p-5 text-white shadow-[0_12px_32px_-8px_rgba(124,58,237,0.55)]">
        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/8" />
        <div className="absolute -right-4 bottom-0 size-24 rounded-full bg-white/6" />

        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wider text-white/70">Default Account</p>
          <CreditCard className="size-5 text-white/80" />
        </div>

        <p className="mt-5 font-mono text-lg tracking-[0.2em] text-white">•••• •••• •••• 4242</p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Account Holder</p>
            <p className="text-sm font-bold">Dr. Alex Rivera</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Bank</p>
            <p className="text-sm font-bold">Chase</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <dl className="space-y-2.5">
        {[
          { label: "Payout Schedule", value: "Monthly (1st of month)" },
          { label: "Processing Time", value: "3-5 business days" },
          { label: "Platform Fee", value: "15%" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <dt className="text-sm text-(--dashboard-subtle)">{label}</dt>
            <dd className="text-sm font-semibold text-(--dashboard-text)">{value}</dd>
          </div>
        ))}
      </dl>

      <Button className="w-full rounded-[12px] border border-(--dashboard-border) bg-transparent text-sm font-semibold text-(--dashboard-text) shadow-none hover:bg-(--dashboard-panel-muted) dark:hover:bg-white/5">
        Update Payout Method
      </Button>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function EarningStatCard({ stat, index }) {
  const accent = statAccentStyles[stat.accent] ?? statAccentStyles.purple;
  const Icon = stat.icon;

  return (
    <motion.div variants={fadeUp} className={cn(panelClass, interactivePanelClass, accent.hoverBorder, accent.hoverShadow, "p-5")}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex size-11 items-center justify-center rounded-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]", accent.iconWrap)}>
          <Icon className="size-5" />
        </div>
        {stat.badge && (
          <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-0", stat.badgeClass)}>
            {index === 0 && <ArrowUpRight className="mr-0.5 size-2.5" />}
            {index === 2 && <TrendingUp className="mr-0.5 size-2.5" />}
            {stat.badge}
          </Badge>
        )}
      </div>
      <p className="text-[2rem] font-bold leading-none tracking-[-0.04em] text-(--dashboard-text)">{stat.value}</p>
      <p className="mt-1 text-sm font-medium text-(--dashboard-muted)">{stat.label}</p>
    </motion.div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function EarningsClient() {
  return (
    <DashboardShell ariaLabel="Earnings" maxWidth="max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <DashboardHeader heading="Earnings" subheading="Track your mentorship income and payouts" />
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="shrink-0 mt-1">
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-[12px] border-violet-200 text-sm font-semibold text-violet-700 shadow-none hover:bg-violet-50 dark:border-violet-400/30 dark:text-violet-300 dark:hover:bg-violet-500/10"
          >
            <Download className="size-4" />
            Download Report
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((stat, i) => (
          <EarningStatCard key={stat.label} stat={stat} index={i} />
        ))}
      </motion.div>

      {/* Earnings Trend */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2, duration: 0.35 }}>
        <EarningsTrendCard />
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.28, duration: 0.35 }}>
        <TransactionsCard />
      </motion.div>

      {/* Bottom row */}
      <motion.div variants={stagger} initial="hidden" animate="visible" transition={{ delay: 0.36 }} className="grid gap-4 lg:grid-cols-12">
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <PayoutHistoryCard />
        </motion.div>
        <motion.div variants={fadeUp} className="lg:col-span-5">
          <PayoutMethodCard />
        </motion.div>
      </motion.div>
    </DashboardShell>
  );
}
