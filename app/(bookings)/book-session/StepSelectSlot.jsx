"use client";

import { CalendarDays, Clock, Check, Star, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

// ─── Mock data (replace with API) ───
const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

const MENTORS = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    title: "Senior Engineering Manager at Google",
    rating: 4.9,
    reviews: 127,
    sessions: 234,
    tags: ["Software Engineering", "System Design", "Career Growth"],
    yearsExp: "12+",
    bio: "12+ years in Software Engineering and Leadership at Google, Meta, and startups",
  },
  {
    id: "michael-rodriguez",
    name: "Michael Rodriguez",
    title: "Principal Product Designer at Airbnb",
    rating: 5,
    reviews: 93,
    sessions: 178,
    tags: ["Product Design", "UX Research", "Portfolio Building"],
    yearsExp: "10+",
    bio: "10+ years in Product Design and UX at Airbnb, Spotify, and agencies",
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    title: "VP of Product at Stripe",
    rating: 4.8,
    reviews: 156,
    sessions: 289,
    tags: ["Product Management", "Strategy", "Stakeholder Management"],
    yearsExp: "15+",
    bio: "15+ years in Product and Strategy at Stripe, Amazon, and fintech startups",
  },
  {
    id: "james-thompson",
    name: "James Thompson",
    title: "Head of Data Science at Netflix",
    rating: 4.9,
    reviews: 104,
    sessions: 198,
    tags: ["Data Science", "Machine Learning", "Analytics"],
    yearsExp: "11+",
    bio: "11+ years in Data Science and ML at Netflix, Uber, and research labs",
  },
];

// ─── Avatar with initials ───
const MentorAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 text-primary font-bold text-base">
      {initials}
    </div>
  );
};

// ─── Mentor card ───
const MentorCard = ({ mentor, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(mentor)}
    className={`
      relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200
      ${
        isSelected
          ? "border-primary bg-primary/[0.02] dark:bg-primary/[0.05] shadow-sm"
          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
      }
    `}
  >
    {isSelected && (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 flex size-6 items-center justify-center rounded-full bg-primary text-white">
        <Check className="size-3.5" />
      </motion.div>
    )}

    <div className="flex items-start gap-3">
      <MentorAvatar name={mentor.name} />
      <div className="min-w-0 flex-1 pr-6">
        <h4 className="font-bold">{mentor.name}</h4>
        <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{mentor.title}</p>
        <div className="mt-1.5 flex items-center gap-2 text-sm">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{mentor.rating}</span>
          <span className="text-muted-foreground">({mentor.reviews})</span>
          <span className="text-muted-foreground">{mentor.sessions} sessions</span>
        </div>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
      {mentor.tags.map((tag) => (
        <span key={tag} className="text-xs font-medium text-primary">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function StepSelectSlot({ selectedService, selectedDate, onDateChange, selectedTime, onTimeChange, selectedMentor, onMentorChange, onBack, onNext }) {
  const isComplete = selectedDate && selectedTime && selectedMentor;
  const hasDateAndTime = selectedDate && selectedTime;

  const disablePastDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Select Date, Time & Mentor</h1>
        <p className="mt-2 text-muted-foreground">
          Booking: <span className="font-semibold text-primary underline">{selectedService?.title}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* ── Left: Date + Time ── */}
        <div className="space-y-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
              <CalendarDays className="size-5 text-primary" />
              Select Date
            </h3>
            <div className="flex justify-center">
              <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} disabled={disablePastDates} className="rounded-xl" />
            </div>
          </motion.div>

          {/* Time slots */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
              <Clock className="size-5 text-primary" />
              Select Time
            </h3>

            {!selectedDate ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Please select a date first</p>
            ) : (
              <motion.div className="grid grid-cols-3 gap-3" variants={stagger} initial="hidden" animate="visible">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <motion.button
                      key={slot}
                      variants={fadeIn}
                      type="button"
                      onClick={() => onTimeChange(slot)}
                      className={`
                        rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer
                        ${
                          isSelected
                            ? "border-primary text-primary bg-primary/5 dark:bg-primary/10"
                            : "border-gray-100 dark:border-gray-800 text-muted-foreground hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      {slot}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── Right: Mentors ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
        >
          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">Select Your Mentor</h3>

          {!hasDateAndTime ? (
            <p className="text-sm text-muted-foreground py-20 text-center">Please select a date and time first</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key="mentor-list" className="space-y-4 max-h-[580px] overflow-y-auto pr-1" variants={stagger} initial="hidden" animate="visible">
                {MENTORS.map((mentor) => (
                  <motion.div key={mentor.id} variants={fadeIn}>
                    <MentorCard mentor={mentor} isSelected={selectedMentor?.id === mentor.id} onSelect={onMentorChange} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-10 flex items-center justify-between max-w-5xl mx-auto">
        <Button variant="outline" size="lg" onClick={onBack} className="cursor-pointer">
          Back to Services
        </Button>
        <Button size="lg" variant={isComplete ? "default" : "outline"} disabled={!isComplete} onClick={onNext} className="cursor-pointer">
          Continue to Summary →
        </Button>
      </div>
    </div>
  );
}

export { MENTORS };
