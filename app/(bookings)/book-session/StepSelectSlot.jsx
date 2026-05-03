"use client";

import { useMemo } from "react";
import { AlertCircle, ArrowRight, Check, ChevronRight, Clock, RotateCcw, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const getSlotTime = (slot) => slot?.local_time?.start_time ?? slot?.start_time ?? "";
const getSlotEndTime = (slot) => slot?.local_time?.end_time ?? slot?.end_time ?? "";
const getMentorName = (mentor) => mentor?.name ?? mentor?.full_name ?? "";
const getMentorRole = (mentor) => mentor?.title ?? mentor?.role ?? mentor?.headline ?? mentor?.company_name ?? "";
const getMentorImage = (mentor) => mentor?.avatar ?? mentor?.avatar_url ?? mentor?.profile_image_url ?? mentor?.image_url ?? "";
const getMentorRating = (mentor) => mentor?.rating ?? mentor?.average_rating;
const getMentorSessions = (mentor) => mentor?.sessions ?? mentor?.session_count ?? mentor?.completed_sessions;
const getMentorReviews = (mentor) => mentor?.reviews ?? mentor?.review_count;

const initialsFor = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatSelectedDate = (date) =>
  date?.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

function StepNumber({ value, active }) {
  return (
    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${active ? "bg-primary text-white" : "bg-gray-200 text-gray-500 dark:bg-gray-800"}`}>
      {value}
    </span>
  );
}

function SectionTitle({ number, title, active }) {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
      <CardTitle className="flex min-w-0 items-center gap-3 text-2xl font-bold leading-none text-gray-950 dark:text-gray-50">
        <StepNumber value={number} active={active} />
        <span className="truncate">{title}</span>
      </CardTitle>
      <ChevronRight className="size-5 shrink-0 text-gray-400" aria-hidden="true" />
    </CardHeader>
  );
}

function SubstepPill({ hasDate, hasTime, hasMentor }) {
  const steps = [
    { label: "Date", done: hasDate, active: !hasDate },
    { label: "Time", done: hasTime, active: hasDate && !hasTime },
    { label: "Mentor", done: hasMentor, active: hasTime && !hasMentor },
  ];

  return (
    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-5 py-2 text-sm dark:border-purple-900/60 dark:bg-purple-950/30">
      {steps.map((step, index) => (
        <span key={step.label} className="inline-flex items-center gap-2">
          <span className={step.done ? "font-medium text-emerald-600" : step.active ? "font-medium text-primary" : "text-gray-400"}>
            {step.done ? <Check className="mr-1 inline size-3.5" /> : `${index + 1} `}
            {step.label}
          </span>
          {index < steps.length - 1 && <ChevronRight className="size-3.5 text-gray-400" />}
        </span>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center text-center">
      <Icon className="size-12 text-gray-300 dark:text-gray-700" />
      <p className="mt-4 text-base font-medium text-gray-600 dark:text-gray-300">{title}</p>
      {description && <p className="mt-2 text-xs text-gray-400">{description}</p>}
      {children}
    </div>
  );
}

function ErrorState({ label, onRetry }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
      <AlertCircle className="size-9 text-red-400" />
      <p className="text-sm text-gray-500">{label}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RotateCcw className="size-4" />
        Retry
      </Button>
    </div>
  );
}

function CalendarCard({ selectedDate, onDateChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white py-0 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <SectionTitle number={1} title="Select Date" active />
      <CardContent className="p-6 pt-0">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            defaultMonth={selectedDate ?? new Date()}
            disabled={(date) => date < today}
            className="mx-auto w-full max-w-117 p-0 [--cell-radius:10px] [--cell-size:3.2rem] sm:[--cell-size:3.65rem]"
            classNames={{
              month_caption: "flex h-10 w-full items-center justify-center px-10",
              caption_label: "text-base font-bold text-gray-950 dark:text-gray-50",
              button_previous: "size-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
              button_next: "size-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
              weekday: "flex-1 text-sm font-medium text-gray-600 dark:text-gray-300",
              week: "mt-3 flex w-full",
              outside: "text-gray-300 opacity-60 dark:text-gray-700",
              disabled: "text-gray-300 opacity-50 dark:text-gray-700",
              day_button: "hover:border hover:border-primary data-[selected-single=true]:bg-primary data-[selected-single=true]:text-white",
            }}
          />
        </div>

        {selectedDate && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
            <Check className="size-4" />
            {formatSelectedDate(selectedDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TimeSkeletonRows() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800" />
      ))}
    </div>
  );
}

function TimeCard({ selectedDate, selectedTime, times, onTimeChange, loadingSlots, slotsError, onRetry }) {
  let content;

  if (!selectedDate) {
    content = (
      <div>
        <EmptyState icon={Clock} title="Select a date to view available time slots" description="Choose a date from the calendar above" />
        <TimeSkeletonRows />
      </div>
    );
  } else if (loadingSlots) {
    content = <TimeSkeletonRows />;
  } else if (slotsError) {
    content = <ErrorState label="Failed to load available slots" onRetry={onRetry} />;
  } else if (times.length === 0) {
    content = <EmptyState icon={Clock} title="No time slots available for this date" />;
  } else {
    content = (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {times.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => onTimeChange(time)}
            className={`h-12 rounded-lg border px-4 text-base font-medium ${
              selectedTime === time ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-gray-950 hover:border-primary dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white py-0 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <SectionTitle number={2} title="Choose Time" active={Boolean(selectedDate)} />
      <CardContent className="p-6 pt-0">{content}</CardContent>
    </Card>
  );
}

function MentorSkeletonRows() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <Skeleton className="size-16 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MentorCard({ slot, selected, onSelect }) {
  const mentor = slot.mentor ?? {};
  const name = getMentorName(mentor);
  const role = getMentorRole(mentor);
  const image = getMentorImage(mentor);
  const rating = getMentorRating(mentor);
  const reviews = getMentorReviews(mentor);
  const sessions = getMentorSessions(mentor);
  const tags = [slot.service_type, ...(mentor.tags ?? mentor.skills ?? mentor.expertise ?? [])].filter(Boolean);

  return (
    <button
      type="button"
      onClick={() => onSelect(slot)}
      className={`relative w-full rounded-xl border p-4 text-left ${
        selected ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-200 bg-white hover:border-primary/60 dark:border-gray-800 dark:bg-gray-950"
      }`}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border-2 border-primary text-primary">
          <Check className="size-3" />
        </span>
      )}
      <div className="flex items-start gap-4">
        <Avatar className="size-16 rounded-xl">
          {image ? <AvatarImage className="rounded-xl" src={image} alt="" /> : null}
          <AvatarFallback className="rounded-xl bg-gray-100 font-bold text-primary dark:bg-gray-800">{initialsFor(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 pr-6">
          <h4 className="truncate text-lg font-bold leading-tight text-gray-950 dark:text-gray-50">{name || "Mentor details unavailable"}</h4>
          {role && <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-300">{role}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {rating ? (
              <span className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {rating}
              </span>
            ) : null}
            {reviews ? <span>({reviews})</span> : null}
            {sessions ? <span>{sessions} sessions</span> : null}
            {getSlotEndTime(slot) ? (
              <span>
                {getSlotTime(slot)} - {getSlotEndTime(slot)}
              </span>
            ) : null}
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag) => (
                <Badge key={tag} className="h-6 rounded bg-purple-50 px-2 text-xs font-medium text-purple-700 hover:bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function MentorPanel({ selectedDate, selectedTime, mentors, selectedMentor, onMentorChange, loadingSlots, slotsError, onRetry }) {
  const showPlaceholder = !selectedDate || !selectedTime;

  let content;
  if (showPlaceholder) {
    content = (
      <div>
        <EmptyState icon={Users} title="Choose a time slot to view available mentors" description="Select your preferred time from the options above" />
        <MentorSkeletonRows />
      </div>
    );
  } else if (loadingSlots) {
    content = <MentorSkeletonRows />;
  } else if (slotsError) {
    content = <ErrorState label="Failed to load available mentors" onRetry={onRetry} />;
  } else if (mentors.length === 0) {
    content = <EmptyState icon={Users} title="No mentors available for this time slot" />;
  } else {
    content = (
      <div className="max-h-185 space-y-4 overflow-y-auto pr-1">
        {mentors.map((slot) => (
          <MentorCard key={slot.id ?? `${getSlotTime(slot)}-${slot.mentor?.id ?? slot.mentor?.name}`} slot={slot} selected={selectedMentor?.id === slot.id} onSelect={onMentorChange} />
        ))}
      </div>
    );
  }

  return (
    <Card className="min-h-150 rounded-2xl border border-gray-200 bg-white py-0 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="flex-row items-center justify-between p-6 pb-4">
        <CardTitle className="flex min-w-0 items-center gap-3 text-2xl font-bold leading-none text-gray-950 dark:text-gray-50">
          <StepNumber value={3} active={Boolean(selectedTime)} />
          <span className="truncate">Pick Your Mentor</span>
        </CardTitle>
        {!showPlaceholder && !loadingSlots && !slotsError && (
          <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300">
            {mentors.length} available
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-0">{content}</CardContent>
    </Card>
  );
}

export default function StepSelectSlot({
  selectedService,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  selectedMentor,
  onMentorChange,
  availableSlots = [],
  loadingSlots,
  slotsError,
  onRetry,
  onBack,
  onNext,
}) {
  const times = useMemo(() => {
    if (!selectedDate) return [];
    return [...new Set(availableSlots.map(getSlotTime).filter(Boolean))].sort();
  }, [availableSlots, selectedDate]);

  const mentorsForTime = useMemo(() => {
    if (!selectedTime) return [];
    return availableSlots.filter((slot) => getSlotTime(slot) === selectedTime);
  }, [availableSlots, selectedTime]);

  const isComplete = Boolean(selectedDate && selectedTime && selectedMentor);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950 dark:text-gray-50 md:text-[42px]">Select Date, Time & Mentor</h1>
        {selectedService?.title ? (
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Booking: <span className="font-semibold text-primary">{selectedService.title}</span>
          </p>
        ) : null}
        <SubstepPill hasDate={Boolean(selectedDate)} hasTime={Boolean(selectedTime)} hasMentor={Boolean(selectedMentor)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <CalendarCard selectedDate={selectedDate} onDateChange={onDateChange} />
          <TimeCard selectedDate={selectedDate} selectedTime={selectedTime} times={times} onTimeChange={onTimeChange} loadingSlots={loadingSlots} slotsError={slotsError} onRetry={onRetry} />
        </div>
        <MentorPanel
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          mentors={mentorsForTime}
          selectedMentor={selectedMentor}
          onMentorChange={onMentorChange}
          loadingSlots={loadingSlots}
          slotsError={slotsError}
          onRetry={onRetry}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="h-13 rounded-xl border-2 border-gray-300 bg-white px-5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          Back to Services
        </Button>
        <Button
          size="lg"
          disabled={!isComplete}
          onClick={onNext}
          className="h-13 rounded-xl bg-primary px-8 text-base font-bold text-white shadow-none hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100 dark:disabled:bg-gray-800"
        >
          Continue to Summary
          <ArrowRight className="size-5" />
        </Button>
      </div>
    </section>
  );
}
