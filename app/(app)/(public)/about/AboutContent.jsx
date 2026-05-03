"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Zap, Heart, Sparkles, Brain, CheckCircle2, Send, Mail, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const values = [
  {
    icon: Target,
    title: "Goal-Driven",
    desc: "Every feature is designed to help you achieve concrete career milestones",
  },
  {
    icon: Users,
    title: "Human-Centered",
    desc: "Real mentors with real experience, not just automated responses",
  },
  {
    icon: Zap,
    title: "AI-Enhanced",
    desc: "Intelligent automation that amplifies human wisdom",
  },
  {
    icon: Heart,
    title: "Impact-Focused",
    desc: "We measure success by the careers we help transform",
  },
];

function GetInTouch() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { name: "", email: "", comments: "" },
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    reset();
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24 pt-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get in Touch</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Have questions or want to learn more? We&apos;d love to hear from you.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="bg-[#F3F4FD] dark:bg-[#16133a]/60 border-0 rounded-[1rem] shadow-none">
          <CardContent className="p-8 sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="size-16 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Message Sent!</h3>
                <p className="text-muted-foreground text-sm max-w-xs">Thanks for reaching out. {`We'll`} get back to you as soon as possible.</p>
                <Button variant="outline" className="mt-2 rounded-full" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="font-semibold text-foreground">
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="Your full name"
                    className={`rounded-2xl bg-white dark:bg-[#0f0d2a] border dark:border-white/10 h-12 px-4 text-sm placeholder:text-muted-foreground focus-visible:ring-purple-500 ${
                      errors.name ? "border-red-400 focus-visible:ring-red-400" : "border-transparent"
                    }`}
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="font-semibold text-foreground">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`rounded-2xl bg-white dark:bg-[#0f0d2a] border dark:border-white/10 h-12 px-4 text-sm placeholder:text-muted-foreground focus-visible:ring-purple-500 ${
                      errors.email ? "border-red-400 focus-visible:ring-red-400" : "border-transparent"
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                    })}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-comments" className="font-semibold text-foreground">
                    Comments
                  </Label>
                  <Textarea
                    id="contact-comments"
                    placeholder="How can we help you?"
                    rows={6}
                    className={`rounded-2xl bg-white dark:bg-[#0f0d2a] border dark:border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground resize-none focus-visible:ring-purple-500 ${
                      errors.comments ? "border-red-400 focus-visible:ring-red-400" : "border-transparent"
                    }`}
                    {...register("comments", {
                      required: "Please enter your message",
                      minLength: { value: 10, message: "Message must be at least 10 characters" },
                    })}
                  />
                  {errors.comments && <p className="text-xs text-red-500 mt-1">{errors.comments.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-linear-to-r from-[#5B5BD6] to-[#7C3AED] hover:from-[#4a4ac4] hover:to-[#6b30d1] text-white font-semibold text-base shadow-lg shadow-purple-500/25 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="size-4" />
                      Submit
                    </span>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center mt-10">
          <a href="mailto:contact@vinceup.com">
            <Badge variant="secondary" className="flex items-center p-5 rounded-2xl bg-muted text-muted-foreground text-sm font-normal gap-1 border-0">
              <Mail className="size-5 text[#4F46E5]" />
              contact@vinceup.com
            </Badge>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function AboutContent() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-linear-to-br to-white via-[#FAF5FF] from-[#EEF2FF] dark:from-[#0f0a1a] dark:via-[#130d24] dark:to-background">
        <div className="absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-linear-to-tl from-white to-[#DAB2FF] dark:from-transparent dark:to-[#6b21a8]/30 rounded-full blur-3xl" />
        <div className="absolute top-60 bottom-0 -left-40 w-64 sm:w-96 h-64 sm:h-96 bg-linear-to-tr to-[#A3B3FF] from-white dark:from-transparent dark:to-[#4338ca]/30 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 bg-white/80 dark:bg-white/5 backdrop-blur px-4 py-1.5 rounded-full border-purple-100 dark:border-purple-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
            <span className="text-xs font-medium text-foreground">Building the Future of Career Growth</span>
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">About VinceUp</h1>
          <p className="text-base sm:text-lg md:text-xl text-[#4A5565] dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            {`We're`} building the future of career development by combining human expertise with AI intelligence.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-12 items-center">
          <div className="relative aspect-4/3 rounded-2xl shadow-2xl mt-6 mb-6 sm:mx-6 md:mx-0 order-2 md:order-1">
            <Card className="absolute -top-4 -left-3 sm:-top-6 sm:-left-6 z-20 p-3 sm:p-4 shadow-lg bg-white dark:bg-card max-w-[90%]">
              <CardContent className="flex gap-2 p-0">
                <div className="p-2 sm:p-2.5 rounded-[12px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                  <Brain className="size-4 sm:size-5 text-[#5B5BD6]" />
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm">VEGA AI</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Our smart co-pilot</p>
                </div>
              </CardContent>
            </Card>

            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image src={require("../../../../public/assets/about_container_img.png")} alt="Team collaborating" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>

            <Card className="absolute -bottom-4 -right-3 sm:-bottom-6 sm:-right-6 z-20 p-3 sm:p-4 shadow-lg bg-white dark:bg-card max-w-[90%]">
              <CardContent className="flex gap-2 p-0">
                <div className="p-2 sm:p-2.5 rounded-[12px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="size-4 sm:size-5 text-[#4F9CF9]" />
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm">+47% Growth</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">This month</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-[#364153] dark:text-slate-300 order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Our Mission</h2>
            <p className="leading-relaxed mb-4 text-sm sm:text-base">
              VinceUp exists to democratize access to world-class career mentorship. We believe that everyone deserves guidance from experienced professionals, paired with intelligent tools that help
              them grow faster and smarter.
            </p>
            <p className="leading-relaxed text-sm sm:text-base">
              By combining expert human mentorship with our AI assistant VEGA, we create a comprehensive career growth operating system that tracks progress, provides insights, and helps professionals
              achieve their goals with clarity and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <Card className="border-0 bg-linear-to-br from-[#FAF5FF] to-[#EEF2FF] dark:from-purple-950/40 dark:to-indigo-950/40 rounded-[16px] shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Our Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto pb-8 sm:pb-10 px-4 sm:px-6">
            <p>
              VinceUp was born from a simple observation: traditional career development is broken. Expensive career coaches are out of reach for most, while free advice is often generic and
              unhelpful.
            </p>
            <p>
              In 2024, our founders came together with a vision to bridge this gap. We built a platform that makes expert mentorship accessible and affordable, while leveraging AI to maximize the
              impact of every interaction.
            </p>
            <p>Today, {`we're`} proud to serve over 25,000 professionals worldwide, with a network of 500+ expert mentors and our AI assistant VEGA working 24/7 to accelerate career growth.</p>
          </CardContent>
        </Card>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {values.map((v) => (
            <Card key={v.title} className="transition-all border border-border hover:shadow-md hover:border-2 hover:border-purple-500 dark:hover:border-purple-400">
              <CardContent className="pt-6">
                <div className="size-12 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-5 shadow-md shadow-purple-500/20">
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="min-h-90 py-20 bg-[linear-gradient(to_bottom,#0F172A_0%,#11192C_13%,#131B2E_25%,#141E30_38%,#162032_50%,#182235_63%,#1A2437_75%,#1C2739_88%,#1E293B_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">Experienced leaders passionate about transforming career development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="aspect-4/3 overflow-hidden">
                <Image src={require("../../../../public/assets/vallabah.png")} alt="Vallabah" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">Vallabah</h3>
                <p className="text-purple-400 font-medium mb-4">CEO &amp; Co-Founder</p>
                <p className="text-gray-400 text-sm leading-relaxed">Former VP of Engineering at Meta, passionate about democratizing access to quality mentorship</p>
              </div>
            </div>

            <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="aspect-4/3 overflow-hidden">
                <Image src={require("../../../../public/assets/sarah.png")} alt="Sarah Kim" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">Sarah Kim</h3>
                <p className="text-purple-400 font-medium mb-4">CTO &amp; Co-Founder</p>
                <p className="text-gray-400 text-sm leading-relaxed">AI researcher and product leader, previously led ML teams at Google and OpenAI</p>
              </div>
            </div>

            <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="aspect-4/3 overflow-hidden">
                <Image src={require("../../../../public/assets/Vasista.png")} alt="Vasista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">Vasista</h3>
                <p className="text-purple-400 font-medium mb-4">Director of Operations</p>
                <p className="text-gray-400 text-sm leading-relaxed">Operations expert with 15+ years scaling marketplace platforms and building communities</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 px-8 py-16 md:px-12 md:py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "25,000+", label: "Active Users" },
                { value: "500+", label: "Expert Mentors" },
                { value: "10,000+", label: "Sessions Completed" },
                { value: "4.9/5", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GetInTouch />
    </div>
  );
}
