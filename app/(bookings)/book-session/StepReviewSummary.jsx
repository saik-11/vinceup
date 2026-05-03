"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, CheckCircle2, Clock, DollarSign, FileText, Lock, Tag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PLATFORM_FEE_PER_MIN, TAX_RATE } from "./booking-config";

const WHATS_NEXT = [
  "You'll receive a confirmation email with session details",
  "VEGA will prepare personalized session insights for you",
  "You'll get a reminder 24 hours before your session",
  "Meeting link will be shared 15 minutes before start time",
];

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const getSlotTime = (slot) => slot?.local_time?.start_time ?? slot?.start_time ?? "";
const getMentorName = (mentor) => mentor?.name ?? mentor?.full_name ?? "";
const getMentorRole = (mentor) => mentor?.title ?? mentor?.role ?? mentor?.headline ?? mentor?.company_name ?? "";
const getMentorImage = (mentor) => mentor?.avatar ?? mentor?.avatar_url ?? mentor?.profile_image_url ?? mentor?.image_url ?? "";
const getMentorBio = (mentor) => mentor?.bio ?? mentor?.description ?? mentor?.summary ?? mentor?.about ?? "";

const initialsFor = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function IconTile({ children, tone = "purple" }) {
  const tones = {
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300",
  };

  return <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{children}</div>;
}

function TagList({ tags }) {
  if (!tags.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} className="h-6 rounded bg-purple-50 px-2 text-xs font-medium text-purple-700 hover:bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function EmptyReview({ onBack }) {
  return (
    <section className="mx-auto max-w-[1280px]">
      <Card className="rounded-2xl border border-gray-200 bg-white py-0 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
          <FileText className="size-12 text-gray-300 dark:text-gray-700" />
          <h1 className="mt-4 text-2xl font-bold text-gray-950 dark:text-gray-50">Booking details unavailable</h1>
          <p className="mt-2 text-sm text-gray-500">Select a service, date, time, and mentor before reviewing your booking.</p>
          <Button className="mt-6" onClick={onBack}>
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default function StepReviewSummary({ selectedService, selectedDate, selectedTime, selectedMentor, onBack, onBookSession, isSubmitting }) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");

  const mentor = selectedMentor?.mentor;
  const servicePrice = Number(selectedService?.price);
  const duration = Number(selectedService?.duration);

  const apiCoupon = selectedService?.coupon ?? selectedService?.applied_coupon ?? null;
  const couponPercent = Number(apiCoupon?.discount_percent ?? apiCoupon?.percent_off ?? 0);
  const activeCouponCode = apiCoupon?.code ?? appliedCouponCode;

  const totals = useMemo(() => {
    const sessionCost = Number.isFinite(servicePrice) ? servicePrice : 0;
    const platformFee = Number.isFinite(duration) ? PLATFORM_FEE_PER_MIN * duration : 0;
    const tax = +((sessionCost + platformFee) * TAX_RATE).toFixed(2);
    const subtotal = +(sessionCost + platformFee + tax).toFixed(2);
    const discount = activeCouponCode && couponPercent > 0 ? +(subtotal * (couponPercent / 100)).toFixed(2) : 0;
    const total = +(subtotal - discount).toFixed(2);

    return { sessionCost, platformFee, tax, subtotal, discount, total };
  }, [activeCouponCode, couponPercent, duration, servicePrice]);

  if (!selectedService || !selectedDate || !selectedTime || !selectedMentor) {
    return <EmptyReview onBack={onBack} />;
  }

  const mentorName = getMentorName(mentor);
  const mentorRole = getMentorRole(mentor);
  const mentorImage = getMentorImage(mentor);
  const mentorBio = getMentorBio(mentor);
  const tags = [selectedMentor.service_type, ...(mentor?.tags ?? mentor?.skills ?? mentor?.expertise ?? [])].filter(Boolean);
  const displayTime = getSlotTime(selectedMentor) || selectedTime;
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const applyCoupon = () => {
    const trimmed = couponCode.trim();
    if (trimmed) {
      setAppliedCouponCode(trimmed);
      setCouponCode("");
    }
  };

  const clearCoupon = () => {
    setAppliedCouponCode("");
    setCouponCode("");
  };

  return (
    <section className="mx-auto max-w-[1280px]">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950 dark:text-gray-50 md:text-[40px]">Review Your Booking</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Please review all details before checkout</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_346px]">
        <div className="space-y-6">
          <Card className="rounded-2xl border border-gray-200 bg-white py-0 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-950 dark:text-gray-50">
                    <FileText className="size-5 text-primary" />
                    Service Details
                  </h2>
                  <p className="mt-5 text-sm text-gray-600 dark:text-gray-400">Service Type</p>
                  <p className="mt-2 text-lg font-bold text-gray-950 dark:text-gray-50">{selectedService.title}</p>
                </div>
                <p className="mt-11 shrink-0 text-3xl font-bold text-primary">{formatMoney(totals.sessionCost)}</p>
              </div>

              <Separator className="my-5 bg-gray-200 dark:bg-gray-800" />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <IconTile>
                    <Clock className="size-5" />
                  </IconTile>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="font-bold text-gray-950 dark:text-gray-50">{duration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IconTile tone="indigo">
                    <CalendarDays className="size-5" />
                  </IconTile>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date & Time</p>
                    <p className="font-bold text-gray-950 dark:text-gray-50">
                      {formattedDate} at {displayTime}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-200 bg-white py-0 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-950 dark:text-gray-50">
                <User className="size-5 text-primary" />
                Your Mentor
              </h2>
              <div className="mt-5 flex items-start gap-4">
                <Avatar className="size-20 rounded-xl">
                  {mentorImage ? <AvatarImage className="rounded-xl" src={mentorImage} alt="" /> : null}
                  <AvatarFallback className="rounded-xl bg-gray-100 font-bold text-primary dark:bg-gray-800">{initialsFor(mentorName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold leading-tight text-gray-950 dark:text-gray-50">{mentorName || "Mentor details unavailable"}</h3>
                  {mentorRole && <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{mentorRole}</p>}
                  {mentorBio && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{mentorBio}</p>}
                  <TagList tags={tags} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-purple-100 bg-purple-50/50 py-0 shadow-none dark:border-purple-900/50 dark:bg-purple-950/20">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-3 text-xl font-bold text-gray-950 dark:text-gray-50">
                <CheckCircle2 className="size-5 text-emerald-500" />
                What happens next?
              </h2>
              <ul className="mt-4 space-y-3">
                {WHATS_NEXT.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit rounded-2xl border border-gray-200 bg-white py-0 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-8">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-950 dark:text-gray-50">
              <DollarSign className="size-5 text-primary" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div>
              <div className="flex justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-gray-950 dark:text-gray-50">Session Cost</p>
                  <p className="mt-1 text-xs text-gray-500">{duration} minutes</p>
                </div>
                <p className="font-bold text-gray-950 dark:text-gray-50">{formatMoney(totals.sessionCost)}</p>
              </div>
              <Separator />
              <div className="flex justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-gray-950 dark:text-gray-50">Platform Fee</p>
                  <p className="mt-1 text-xs text-gray-500">${PLATFORM_FEE_PER_MIN.toFixed(2)}/min x {duration} min</p>
                </div>
                <p className="font-bold text-gray-950 dark:text-gray-50">{formatMoney(totals.platformFee)}</p>
              </div>
              <Separator />
              <div className="flex justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-gray-950 dark:text-gray-50">Tax</p>
                  <p className="mt-1 text-xs text-gray-500">{(TAX_RATE * 100).toFixed(0)}% sales tax</p>
                </div>
                <p className="font-bold text-gray-950 dark:text-gray-50">{formatMoney(totals.tax)}</p>
              </div>
              <Separator />
              <div className="flex justify-between gap-4 py-4">
                <p className="font-bold text-gray-950 dark:text-gray-50">Subtotal</p>
                <p className="font-bold text-gray-950 dark:text-gray-50">{formatMoney(totals.subtotal)}</p>
              </div>
            </div>

            <div className="py-2">
              <p className="flex items-center gap-2 font-medium text-gray-950 dark:text-gray-50">
                <Tag className="size-4 text-primary" />
                Have a coupon?
              </p>
              {activeCouponCode ? (
                <div className="mt-4 flex h-9 items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <span className="flex min-w-0 items-center gap-2">
                    <Tag className="size-4 shrink-0" />
                    <span className="truncate">{activeCouponCode}{couponPercent > 0 ? ` - ${couponPercent}% OFF` : ""}</span>
                  </span>
                  {!apiCoupon && (
                    <button type="button" aria-label="Remove coupon" onClick={clearCoupon}>
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <Input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" className="h-10 rounded-lg border-gray-200 bg-white text-base dark:border-gray-800 dark:bg-gray-950" />
                  <Button type="button" onClick={applyCoupon} disabled={!couponCode.trim()} className="h-10 rounded-lg px-5 font-bold">
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {totals.discount > 0 && (
              <>
                <div className="flex justify-between py-3 font-medium text-emerald-600 dark:text-emerald-300">
                  <span>Discount ({couponPercent}%)</span>
                  <span>-{formatMoney(totals.discount)}</span>
                </div>
                <Separator />
              </>
            )}

            <div className="py-5">
              {totals.discount > 0 && <p className="mb-1 text-right text-sm text-gray-500 line-through">{formatMoney(totals.subtotal)}</p>}
              <div className="flex items-end justify-between gap-4">
                <p className="text-2xl font-bold text-gray-950 dark:text-gray-50">Total Amount</p>
                <p className="text-right text-4xl font-bold leading-none text-primary">{formatMoney(totals.total)}</p>
              </div>
            </div>

            {totals.discount > 0 && <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">You saved {formatMoney(totals.discount)}!</div>}

            <Button size="lg" className="h-14 w-full rounded-xl bg-primary text-base font-bold text-white hover:bg-primary/90" onClick={onBookSession} disabled={isSubmitting}>
              <Lock className="size-5" />
              {isSubmitting ? "Processing..." : "Proceed to Checkout"}
            </Button>
            <p className="mt-4 text-center text-xs text-gray-500">Secure payment powered by Stripe</p>
            <Button variant="outline" size="lg" className="mt-4 h-13 w-full rounded-xl border-2 border-gray-300 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" onClick={onBack} disabled={isSubmitting}>
              Back to Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
