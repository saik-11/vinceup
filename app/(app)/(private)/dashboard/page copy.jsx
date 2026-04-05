"use client";

import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ─── Static / Mock Data ────────────────────────────────────────

const user = {
  name: "Sai Kiran",
  initials: "SK",
  role: "Senior Software Engineer",
  goal: "Move into Engineering Management",
  streak: 5,
  totalSessions: 12,
  hoursLearned: 18,
  goalsCompleted: 3,
};

const upcomingSessions = [
  {
    id: 1,
    mentor: "Rahul Kapoor",
    mentorInitials: "RK",
    mentorAvatarBg: "from-blue-700 to-blue-900",
    topic: "Building your management case study",
    date: "Today",
    time: "4:00 PM",
    duration: "60 min",
    type: "Video call",
  },
  {
    id: 2,
    mentor: "Meera Krishnan",
    mentorInitials: "MK",
    mentorAvatarBg: "from-indigo-600 to-indigo-900",
    topic: "1:1 structure and feedback frameworks",
    date: "Thu, Apr 3",
    time: "11:00 AM",
    duration: "45 min",
    type: "Video call",
  },
];

const goals = [
  { id: 1, title: "Complete 10 sessions", progress: 100, done: true },
  { id: 2, title: "Define 90-day manager plan", progress: 70, done: false },
  {
    id: 3,
    title: "Shadow 2 engineering post-mortems",
    progress: 50,
    done: false,
  },
  { id: 4, title: "Get skip-level manager intro", progress: 0, done: false },
];

const recentActivity = [
  {
    id: 1,
    type: "session",
    title: "Session completed with Rahul Kapoor",
    desc: "Topic: Stakeholder management for EMs",
    time: "2 days ago",
    icon: Video,
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    type: "note",
    title: "Note added",
    desc: "Key takeaways from delegation framework discussion",
    time: "2 days ago",
    icon: BookOpen,
    iconColor: "bg-purple-100 text-purple-600",
  },
  {
    id: 3,
    type: "message",
    title: "Message from Meera Krishnan",
    desc: '"Don\'t forget to draft your management philosophy before Thursday!"',
    time: "3 days ago",
    icon: MessageSquare,
    iconColor: "bg-emerald-100 text-emerald-600",
  },
  {
    id: 4,
    type: "goal",
    title: "Goal completed",
    desc: "Completed 10 sessions milestone",
    time: "5 days ago",
    icon: CheckCircle2,
    iconColor: "bg-amber-100 text-amber-600",
  },
];

const resources = [
  {
    title: "The Manager's Path",
    type: "Book",
    by: "Camille Fournier",
    tag: "Engineering Leadership",
  },
  {
    title: "Staff Engineer: Leadership Beyond the Management Track",
    type: "Book",
    by: "Will Larson",
    tag: "Career Growth",
  },
  {
    title: "An Elegant Puzzle",
    type: "Article",
    by: "Will Larson",
    tag: "Engineering Orgs",
  },
];

// ─── Sidebar ───────────────────────────────────────────────────

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/sessions", label: "Sessions", icon: Calendar },
  { href: "/dashboard/goals", label: "Goals", icon: TrendingUp },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: MessageSquare,
    badge: 2,
  },
  { href: "/dashboard/resources", label: "Resources", icon: BookOpen },
  { href: "/mentor", label: "Find Mentors", icon: Users },
];

function Sidebar({ current, setCurrent }) {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r bg-white h-[calc(100vh-5rem)] sticky top-20">
      {/* Profile mini */}
      <div className="p-5 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-blue-800 flex items-center justify-center text-white font-semibold text-sm">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.role}
            </p>
          </div>
        </div>
        {/* Streak */}
        <div className="mt-3 flex items-center gap-1.5 bg-orange-50 rounded-lg px-3 py-1.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-xs font-medium text-orange-700">
            {user.streak}-day streak
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = current === item.href;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => setCurrent(item.href)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t space-y-0.5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, sub, color }) {
  return (
    <div className="rounded-2xl border bg-white p-5 flex items-start gap-4 shadow-sm">
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
          color,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [currentNav, setCurrentNav] = useState("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <Sidebar current={currentNav} setCurrent={setCurrentNav} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-8 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Good afternoon 👋</p>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Goal:</span>
              <Badge variant="secondary" className="text-xs font-normal gap-1">
                <TrendingUp className="h-3 w-3" />
                {user.goal}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative h-9 w-9 flex items-center justify-center rounded-lg border bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <Button size="sm" className="cursor-pointer gap-2" asChild>
              <Link href="/mentor">
                <Calendar className="h-4 w-4" />
                Book session
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
          <StatCard
            label="Total Sessions"
            value={user.totalSessions}
            icon={Video}
            sub="2 upcoming"
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Hours Learned"
            value={user.hoursLearned}
            icon={Clock}
            sub="This month"
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            label="Goals Done"
            value={user.goalsCompleted}
            icon={CheckCircle2}
            sub="of 4 total"
            color="bg-emerald-100 text-emerald-600"
          />
          <StatCard
            label="Day Streak"
            value={`${user.streak}🔥`}
            icon={Flame}
            sub="Keep it up!"
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* 2-column grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: upcoming + activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming sessions */}
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  Upcoming Sessions
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-xs cursor-pointer gap-1"
                  asChild
                >
                  <Link href="/dashboard/sessions">
                    View all
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="divide-y">
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="flex items-start gap-4 px-6 py-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl bg-linear-to-br flex items-center justify-center text-white font-semibold text-sm shrink-0",
                        s.mentorAvatarBg,
                      )}
                    >
                      {s.mentorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {s.topic}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        with {s.mentor}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {s.date} · {s.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {s.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          {s.type}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={s.date === "Today" ? "default" : "outline"}
                      className="cursor-pointer h-8 text-xs shrink-0"
                    >
                      {s.date === "Today" ? "Join Now" : "Prepare"}
                    </Button>
                  </div>
                ))}
                {upcomingSessions.length === 0 && (
                  <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No upcoming sessions.{" "}
                    <Link
                      href="/mentor"
                      className="text-primary hover:underline"
                    >
                      Book one now
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y">
                {recentActivity.map((a) => (
                  <div key={a.id} className="flex items-start gap-4 px-6 py-4">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        a.iconColor,
                      )}
                    >
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {a.desc}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {a.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: goals + resources */}
          <div className="space-y-6">
            {/* Goals */}
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="font-semibold text-gray-900">My Goals</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-xs cursor-pointer gap-1"
                  asChild
                >
                  <Link href="/dashboard/goals">
                    Manage
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="p-5 space-y-4">
                {goals.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4 shrink-0",
                          g.done ? "text-emerald-500" : "text-gray-300",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm flex-1",
                          g.done
                            ? "text-muted-foreground line-through"
                            : "text-gray-800",
                        )}
                      >
                        {g.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {g.progress}%
                      </span>
                    </div>
                    <Progress value={g.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Resources */}
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="px-5 py-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  Mentor's Reading List
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Curated by Rahul Kapoor
                </p>
              </div>
              <div className="p-5 space-y-3">
                {resources.map((r) => (
                  <div
                    key={r.title}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug">
                        {r.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.by}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-1.5 text-xs font-normal h-5"
                      >
                        {r.tag}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress card */}
            <div className="rounded-2xl bg-[#0f1729] text-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-blue-300" />
                <p className="font-semibold text-sm">Progress snapshot</p>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                You've completed{" "}
                <span className="font-semibold text-white">
                  {user.totalSessions} sessions
                </span>{" "}
                toward your goal of becoming an Engineering Manager. You're
                ahead of 78% of peers with a similar goal.
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Overall progress</span>
                  <span>64%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full w-[64%] rounded-full bg-blue-400" />
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="mt-4 w-full cursor-pointer text-xs"
                asChild
              >
                <Link href="/dashboard/goals">View full roadmap</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
