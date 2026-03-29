"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Static Data ───────────────────────────────────────────────

const stats = [
  { label: "Active Learners", value: "12,400+", icon: Users },
  { label: "Expert Mentors", value: "340+", icon: Award },
  { label: "Sessions Completed", value: "98,000+", icon: Calendar },
  { label: "Avg. Rating", value: "4.9 / 5", icon: Star },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Our algorithm pairs you with mentors who have solved the exact problems you're facing — not just the same job title.",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: Zap,
    title: "Real-Time Availability",
    description:
      "Browse live slots, book instantly, and get calendar invites without the back-and-forth email chains.",
    accent: "bg-purple-50 text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Growth Tracking",
    description:
      "Set milestones, log sessions, and watch your progress dashboard evolve as you level up your career.",
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Shield,
    title: "Vetted Experts Only",
    description:
      "Every mentor passes a rigorous application and is reviewed quarterly. No hobbyists, only practitioners.",
    accent: "bg-orange-50 text-orange-600",
  },
  {
    icon: MessageSquare,
    title: "Async Q&A",
    description:
      "Drop quick questions between sessions. Mentors reply within 24 hours — because growth doesn't wait for your next call.",
    accent: "bg-pink-50 text-pink-600",
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    description:
      "Your mentor shares personalised reading lists, templates, and frameworks — no generic YouTube playlists.",
    accent: "bg-teal-50 text-teal-600",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Senior PM @ Razorpay",
    avatar: "PS",
    avatarBg: "bg-violet-100 text-violet-700",
    rating: 5,
    quote:
      "Within 3 sessions my mentor helped me reframe my product sense interview answers completely. Got the Razorpay offer 6 weeks later.",
  },
  {
    name: "Arjun Mehta",
    role: "SWE → Engineering Manager",
    avatar: "AM",
    avatarBg: "bg-blue-100 text-blue-700",
    rating: 5,
    quote:
      "The transition from IC to manager felt impossible until I found my mentor here. The 1:1 accountability made all the difference.",
  },
  {
    name: "Sneha Iyer",
    role: "Founder, Series A",
    avatar: "SI",
    avatarBg: "bg-emerald-100 text-emerald-700",
    rating: 5,
    quote:
      "My mentor had done exactly what I was trying to do — raise a seed round in India. No theoretical advice, only real playbooks.",
  },
];

const featuredMentors = [
  {
    name: "Rahul Kapoor",
    role: "VP Engineering, Flipkart",
    specialties: ["System Design", "Eng Leadership", "Hiring"],
    sessions: 210,
    rating: 4.9,
    avatarBg: "from-blue-700 to-blue-900",
    linkedin: "#",
  },
  {
    name: "Divya Nair",
    role: "Director of Product, Swiggy",
    specialties: ["Product Strategy", "0→1", "PMF"],
    sessions: 185,
    rating: 4.9,
    avatarBg: "from-purple-700 to-purple-900",
    linkedin: "#",
  },
  {
    name: "Karthik Reddy",
    role: "Founder & CEO, YC W22",
    specialties: ["Fundraising", "GTM", "Pitch Deck"],
    sessions: 163,
    rating: 5.0,
    avatarBg: "from-teal-600 to-teal-900",
    linkedin: "#",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Tell us your goal",
    body: "Promotion, career switch, startup, or skills upgrade — we map your destination before finding your guide.",
  },
  {
    step: "02",
    title: "Get matched",
    body: "AI shortlists 3–5 mentors who've walked a similar path. Browse profiles, read reviews, and pick your fit.",
  },
  {
    step: "03",
    title: "Book & grow",
    body: "Schedule a session, define a roadmap, and start making measurable progress — not just motivation.",
  },
];

// ─── Sub-Components ────────────────────────────────────────────

function StarRating({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}
const LinkedinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

function MentorCard({ mentor }) {
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="group relative rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
      {/* Avatar + info */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "h-14 w-14 rounded-xl bg-linear-to-br flex items-center justify-center text-white font-semibold text-lg shrink-0",
            mentor.avatarBg,
          )}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{mentor.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {mentor.role}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <StarRating count={5} />
            <span className="text-xs text-muted-foreground">
              {mentor.rating}
            </span>
          </div>
        </div>
        <a
          href={mentor.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[#0A66C2] hover:scale-110 transition-transform"
          aria-label="LinkedIn"
        >
          <LinkedinIcon className="h-4 w-4" />
        </a>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5">
        {mentor.specialties.map((s) => (
          <Badge key={s} variant="secondary" className="text-xs font-normal">
            {s}
          </Badge>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-xs text-muted-foreground">
          {mentor.sessions} sessions
        </span>
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer text-xs h-7"
          asChild
        >
          <Link href="/mentor">View Profile</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="w-full">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0f1729] text-white">
        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                AI-powered career growth, now in India
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Grow faster with a{" "}
              <span className="bg-linear-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                mentor who's been there
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg text-gray-300 leading-relaxed"
            >
              VinceUp connects you with verified industry practitioners for 1:1
              mentorship, strategic career guidance, and accountability — so you
              stop winging it and start executing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button
                size="lg"
                className="cursor-pointer gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
                asChild
              >
                <Link href="/mentor">
                  Find your mentor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="cursor-pointer text-white hover:bg-white/10 border border-white/20"
                asChild
              >
                <Link href="/book-session">
                  <Calendar className="h-4 w-4" />
                  Book a free session
                </Link>
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-400"
            >
              {[
                "No lock-in contracts",
                "Cancel anytime",
                "Money-back guarantee",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
              How it works
            </p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              From goal to growth in three steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent" />

            {howItWorks.map((step, i) => (
              <div
                key={step.step}
                className="relative flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-white border shadow-sm"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f1729] text-white">
                  <span className="text-lg font-bold">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
                {i < howItWorks.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-10 h-5 w-5 text-muted-foreground z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
              Platform features
            </p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to accelerate
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              We built the tools that make mentorship actually work — not just
              feel good.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-white p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className={cn(
                    "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl",
                    f.accent,
                  )}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED MENTORS ─────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
                Featured mentors
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                Learn from people who've done it
              </h2>
            </div>
            <Button
              variant="outline"
              asChild
              className="cursor-pointer shrink-0"
            >
              <Link href="/mentor">
                Browse all mentors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredMentors.map((mentor) => (
              <MentorCard key={mentor.name} mentor={mentor} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-20 bg-[#0f1729]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium uppercase tracking-widest text-blue-400 mb-3">
              Success stories
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Real careers, real results
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm flex flex-col gap-4"
              >
                <StarRating count={t.rating} />
                <blockquote className="text-gray-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold",
                      t.avatarBg,
                    )}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-6 shadow-lg shadow-primary/30">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Your next career move starts here
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Join over 12,000 professionals who are growing with intention.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="cursor-pointer gap-2 shadow-lg shadow-primary/30"
              asChild
            >
              <Link href="/signup">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer"
              asChild
            >
              <Link href="/mentor">Browse mentors</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required &bull; First session satisfaction guaranteed
          </p>
        </div>
      </section>
    </div>
  );
}
