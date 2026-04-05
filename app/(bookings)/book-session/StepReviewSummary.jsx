"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Lock,
  Star,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PLATFORM_FEE_PER_MIN, TAX_RATE } from "./booking-config";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: "easeOut" },
  }),
};

const WHATS_NEXT = [
  "You'll receive a confirmation email with session details",
  "VEGA will prepare personalized session insights for you",
  "You'll get a reminder 24 hours before your session",
  "Meeting link will be shared 15 minutes before start time",
];

export default function StepReviewSummary({
  selectedService,
  selectedDate,
  selectedTime,
  selectedMentor,
  onBack,
  onCheckout,
  isPending,
}) {
  const sessionCost = selectedService.price;
  const platformFee = PLATFORM_FEE_PER_MIN * selectedService.duration;
  const subtotal = sessionCost + platformFee;
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const formattedDate = selectedDate?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const initials = selectedMentor.name.split(" ").map((n) => n[0]).join("");

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Review Your Booking</h1>
        <p className="mt-2 text-muted-foreground">
          Please review all details before checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* ── Left (2 cols) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Details */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <FileText className="size-5 text-primary" />
                  Service Details
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">Service Type</p>
                <p className="text-lg font-bold">{selectedService.title}</p>
              </div>
              <span className="text-2xl font-bold text-primary">
                ${selectedService.price}
              </span>
            </div>

            <hr className="my-5 border-gray-100 dark:border-gray-800" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
                  <Clock className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">{selectedService.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
                  <CalendarDays className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">
                    {formattedDate} at {selectedTime}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Your Mentor */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
              <UserCheck className="size-5 text-primary" />
              Your Mentor
            </h3>

            <div className="flex items-start gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 text-primary font-bold text-2xl">
                {initials}
              </div>
              <div>
                <h4 className="text-lg font-bold">{selectedMentor.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedMentor.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedMentor.bio}</p>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {selectedMentor.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* What happens next */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-primary/10 dark:border-primary/20 bg-primary/[0.02] dark:bg-primary/[0.05] p-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold mb-3">
              <CheckCircle2 className="size-5 text-emerald-500" />
              What happens next?
            </h3>
            <ul className="space-y-2.5">
              {WHATS_NEXT.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Right: Payment Summary ── */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="h-fit rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 lg:sticky lg:top-28"
        >
          <h3 className="flex items-center gap-2 text-lg font-bold mb-5">
            <DollarSign className="size-5 text-primary" />
            Payment Summary
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Session Cost</p>
                <p className="text-xs text-muted-foreground">
                  {selectedService.duration} minutes
                </p>
              </div>
              <span className="font-semibold">${sessionCost.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Platform Fee</p>
                <p className="text-xs text-muted-foreground">
                  ${PLATFORM_FEE_PER_MIN}/min × {selectedService.duration} min
                </p>
              </div>
              <span className="font-semibold">${platformFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Tax</p>
                <p className="text-xs text-muted-foreground">
                  {(TAX_RATE * 100).toFixed(0)}% sales tax
                </p>
              </div>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full cursor-pointer"
            onClick={() => onCheckout(total)}
            disabled={isPending}
          >
            <Lock className="size-4" />
            {isPending ? "Processing…" : "Proceed to Checkout"}
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Secure payment powered by Stripe
          </p>

          <Button
            variant="outline"
            size="lg"
            className="mt-3 w-full cursor-pointer"
            onClick={onBack}
          >
            Back to Selection
          </Button>
        </motion.div>
      </div>
    </div>
  );
}