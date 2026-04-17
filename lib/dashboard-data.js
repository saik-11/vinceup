import { z } from "zod";

const dashboardUserSchema = z.object({
  name: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  role: z.enum(["viewer", "admin"]).default("viewer"),
  headline: z.string().nullable().optional(),
});

const dashboardStatSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number().nullable().optional(),
  total: z.number().nullable().optional(),
  format: z.enum(["fraction", "percentage"]).default("fraction"),
  accent: z.enum(["blue", "green", "purple", "orange"]),
  icon: z.enum(["calendar", "check", "brain", "trend"]),
  helper: z.string().nullable().optional(),
});

const dashboardSessionSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  mentorName: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  prepHref: z.string().nullable().optional(),
});

const dashboardTaskSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  priority: z.enum(["high", "medium", "low"]).nullable().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
});

const dashboardInsightSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  ctaLabel: z.string().nullable().optional(),
  ctaHref: z.string().nullable().optional(),
});

const dashboardRecentInsightSchema = z.object({
  id: z.string(),
  date: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  meta: z.string().nullable().optional(),
});

const dashboardQuickActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  icon: z.enum(["mentor", "roadmap", "profile", "admin"]),
});

const dashboardMetaSchema = z.object({
  scenario: z.string(),
  roleLabel: z.string(),
  simulateLatencyMs: z.number().int().nonnegative().default(0),
  shouldThrow: z.boolean().default(false),
});

const dashboardPayloadSchema = z.object({
  user: dashboardUserSchema,
  stats: z.array(dashboardStatSchema),
  sessions: z.array(dashboardSessionSchema),
  tasks: z.array(dashboardTaskSchema),
  insights: z.array(dashboardInsightSchema),
  recentInsights: z.array(dashboardRecentInsightSchema),
  quickActions: z.array(dashboardQuickActionSchema),
  meta: dashboardMetaSchema,
});

const baseDashboardPayload = {
  user: {
    name: "Vinny",
    subtitle: "Here's your career growth overview",
    avatarUrl: null,
    role: "viewer",
    headline: "Career Growth Dashboard",
  },
  stats: [
    {
      id: "sessions-completed",
      label: "Sessions Completed",
      value: 8,
      total: 12,
      format: "fraction",
      accent: "blue",
      icon: "calendar",
      helper: "2 sessions scheduled this month",
    },
    {
      id: "tasks-completed",
      label: "Tasks Completed",
      value: 24,
      total: 35,
      format: "fraction",
      accent: "green",
      icon: "check",
      helper: "5 due this week",
    },
    {
      id: "skills-improved",
      label: "Skills Improved",
      value: 7,
      total: 10,
      format: "fraction",
      accent: "purple",
      icon: "brain",
      helper: "Focus on communication next",
    },
    {
      id: "overall-progress",
      label: "Overall Progress",
      value: 68,
      total: null,
      format: "percentage",
      accent: "orange",
      icon: "trend",
      helper: "Up 9% since last review",
    },
  ],
  sessions: [
    {
      id: "session-tech-interview",
      title: "Technical Interview Guidance",
      mentorName: "Sarah Chen",
      date: "2026-03-18",
      time: "10:00 AM",
      prepHref: "/clarity-capsule",
    },
    {
      id: "session-career-mentorship",
      title: "Career Mentorship",
      mentorName: "Priya Sharma",
      date: "2026-03-21",
      time: "2:00 PM",
      prepHref: "/clarity-map",
    },
  ],
  tasks: [
    {
      id: "task-resume-bullets",
      title: "Rewrite resume bullet points with action verbs",
      dueDate: "2026-03-20",
      priority: "high",
      status: "in_progress",
    },
    {
      id: "task-keyword-research",
      title: "Research 10 target job postings for keywords",
      dueDate: "2026-03-22",
      priority: "high",
      status: "todo",
    },
    {
      id: "task-star-stories",
      title: "Prepare 5 STAR method stories",
      dueDate: "2026-03-25",
      priority: "medium",
      status: "todo",
    },
  ],
  insights: [
    {
      id: "insight-session-prep",
      title: "Upcoming Session Prep",
      body: "Your session with Sarah is in 2 days. Start preparing now for the best results.",
      ctaLabel: "Start Prep",
      ctaHref: "/clarity-capsule",
    },
    {
      id: "insight-progress",
      title: "Progress Update",
      body: "You've completed 68% of your career goals. Keep up the momentum.",
      ctaLabel: "View Progress",
      ctaHref: "/growth-meter",
    },
    {
      id: "insight-skill-focus",
      title: "Skill Focus",
      body: "Based on your sessions, focus on system design and communication skills.",
      ctaLabel: "Review Focus Areas",
      ctaHref: "/action-board",
    },
  ],
  recentInsights: [
    {
      id: "recent-resume-review",
      date: "2026-03-10",
      summary: "Reviewed resume structure and optimized for ATS",
      meta: "4 insights - 4 action items",
    },
    {
      id: "recent-mock-interview",
      date: "2026-03-05",
      summary: "Conducted full mock behavioral interview",
      meta: "4 insights - 4 action items",
    },
  ],
  quickActions: [
    {
      id: "action-find-mentor",
      label: "Find a Mentor",
      href: "/mentor",
      icon: "mentor",
    },
    {
      id: "action-roadmap",
      label: "View Career Roadmap",
      href: "/clarity-map",
      icon: "roadmap",
    },
    {
      id: "action-profile",
      label: "Update Profile",
      href: "/personal-details",
      icon: "profile",
    },
  ],
  meta: {
    scenario: "default",
    roleLabel: "Viewer",
    simulateLatencyMs: 0,
    shouldThrow: false,
  },
};

function mergeDashboardPayload(overrides = {}) {
  return {
    ...baseDashboardPayload,
    ...overrides,
    user: {
      ...baseDashboardPayload.user,
      ...overrides.user,
    },
    meta: {
      ...baseDashboardPayload.meta,
      ...overrides.meta,
    },
    stats: overrides.stats ?? baseDashboardPayload.stats,
    sessions: overrides.sessions ?? baseDashboardPayload.sessions,
    tasks: overrides.tasks ?? baseDashboardPayload.tasks,
    insights: overrides.insights ?? baseDashboardPayload.insights,
    recentInsights:
      overrides.recentInsights ?? baseDashboardPayload.recentInsights,
    quickActions: overrides.quickActions ?? baseDashboardPayload.quickActions,
  };
}

export const dashboardDummyJson = {
  default: mergeDashboardPayload(),
  emptySessions: mergeDashboardPayload({
    meta: { scenario: "emptySessions" },
    sessions: [],
  }),
  noTasks: mergeDashboardPayload({
    meta: { scenario: "noTasks" },
    tasks: [],
  }),
  partialData: mergeDashboardPayload({
    meta: { scenario: "partialData" },
    sessions: [
      {
        id: "session-partial",
        title: "Offer Negotiation Strategy",
        mentorName: null,
        date: "2026-03-28",
        time: null,
        prepHref: "/clarity-capsule",
      },
    ],
    tasks: [
      {
        id: "task-partial",
        title: "Audit LinkedIn About section for recruiter clarity",
        dueDate: null,
        priority: "medium",
        status: "todo",
      },
    ],
    recentInsights: [
      {
        id: "recent-partial",
        date: null,
        summary: "Feedback synced from mentor notes. A few structured recommendations are still processing.",
        meta: null,
      },
    ],
  }),
  nullValues: mergeDashboardPayload({
    meta: { scenario: "nullValues" },
    user: {
      name: null,
      subtitle: null,
      avatarUrl: null,
    },
    stats: [
      {
        id: "sessions-completed",
        label: "Sessions Completed",
        value: null,
        total: 12,
        format: "fraction",
        accent: "blue",
        icon: "calendar",
        helper: "Awaiting sync",
      },
      {
        id: "tasks-completed",
        label: "Tasks Completed",
        value: 0,
        total: 35,
        format: "fraction",
        accent: "green",
        icon: "check",
        helper: null,
      },
      {
        id: "skills-improved",
        label: "Skills Improved",
        value: null,
        total: 10,
        format: "fraction",
        accent: "purple",
        icon: "brain",
        helper: "Assessment pending",
      },
      {
        id: "overall-progress",
        label: "Overall Progress",
        value: null,
        total: null,
        format: "percentage",
        accent: "orange",
        icon: "trend",
        helper: "Progress will appear after your first session",
      },
    ],
  }),
  longNames: mergeDashboardPayload({
    meta: { scenario: "longNames" },
    user: {
      name: "Vincent Alexander Udayakumar Prabhakaran",
    },
    sessions: [
      {
        id: "session-long-name-1",
        title: "Executive Presence and Cross-Functional Stakeholder Influence",
        mentorName: "Dr. Alexandra-Marie de la Fuente Wellington",
        date: "2026-03-18",
        time: "10:00 AM",
        prepHref: "/clarity-capsule",
      },
      {
        id: "session-long-name-2",
        title: "Senior Platform Engineering Leadership Transition Planning",
        mentorName: "Priyadarshini Lakshmi Narayanan Subramaniam",
        date: "2026-03-21",
        time: "2:00 PM",
        prepHref: "/clarity-map",
      },
    ],
  }),
  slowLoading: mergeDashboardPayload({
    meta: {
      scenario: "slowLoading",
      simulateLatencyMs: 1500,
    },
  }),
  viewerRole: mergeDashboardPayload({
    meta: {
      scenario: "viewerRole",
      roleLabel: "Viewer",
    },
    user: {
      role: "viewer",
    },
  }),
  adminRole: mergeDashboardPayload({
    meta: {
      scenario: "adminRole",
      roleLabel: "Admin",
    },
    user: {
      name: "Vinny",
      role: "admin",
      headline: "Career Growth Dashboard - Admin View",
    },
    quickActions: [
      {
        id: "action-find-mentor",
        label: "Find a Mentor",
        href: "/mentor",
        icon: "mentor",
      },
      {
        id: "action-roadmap",
        label: "View Career Roadmap",
        href: "/clarity-map",
        icon: "roadmap",
      },
      {
        id: "action-admin",
        label: "Open Admin Controls",
        href: "/settings",
        icon: "admin",
      },
    ],
  }),
  errorState: mergeDashboardPayload({
    meta: {
      scenario: "errorState",
      shouldThrow: true,
    },
  }),
};

export function getDashboardScenarioName(searchParams = {}) {
  const scenarioParam = searchParams?.scenario;
  if (
    typeof scenarioParam === "string" &&
    Object.hasOwn(dashboardDummyJson, scenarioParam)
  ) {
    return scenarioParam;
  }

  return "default";
}

export function getDashboardPayload(scenarioName) {
  return dashboardPayloadSchema.parse(
    dashboardDummyJson[scenarioName] ?? dashboardDummyJson.default,
  );
}
