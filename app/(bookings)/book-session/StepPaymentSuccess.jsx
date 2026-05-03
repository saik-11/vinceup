"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Check, CheckCircle2, DollarSign, FileText, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const WHATS_NEXT = [
  "A confirmation email has been sent to your inbox",
  "VEGA will prepare personalized insights for your session",
  "You'll receive a reminder 24 hours before your session",
];

const formatMoney = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? `$${number.toFixed(2)}` : "Unavailable";
};

const getMentorName = (mentor) => mentor?.name ?? mentor?.full_name ?? "";
const getPaymentAmount = (bookingResult, selectedService) =>
  bookingResult?.payment?.amount ??
  bookingResult?.payment?.total_paid ??
  bookingResult?.booking?.total_paid ??
  bookingResult?.booking?.amount_paid ??
  bookingResult?.booking?.amount ??
  selectedService?.total ??
  selectedService?.price;

function IconTile({ children, className }) {
  return <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-white ${className}`}>{children}</div>;
}

export default function StepPaymentSuccess({ bookingResult, selectedService, selectedMentor }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    if (seconds === 0) {
      router.push("/dashboard");
      return;
    }

    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  const booking = bookingResult?.booking ?? {};
  const slot = bookingResult?.slot ?? selectedMentor ?? {};
  const mentorName = getMentorName(selectedMentor?.mentor);
  const serviceName = selectedService?.title ?? selectedService?.name;
  const transactionId = bookingResult?.payment?.transaction_id ?? bookingResult?.payment?.id ?? booking.transaction_id ?? booking.id;
  const dateLabel = slot.date
    ? new Date(`${slot.date}T00:00:00`).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const timeLabel = slot.local_time?.start_time ?? slot.start_time ?? "";
  const dateTime = dateLabel && timeLabel ? `${dateLabel} at ${timeLabel}` : dateLabel || timeLabel || "Unavailable";

  const details = [
    {
      icon: FileText,
      label: "Service Type",
      value: serviceName ?? "Unavailable",
      sub: mentorName ? `with ${mentorName}` : null,
      tile: "bg-primary",
    },
    {
      icon: CalendarDays,
      label: "Session Date & Time",
      value: dateTime,
      sub: null,
      tile: "bg-fuchsia-600",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: formatMoney(getPaymentAmount(bookingResult, selectedService)),
      sub: null,
      tile: "bg-emerald-600",
      valueClass: "text-2xl text-emerald-600 dark:text-emerald-300",
    },
    {
      icon: Hash,
      label: "Transaction ID",
      value: transactionId ? String(transactionId).toUpperCase() : "Unavailable",
      sub: null,
      tile: "bg-amber-500",
    },
  ];

  return (
    <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[672px] flex-col items-center px-4 pb-10 pt-3 text-center">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-linear-to-br from-white via-purple-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-indigo-950/20" />

      <div className="flex size-24 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
        <CheckCircle2 className="size-14" />
      </div>

      <h1 className="mt-7 text-4xl font-bold tracking-tight text-gray-950 dark:text-gray-50">Payment Successful!</h1>
      <p className="mt-5 text-xl text-gray-600 dark:text-gray-300">Your session has been booked successfully</p>

      <Card className="mt-10 w-full rounded-2xl border border-gray-200 bg-white py-0 text-left shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-950 dark:text-gray-50">Booking Details</h2>
          <div className="mt-7">
            {details.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                    <IconTile className={item.tile}>
                      <Icon className="size-5" />
                    </IconTile>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                      <p className={`mt-1 font-bold text-gray-950 dark:text-gray-50 ${item.valueClass ?? ""}`}>{item.value}</p>
                      {item.sub && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.sub}</p>}
                    </div>
                  </div>
                  {index < details.length - 1 && <Separator className="bg-gray-100 dark:bg-gray-800" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 w-full rounded-2xl border border-purple-100 bg-purple-50/50 py-0 text-left shadow-none dark:border-purple-900/50 dark:bg-purple-950/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50">What&apos;s Next?</h2>
          <ul className="mt-4 space-y-3">
            {WHATS_NEXT.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Check className="mt-0.5 size-4 shrink-0 rounded-full border border-emerald-500 p-0.5 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 grid w-full gap-4 sm:grid-cols-2">
        <Button asChild size="lg" className="h-14 rounded-xl bg-primary text-base font-bold text-white hover:bg-primary/90">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="size-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-14 rounded-xl border-2 border-gray-200 bg-white text-base font-bold text-gray-950 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50">
          <Link href="/my-sessions">View My Sessions</Link>
        </Button>
      </div>

      <p className="mt-7 text-sm text-gray-500">Redirecting to dashboard in {seconds} seconds...</p>
    </section>
  );
}
