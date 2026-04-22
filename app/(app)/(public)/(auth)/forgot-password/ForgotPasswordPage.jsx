"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader, { GradientIcon } from "@/components/auth/AuthHeader";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/useForgotPassword";

// ─── Validation ───
const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const ForgotPage = () => {
  const router = useRouter();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const [apiError, setApiError] = useState(null);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm({
    resolver: zodResolver(forgotSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  // ⏳ Countdown + Redirect
  useEffect(() => {
    if (!isSubmitted) return;
    if (seconds === 0) {
      router.replace("/login");
      return;
    }
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, isSubmitted, router]);

  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: () => setIsSubmitted(true),
    onError: (message) => setApiError(message),
  });

  const onSubmit = (values) => {
    setApiError(null);
    setSubmittedEmail(values.email);
    forgotPassword({ email: values.email });
  };

  const handleResend = async () => {
    setSeconds(10);
    // TODO: resend API
  };

  return (
    <AuthCard>
      {!isSubmitted ? (
        <>
          <AuthHeader
            icon={
              <GradientIcon>
                <Mail className="h-6 w-6" />
              </GradientIcon>
            }
            title="Reset your password"
            subtitle="Enter your registered email address and we'll send you a link to reset your password."
          />

          {/* ── Form ── */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
            className="space-y-6"
          >
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email Address</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...field} type="email" suppressHydrationWarning placeholder="your@email.com" className="pl-10" aria-invalid={fieldState.invalid} />
                      </div>
                      <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            {apiError && (
              <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {apiError}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          {/* ── Back ── */}
          <Link href="/login" className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </>
      ) : (
        <>
          {/* ── Success State ── */}
          <AuthHeader
            icon={
              <GradientIcon>
                <MailCheck className="h-6 w-6" />
              </GradientIcon>
            }
            title="Check your email"
            subtitle="We've sent a password reset link to your email."
          />

          <p className="-mt-5 mb-6 text-center font-medium text-primary">{submittedEmail}</p>
          <p className="mb-6 text-center text-sm text-muted-foreground">Please check your inbox and follow the instructions.</p>

          {/* ── Countdown ── */}
          <div className="mb-5 rounded-xl bg-purple-50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Redirecting to login in</p>
            <p className="text-2xl font-bold text-primary">{seconds} seconds</p>
          </div>

          {/* ── Actions ── */}
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={handleResend}>
              Resend Email
            </Button>
          </div>

          {/* ── Help Text ── */}
          <div className="mt-4 rounded-lg bg-gray-100 p-3 text-center text-sm text-muted-foreground">{`Didn't`} receive the email? Check your spam folder or try resending.</div>
        </>
      )}
    </AuthCard>
  );
};

export default ForgotPage;
