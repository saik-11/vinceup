"use client";

import { useMemo } from "react";
import { CalendarDays, Clock, Check, Globe, AlertCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

// ─── Timezone Badge ───
const TimezoneBadge = ({ timezone }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
    <Globe className="size-3" />
    {timezone}
  </span>
);

// ─── Avatar with initials ───
const MentorAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 text-primary font-bold text-base">
      {initials}
    </div>
  );
};

// ─── Mentor Card (slot-based) ───
const MentorCard = ({ slot, isSelected, onSelect }) => {
  const { mentor, service_type, local_time } = slot;
  return (
    <div
      onClick={() => onSelect(slot)}
      className={`
        relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200
        ${
          isSelected
            ? "border-primary bg-primary/2 dark:bg-primary/5 shadow-sm"
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
          {mentor.company_name && <p className="text-xs text-muted-foreground mt-0.5">{mentor.company_name}</p>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {service_type && <span className="text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-full px-2.5 py-0.5">{service_type}</span>}
        {mentor.industry && <span className="text-xs text-muted-foreground">{mentor.industry}</span>}
        {local_time && (
          <span className="ml-auto text-xs text-muted-foreground">
            {local_time.start_time} – {local_time.end_time}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Skeletons ───
const TimeSkeleton = () => (
  <div className="grid grid-cols-3 gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-11 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    ))}
  </div>
);

const MentorSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-2xl border-2 border-gray-100 dark:border-gray-800 p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="size-14 rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-48 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Empty / Error States ───
const EmptyState = ({ message }) => <p className="py-16 text-center text-sm text-muted-foreground">{message}</p>;

const ErrorState = ({ onRetry }) => (
  <div className="py-10 flex flex-col items-center gap-3">
    <AlertCircle className="size-8 text-destructive/70" />
    <p className="text-sm text-muted-foreground">Failed to load available slots</p>
    <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 cursor-pointer">
      <RotateCcw className="size-3.5" />
      Retry
    </Button>
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

export default function StepSelectSlot({
  selectedService,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  selectedMentor,
  onMentorChange,
  availableSlots,
  displayTimezone,
  loadingSlots,
  slotsError,
  onRetry,
  onBack,
  onNext,
}) {
  const isComplete = selectedDate && selectedTime && selectedMentor;

  const disablePastDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const uniqueTimes = useMemo(() => {
    const times = availableSlots.map((s) => s.local_time?.start_time ?? s.start_time);
    return [...new Set(times)].sort();
  }, [availableSlots]);

  const mentorsForTime = useMemo(() => {
    if (!selectedTime) return [];
    return availableSlots.filter((s) => (s.local_time?.start_time ?? s.start_time) === selectedTime);
  }, [availableSlots, selectedTime]);

  const renderTimeSection = () => {
    if (!selectedDate) return <EmptyState message="Please select a date first" />;
    if (loadingSlots) return <TimeSkeleton />;
    if (slotsError) return <ErrorState onRetry={onRetry} />;
    if (uniqueTimes.length === 0) return <EmptyState message="No slots available for selected date" />;

    return (
      <motion.div className="grid grid-cols-3 gap-3" variants={stagger} initial="hidden" animate="visible">
        {uniqueTimes.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <motion.button
              key={time}
              variants={fadeIn}
              type="button"
              onClick={() => onTimeChange(time)}
              className={`
                rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer
                ${
                  isSelected
                    ? "border-primary text-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-100 dark:border-gray-800 text-muted-foreground hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              {time}
            </motion.button>
          );
        })}
      </motion.div>
    );
  };

  const renderMentorSection = () => {
    if (!selectedDate || !selectedTime) {
      return <EmptyState message="Please select a date and time first" />;
    }
    if (loadingSlots) return <MentorSkeleton />;
    if (slotsError) return <ErrorState onRetry={onRetry} />;
    if (mentorsForTime.length === 0) return <EmptyState message="No mentors available for this time slot" />;

    return (
      <AnimatePresence mode="wait">
        <motion.div key={selectedTime} className="space-y-4 max-h-145 overflow-y-auto pr-1" variants={stagger} initial="hidden" animate="visible">
          {mentorsForTime.map((slot) => (
            <motion.div key={slot.id} variants={fadeIn}>
              <MentorCard slot={slot} isSelected={selectedMentor?.id === slot.id} onSelect={onMentorChange} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
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
              <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} disabled={disablePastDates} className="rounded-xl w-100" />
            </div>
          </motion.div>

          {/* Time slots */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Clock className="size-5 text-primary" />
                Select Time
              </h3>
              {displayTimezone && <TimezoneBadge timezone={displayTimezone} />}
            </div>
            {renderTimeSection()}
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
          {renderMentorSection()}
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
