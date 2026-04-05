"use client";

import { Brain, Calendar, Target, TrendingUp, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Choose Your Service",
    desc: "Select from 1:1 mentorship, mock interviews, career coaching, or skill sprints — whatever fits your goal.",
    icon: Target,
    gradient: "from-purple-500 to-violet-600",
    iconBg: "bg-purple-600",
  },
  {
    step: "02",
    title: "Book Your Mentor",
    desc: "Browse vetted experts filtered by industry, role, and specialty. Pick a slot that works for you.",
    icon: Calendar,
    gradient: "from-indigo-500 to-blue-600",
    iconBg: "bg-indigo-600",
  },
  {
    step: "03",
    title: "Attend Your Session",
    desc: "Join a live video call. Dive deep, ask anything, work through your exact challenges in real time.",
    icon: Video,
    gradient: "from-blue-500 to-cyan-600",
    iconBg: "bg-blue-600",
  },
  {
    step: "04",
    title: "Receive AI Insights",
    desc: "Get an AI-generated summary, action items, and key takeaways delivered to your inbox right after.",
    icon: Brain,
    gradient: "from-cyan-500 to-teal-600",
    iconBg: "bg-cyan-600",
  },
  {
    step: "05",
    title: "Track Your Growth",
    desc: "Your dashboard evolves as you grow — milestones, skill charts, and session history all in one place.",
    icon: TrendingUp,
    gradient: "from-teal-500 to-emerald-600",
    iconBg: "bg-teal-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How VinceUp Works
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            From first click to measurable career progress in 5 simple steps.
          </p>
        </div>

        {/* Zigzag steps */}
        <div className="relative">
          {/* Vertical dashed connector line — centered on desktop */}
          <div
            className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 hidden md:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 6px, #c4b5fd 6px, #c4b5fd 12px)",
            }}
          />

          <div className="space-y-14 md:space-y-20">
            {steps.map((s, i) => {
              const isOdd = i % 2 === 0; // 01, 03, 05 → text left, number right
              // isOdd: text on left, number on right
              // isEven: number on left, text on right

              return (
                <div
                  key={s.step}
                  className="relative flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-0"
                >
                  {/* LEFT half */}
                  <div className="flex-1 flex justify-end md:pr-12">
                    {isOdd ? (
                      // Text on left
                      <div className="text-center md:text-right max-w-xs">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {s.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    ) : (
                      // Number on left
                      <div className="relative inline-flex items-center justify-center">
                        <span
                          className={cn(
                            "text-7xl sm:text-8xl font-black bg-linear-to-br bg-clip-text text-transparent select-none leading-none",
                            s.gradient,
                          )}
                        >
                          {s.step}
                        </span>
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-2 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg",
                            s.iconBg,
                          )}
                        >
                          <s.icon className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CENTER dot on the line */}
                  <div className="hidden md:flex items-start justify-center pt-2">
                    <div className="h-3 w-3 rounded-full bg-purple-400 border-2 border-white shadow-sm relative z-10" />
                  </div>

                  {/* RIGHT half */}
                  <div className="flex-1 flex justify-start md:pl-12">
                    {isOdd ? (
                      // Number on right
                      <div className="relative inline-flex items-center justify-center">
                        <span
                          className={cn(
                            "text-7xl sm:text-8xl font-black bg-linear-to-br bg-clip-text text-transparent select-none leading-none",
                            s.gradient,
                          )}
                        >
                          {s.step}
                        </span>
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-2 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg",
                            s.iconBg,
                          )}
                        >
                          <s.icon className="h-4 w-4" />
                        </div>
                      </div>
                    ) : (
                      // Text on right
                      <div className="text-center md:text-left max-w-xs">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {s.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;