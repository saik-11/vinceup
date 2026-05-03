"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Brain, Calendar, CheckCircle2, ChevronDown, Lightbulb, MessageCircle, Mic, Shield, Star, Target, TrendingUp, Users, Video, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import HowItWorks from "@/components/home/HowItWorks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Data ──────────────────────────────────────────────────────

const heroStats = [
  { value: "500+", label: "Expert Mentors" },
  { value: "25k+", label: "Learners Helped" },
  { value: "10k+", label: "Sessions Done" },
];

const whyChoose = [
  {
    icon: Target,
    title: "Personalised Goals",
    desc: "Build a tailored roadmap aligned to your exact career destination.",
  },
  {
    icon: Brain,
    title: "Structured Guidance",
    desc: "Get frameworks, not opinions — from mentors who've done it.",
  },
  {
    icon: TrendingUp,
    title: "Tracked Results",
    desc: "See measurable progress every session with milestone tracking.",
  },
  {
    icon: Shield,
    title: "Mentors Are Vetted",
    desc: "Every expert passes our rigorous quality bar. No filler profiles.",
  },
];

const aiFeatures = [
  { icon: Mic, text: "AI Session Summaries — auto-captured after every call" },
  {
    icon: Lightbulb,
    text: "Smart Action Items — prioritised next steps for you",
  },
  {
    icon: BarChart3,
    text: "Progress Intelligence — tracks trends across sessions",
  },
  {
    icon: MessageCircle,
    text: "Between-session Q&A — AI-assisted async support",
  },
];

const expertStats = [
  { value: "10+", label: "Years Experience", sub: "Average mentor seniority" },
  { value: "50+", label: "Industries", sub: "Covered by our mentor pool" },
  { value: "95%", label: "Success Rate", sub: "Learners hit their first goal" },
];

const featuredMentors = [
  {
    name: "Rahul Kapoor",
    role: "VP Engineering",
    company: "Flipkart",
    rating: 4.9,
    sessions: 210,
    initials: "RK",
    bg: "from-indigo-500 to-purple-700",
    specialties: ["Eng Leadership", "System Design"],
  },
  {
    name: "Divya Nair",
    role: "Director of Product",
    company: "Swiggy",
    rating: 4.9,
    sessions: 185,
    initials: "DN",
    bg: "from-purple-500 to-pink-700",
    specialties: ["Product Strategy", "0→1"],
  },
  {
    name: "Karthik Reddy",
    role: "Founder & CEO",
    company: "YC W22",
    rating: 5.0,
    sessions: 163,
    initials: "KR",
    bg: "from-teal-500 to-cyan-700",
    specialties: ["Fundraising", "GTM"],
  },
  {
    name: "Ananya Ghosh",
    role: "Senior Data Scientist",
    company: "Google",
    rating: 4.8,
    sessions: 134,
    initials: "AG",
    bg: "from-rose-500 to-pink-700",
    specialties: ["ML/AI", "Interview Prep"],
  },
];

const mentorBenefits = [
  "Set your own hourly rate — you keep 85%",
  "Flexible scheduling — mentor on your timeline",
  "Access to a pool of motivated, vetted learners",
  "AI tools to help you prepare and follow up",
  "Build your personal brand and expand your network",
];

const pricingFeatures = [
  { label: "1:1 mentorship sessions", included: true },
  { label: "AI session summaries", included: true },
  { label: "Async Q&A with mentor", included: true },
  { label: "Progress dashboard", included: true },
  { label: "Resource library access", included: true },
  { label: "Session recordings", included: false },
  { label: "Priority matching", included: false },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Senior PM @ Razorpay",
    avatar: "PS",
    bg: "bg-violet-100 text-violet-700",
    rating: 5,
    quote: "Within 3 sessions my mentor completely reframed how I approach product sense interviews. Got the Razorpay offer 6 weeks later. Couldn't have done it without VinceUp.",
  },
  {
    name: "Arjun Mehta",
    role: "SWE → Engineering Manager",
    avatar: "AM",
    bg: "bg-blue-100 text-blue-700",
    rating: 5,
    quote: "The IC-to-manager transition felt impossible to navigate alone. My mentor gave me a real playbook and held me accountable every step of the way.",
  },
  {
    name: "Sneha Iyer",
    role: "Founder, Series A",
    avatar: "SI",
    bg: "bg-emerald-100 text-emerald-700",
    rating: 5,
    quote: "My mentor had done exactly what I was trying to do — raise a seed round in India. No theoretical advice, only real operator playbooks.",
  },
];

const faqs = [
  {
    q: "How are mentors selected on VinceUp?",
    a: "Every mentor goes through a multi-stage application: background verification, a live demo session, and quarterly reviews. We accept fewer than 15% of applicants.",
  },
  {
    q: "How do I book a mentorship session?",
    a: "Search mentors by specialty or goal, view their live availability calendar, and book directly. You'll get an instant calendar invite and video link.",
  },
  {
    q: "What happens during a session?",
    a: "You'll meet 1:1 via video. Sessions are structured around your specific goal. Afterward, our AI generates a summary and action items for you.",
  },
  {
    q: "Is there a free trial or intro session?",
    a: "Yes — every mentor offers a free 15-minute intro call so you can check chemistry before committing to a paid session.",
  },
  {
    q: "How does pricing work?",
    a: "Mentors set their own rates, typically $2-$5 per hour equivalent. You only pay per session — no subscriptions or lock-in contracts.",
  },
  {
    q: "Can I become a mentor on VinceUp?",
    a: "Absolutely. Apply via the 'Become a Mentor' page. We're looking for senior practitioners with 5+ years of hands-on industry experience.",
  },
];

// ─── Sub-components ────────────────────────────────────────────

function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: explanation
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors cursor-pointer"
      >
        {q}
        <ChevronDown className={cn("ml-4 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────

export default function HomeContent() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0C0E2B] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          // style={{
          //   backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          //   backgroundSize: "40px 40px",
          // }}
        />
        <div className="pointer-events-none absolute -top-40 -left-40 h-125 w-125 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
                  <Zap className="h-3.5 w-3.5" />
                  AI-powered career growth platform
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]"
              >
                Your Career Growth <span className="bg-linear-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">Operating System</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-5 max-w-lg text-base text-slate-300 leading-relaxed">
                Accelerate your career with AI-driven insights, 1:1 mentorship from verified industry experts, and structured roadmaps built for where you actually want to go.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="cursor-pointer gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg shadow-purple-600/40" asChild>
                  <Link href="/mentor">
                    Explore Mentors
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="cursor-pointer text-white hover:bg-white/10 border border-white/20" asChild>
                  <Link href="/book-session">
                    <Calendar className="h-4 w-4 mr-1" />
                    Book Free Session
                  </Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.36 }} className="mt-10 flex flex-wrap gap-10">
                {heroStats.map(({ value, label }, i) => (
                  <div key={label}>
                    {i > 0 && <div className="hidden sm:block absolute h-8 w-px bg-white/10 -left-5 top-1/2 -translate-y-1/2" />}
                    <p className="text-2xl font-extrabold text-white">{value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — dashboard card mockup */}
            <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:block">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-4">
                {/* mentor mini card */}
                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">RK</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Rahul Kapoor</p>
                    <p className="text-xs text-slate-400">VP Engineering · Flipkart</p>
                  </div>
                  <span className="rounded-lg bg-purple-500/30 px-2.5 py-1 text-xs font-medium text-purple-200 shrink-0">Available</span>
                </div>

                {/* stat row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Sessions", val: "210" },
                    { label: "Rating", val: "4.9 ★" },
                    { label: "Learners", val: "180+" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                      <p className="text-base font-bold text-white">{s.val}</p>
                      <p className="text-xs text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* progress bars */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                  <p className="text-xs font-medium text-slate-300">Your progress</p>
                  {[
                    { label: "System Design", pct: 78 },
                    { label: "Leadership Skills", pct: 55 },
                    { label: "Interview Prep", pct: 90 },
                  ].map(({ label, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{label}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-linear-to-r from-purple-500 to-indigo-400" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* next session */}
                <div className="flex items-center gap-3 rounded-xl bg-purple-600/20 border border-purple-500/30 p-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white">Next session</p>
                    <p className="text-xs text-purple-300">Today · 4:00 PM with Rahul</p>
                  </div>
                  <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 cursor-pointer border-0 shrink-0">
                    Join
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE VINCEUP ══════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose VinceUp?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">
              The only platform that combines AI-driven insights with human mentorship and structured frameworks to accelerate career growth.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item) => (
              <div key={item.title} className="group rounded-2xl border bg-white p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" className="cursor-pointer border-purple-200 text-purple-700 hover:bg-purple-50" asChild>
              <Link href="/about">
                Know More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══ AI CAREER INTELLIGENCE PARTNER ═════════════════════ */}
      <section className="relative overflow-hidden bg-[#0C0E2B] py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute top-0 left-1/3 h-72 w-72 rounded-full bg-purple-700/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">AI-Powered</Badge>
              <h2 className="text-3xl font-bold text-white sm:text-4xl leading-tight">
                Your AI Career <span className="bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Intelligence Partner</span>
              </h2>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed max-w-md">
                VinceUp AI Career Growth Assistant works 24/7 to help you maximise every session, stay on track between calls, and surface the insights that matter most.
              </p>
              <ul className="mt-8 space-y-4">
                {aiFeatures.map((f) => (
                  <li key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-600/30 text-purple-300">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-slate-300 leading-relaxed">{f.text}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 cursor-pointer bg-purple-600 hover:bg-purple-700 border-0 shadow-lg shadow-purple-600/30 gap-2" asChild>
                <Link href="/signup">
                  Try it free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right — AI chat mockup */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <p className="text-xs text-slate-400 font-medium">VinceUp AI · Online</p>
              </div>
              {[
                {
                  from: "ai",
                  text: "Your last session covered delegation frameworks. Here are your 3 key action items for this week 👇",
                },
                {
                  from: "ai",
                  text: "① Shadow 1 cross-team meeting\n② Draft your team's OKRs\n③ Read Chapter 3 of The Manager's Path",
                },
                {
                  from: "user",
                  text: "Can you remind me what Rahul said about skip-levels?",
                },
                {
                  from: "ai",
                  text: "Rahul recommended monthly skip-levels starting with curiosity questions, not performance reviews. He shared a template — want me to pull it up?",
                },
              ].map((msg, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: explanation
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line",
                    msg.from === "ai" ? "bg-white/10 text-slate-200 rounded-tl-sm" : "ml-auto bg-purple-600 text-white rounded-tr-sm",
                  )}
                >
                  {msg.text}
                </div>
              ))}
              <div className="flex gap-1.5 px-4 py-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* ══ LEARN FROM INDUSTRY EXPERTS ════════════════════════ */}
      <section className="bg-[#0C0E2B] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Learn from Industry Experts</h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">Our guidance comes from practitioners {`who've`} solved real problems — not coaches with only theoretical knowledge.</p>
          </div>

          {/* Expert stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {expertStats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-4xl font-extrabold text-purple-400">{s.value}</p>
                <p className="mt-1 font-semibold text-white">{s.label}</p>
                <p className="mt-1 text-xs text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Mentor cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredMentors.map((m) => (
              <div key={m.name} className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("h-12 w-12 rounded-xl bg-linear-to-br flex items-center justify-center text-white font-bold text-sm shrink-0", m.bg)}>{m.initials}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{m.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {m.role} · {m.company}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {m.specialties.map((s) => (
                    <span key={s} className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-slate-300 font-medium">{m.rating}</span>
                  <span className="text-xs text-slate-500">· {m.sessions} sessions</span>
                </div>
                <Button size="sm" className="w-full cursor-pointer h-8 text-xs bg-purple-600 hover:bg-purple-700 border-0" asChild>
                  <Link href="/mentor">Book Now</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" className="cursor-pointer text-white border-white/20 hover:bg-white/10 gap-2" asChild>
              <Link href="/mentor">
                View All Mentors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══ BECOME A MENTOR ════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200 text-xs">For Experts</Badge>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
                Share Your Expertise. <span className="text-purple-600">Earn While You Impact.</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-md">
                Join our mentor network and turn your hard-won experience into income — while making a real difference in {`someone's`} career.
              </p>
              <ul className="mt-6 space-y-3">
                {mentorBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 cursor-pointer bg-purple-600 hover:bg-purple-700 border-0 gap-2 shadow-lg shadow-purple-600/25" asChild>
                <Link href="/become-a-mentor">
                  Apply to Become a Mentor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right side — stat badges */}
            <div className="relative">
              <div className="rounded-2xl bg-linear-to-br from-purple-50 to-indigo-100 h-72 lg:h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-24 w-24 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-3">
                    <Users className="h-10 w-10" />
                  </div>
                  <p className="text-sm text-purple-700 font-medium">Join our mentor network</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border bg-white shadow-lg p-4 text-center">
                <p className="text-xl font-bold text-purple-600">$150+</p>
                <p className="text-xs text-muted-foreground">Avg hourly earnings</p>
              </div>
              <div className="absolute -top-4 -right-4 rounded-2xl border bg-white shadow-lg p-4 text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <p className="text-xl font-bold">4.0</p>
                </div>
                <p className="text-xs text-muted-foreground">Min mentor rating</p>
              </div>
              <div className="absolute bottom-12 -right-4 rounded-2xl border bg-white shadow-lg p-4 text-center">
                <p className="text-xl font-bold text-purple-600">100+</p>
                <p className="text-xs text-muted-foreground">Active mentors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRICING ════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-3 text-muted-foreground text-sm">Pay only for the time you use. No subscriptions, no lock-ins, no surprises.</p>

          <div className="mt-10 rounded-2xl border bg-white shadow-sm p-8">
            <div className="flex items-end justify-center gap-1">
              <span className="text-6xl font-extrabold text-purple-600">$2–$5</span>
              <span className="text-xl text-muted-foreground mb-2">/hr</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Rates set by mentors · Only pay per session · No subscription required</p>

            <div className="mt-8 text-left space-y-3 border-t pt-6 max-w-xs mx-auto">
              {pricingFeatures.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <CheckCircle2 className={cn("h-4 w-4 shrink-0", f.included ? "text-purple-600" : "text-gray-300")} />
                  <span className={cn("text-sm", f.included ? "text-gray-800" : "text-gray-400")}>{f.label}</span>
                </div>
              ))}
            </div>

            <Button className="mt-8 cursor-pointer bg-purple-600 hover:bg-purple-700 border-0 gap-2 shadow-lg shadow-purple-600/25 w-full max-w-xs" asChild>
              <Link href="/mentor">
                Browse Mentors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═══════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Success Stories</h2>
            <p className="mt-3 text-muted-foreground text-sm">
              {`Don't`} take our word for it — hear from learners {`who've`} levelled up.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
                <Stars n={t.rating} />
                <blockquote className="text-sm text-gray-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0", t.bg)}>{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-3 text-muted-foreground text-sm">Everything you need to know about VinceUp.</p>
          </div>
          <div className="rounded-2xl border bg-white shadow-sm px-6 divide-y">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
