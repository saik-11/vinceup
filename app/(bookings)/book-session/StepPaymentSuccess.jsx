"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, DollarSign, FileText, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const WHATS_NEXT = [
  "A confirmation email has been sent to your inbox",
  "VEGA will prepare personalized insights for your session",
  "You'll receive a reminder 24 hours before your session",
];

function generateTxnId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "TXN-";
  for (let i = 0; i < 5; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default function StepPaymentSuccess({ selectedService, selectedDate, selectedTime, selectedMentor, totalPaid }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10);
  const [txnId] = useState(generateTxnId);

  useEffect(() => {
    if (seconds === 0) {
      router.push("/dashboard");
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  const formattedDate = selectedDate?.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const details = [
    {
      icon: FileText,
      label: "Service Type",
      value: selectedService.title,
      sub: `with ${selectedMentor.name}`,
      iconBg: "bg-primary/10 dark:bg-primary/20 text-primary",
    },
    {
      icon: CalendarDays,
      label: "Session Date & Time",
      value: `${formattedDate} at ${selectedTime}`,
      sub: null,
      iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: `$${totalPaid.toFixed(2)}`,
      sub: null,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Hash,
      label: "Transaction ID",
      value: txnId,
      sub: null,
      iconBg: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Gradient background glow ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-primary/[0.06] via-primary/[0.03] to-transparent dark:from-primary/[0.12] dark:via-primary/[0.04]" />
      </div>

      {/* ── Checkmark ── */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center mb-6"
      >
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="size-10" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-2 text-muted-foreground">Your session has been booked successfully</p>
      </motion.div>

      {/* ── Booking Details ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg shadow-gray-100/50 dark:shadow-gray-950/50 mb-6"
      >
        <h3 className="text-lg font-bold mb-5">Booking Details</h3>

        <div className="space-y-5">
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-4">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`font-bold ${item.valueClass || ""}`}>{item.value}</p>
                  {item.sub && <p className="text-sm text-muted-foreground">{item.sub}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── What's Next ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mb-8"
      >
        <h3 className="text-lg font-bold mb-3">{`What's Next?`}</h3>
        <ul className="space-y-2.5">
          {WHATS_NEXT.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* ── Actions ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-4">
        <Button asChild size="lg" className="flex-1 cursor-pointer">
          <Link href="/dashboard">Go to Dashboard →</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1 cursor-pointer">
          <Link href="/my-sessions">View My Sessions</Link>
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center text-sm text-muted-foreground"
      >
        Redirecting to dashboard in {seconds} seconds…
      </motion.p>
    </div>
  );
}
