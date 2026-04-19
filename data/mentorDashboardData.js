// ─── Mentor Dashboard Dummy Data ────────────────────────────────────────────

export const mentorStats = [
  {
    id: "sessions-delivered",
    label: "Sessions Delivered",
    value: "127",
    badge: "+12 this month",
    badgeColor: "purple",
    icon: "book",
  },
  {
    id: "average-rating",
    label: "Average Rating",
    value: "4.9",
    badge: "+0.3 this month",
    badgeColor: "orange",
    icon: "star",
  },
  {
    id: "repeat-mentee-rate",
    label: "Repeat Mentee Rate",
    value: "65%",
    badge: "+8% this month",
    badgeColor: "teal",
    icon: "users",
  },
  {
    id: "mentorship-hours",
    label: "Mentorship Hours",
    value: "94.5",
    badge: "+18 hrs this month",
    badgeColor: "green",
    icon: "clock",
  },
];

export const sessionsTrendData = [
  { month: "Jan", sessions: 8 },
  { month: "Feb", sessions: 12 },
  { month: "Mar", sessions: 14 },
  { month: "Apr", sessions: 18 },
  { month: "May", sessions: 24 },
  { month: "Jun", sessions: 32 },
];

export const ratingDistributionData = [
  { star: "5 ★", count: 89, pct: 89 },
  { star: "4 ★", count: 22, pct: 22 },
  { star: "3 ★", count: 8, pct: 8 },
  { star: "2 ★", count: 4, pct: 4 },
  { star: "1 ★", count: 2, pct: 2 },
];

export const milestones = [
  {
    id: "m1",
    label: "100 Sessions",
    icon: "award",
    achieved: true,
  },
  {
    id: "m2",
    label: "4.9+ Rating",
    icon: "star",
    achieved: true,
  },
  {
    id: "m3",
    label: "50+ Mentees",
    icon: "users",
    achieved: true,
  },
  {
    id: "m4",
    label: "Top 10%",
    icon: "target",
    achieved: false,
  },
];

// iconBg uses Tailwind static classes — these must stay in the data file
// so they're included in the JIT-compiled bundle at build time.
export const vegaInsights = [
  {
    id: "vi1",
    icon: "trending-up",
    title: "Performance Trending Up",
    body: "Your average rating increased by 0.3 points this month",
    iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/12 dark:text-emerald-300",
  },
  {
    id: "vi2",
    icon: "users",
    title: "High Repeat Rate",
    body: "85% of your mentees are booking follow-up sessions",
    iconBg: "bg-violet-50 text-violet-600 dark:bg-violet-500/12 dark:text-violet-300",
  },
  {
    id: "vi3",
    icon: "clock",
    title: "Session Optimization",
    body: "Tuesday afternoons have the highest mentee engagement",
    iconBg: "bg-sky-50 text-sky-600 dark:bg-sky-500/12 dark:text-sky-300",
  },
];

export const upcomingSessions = [
  {
    id: "us1",
    name: "Sarah Johnson",
    initials: "S",
    avatarColor: "bg-violet-600",
    sessionTag: "Session #5",
    isNew: false,
    type: "Mock Interview",
    duration: "45 min",
    date: "Today, 2:00 PM",
  },
  {
    id: "us2",
    name: "Michael Chen",
    initials: "M",
    avatarColor: "bg-emerald-600",
    sessionTag: "Session #1",
    isNew: true,
    type: "Career Guidance",
    duration: "60 min",
    date: "Today, 4:30 PM",
  },
  {
    id: "us3",
    name: "Priya Sharma",
    initials: "P",
    avatarColor: "bg-rose-500",
    sessionTag: "Session #3",
    isNew: false,
    type: "Resume Review",
    duration: "30 min",
    date: "Tomorrow, 10:00 AM",
  },
];
