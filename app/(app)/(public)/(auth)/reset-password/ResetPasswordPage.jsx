"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CircleCheckBig, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader, { GradientIcon } from "@/components/auth/AuthHeader";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/useResetPassword";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must include at least 1 lowercase letter")
      .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
      .regex(/\d/, "Must include at least 1 number")
      .regex(/[@$!%*?&#]/, "Must include at least 1 special character"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const emptyContext = { token: null, email: null, isChecking: true };

let cachedHash = null;
let cachedResult = emptyContext;

function getClientSnapshot() {
  const currentHash = window.location.hash;
  if (cachedHash !== currentHash) {
    cachedHash = currentHash;
    const params = new URLSearchParams(currentHash.slice(1));
    const accessToken = params.get("access_token");

    if (!accessToken) {
      // Only clear the token if we haven't already parsed one successfully.
      // This prevents losing the token when the URL hash is cleared.
      if (cachedResult.isChecking) {
        cachedResult = { token: null, email: null, isChecking: false };
      }
    } else {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        cachedResult = {
          token: accessToken,
          email: payload.email ?? null,
          isChecking: false,
        };
      } catch {
        cachedResult = { token: accessToken, email: null, isChecking: false };
      }
    }
  }
  return cachedResult;
}

function getServerSnapshot() {
  return emptyContext;
}

function subscribe(callback) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [seconds, setSeconds] = useState(5);
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const { token, email, isChecking } = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const { mutate: resetPassword, isPending } = useResetPassword({
    onSuccess: () => setIsSuccess(true),
    onError: (message) => setApiError(message),
  });

  const form = useForm({
    resolver: zodResolver(resetSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = useWatch({ control: form.control, name: "password" }) || "";
  const confirmValue = useWatch({ control: form.control, name: "confirmPassword" }) || "";

  const passwordChecks = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /\d/.test(passwordValue),
    special: /[@$!%*?&#]/.test(passwordValue),
  };

  const confirmTouched = form.formState.touchedFields.confirmPassword;
  const confirmError = form.formState.errors.confirmPassword;
  const passwordsMatch = confirmTouched && confirmValue.length > 0 && passwordValue === confirmValue;

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    if (seconds === 0) {
      router.replace("/login?reset=true");
      return;
    }

    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [isSuccess, router, seconds]);

  useEffect(() => {
    if (!token || typeof window === "undefined") {
      return;
    }

    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, [token]);

  const onSubmit = (values) => {
    setApiError(null);
    resetPassword({ email, new_password: values.password, token });
  };

  if (isChecking) {
    return null;
  }

  if (!token || !email) {
    return (
      <AuthCard className="border-destructive/50 dark:border-destructive/30">
        <div className="flex flex-col items-center pb-6 pt-2 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
            <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>

          <h1 className="mb-2 text-lg font-semibold tracking-tight">Reset link expired or invalid</h1>

          <p className="mb-6 max-w-70 text-sm text-muted-foreground">Password reset links are valid for 1 hour. This link may have expired, been used already, or contains an invalid token.</p>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      {!isSuccess ? (
        <>
          <AuthHeader
            icon={
              <GradientIcon>
                <LockKeyhole className="h-6 w-6" />
              </GradientIcon>
            }
            title="Create a new password"
            subtitle="Enter a new password to secure your account."
          />

          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
            className="space-y-6"
          >
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reset-password">New Password</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="reset-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="pl-10 pr-9"
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                          onFocus={() => setShowPasswordHints(true)}
                          onBlur={() => {
                            field.onBlur();
                            setTimeout(() => setShowPasswordHints(false), 150);
                          }}
                        />
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FieldFeedback variant="error" message={fieldState.error?.message} />
                      {showPasswordHints ? (
                        <div className="mt-2 space-y-1">
                          <FieldFeedback variant={passwordChecks.length ? "success" : "error"} message="At least 8 characters" />
                          <FieldFeedback variant={passwordChecks.lowercase ? "success" : "error"} message="1 lowercase letter" />
                          <FieldFeedback variant={passwordChecks.uppercase ? "success" : "error"} message="1 uppercase letter" />
                          <FieldFeedback variant={passwordChecks.number ? "success" : "error"} message="1 number" />
                          <FieldFeedback variant={passwordChecks.special ? "success" : "error"} message="1 special character" />
                        </div>
                      ) : null}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const showError = fieldState.invalid || (confirmTouched && confirmError);
                    const showSuccess = passwordsMatch && !showError;

                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="reset-confirm">Confirm Password</FieldLabel>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            {...field}
                            id="reset-confirm"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm new password"
                            className={`pl-10 pr-9 ${showSuccess ? "border-emerald-500 focus-visible:ring-emerald-500/30" : ""}`}
                            aria-invalid={showError}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm((value) => !value)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                          >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {showError ? <FieldFeedback variant="error" message={fieldState.error?.message ?? confirmError?.message ?? "Passwords do not match"} /> : null}
                        {showSuccess ? <FieldFeedback variant="success" message="Passwords match" /> : null}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </FieldSet>

            {apiError ? <FieldFeedback variant="block-error" message={apiError} /> : null}

            <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isPending}>
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <Link href="/login" className="mt-5 block text-center text-sm text-muted-foreground hover:underline">
            Cancel and return to Login
          </Link>
        </>
      ) : (
        <>
          <AuthHeader
            icon={
              <GradientIcon>
                <CircleCheckBig className="h-6 w-6" />
              </GradientIcon>
            }
            title="Password Reset Successful!"
            subtitle="Your password has been updated. You can now log in using your new password."
          />

          <div className="space-y-4">
            <div className="rounded-xl bg-purple-50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Redirecting to login in</p>
              <p className="text-2xl font-bold text-primary">{seconds} seconds</p>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link href="/login">Go to Login Now</Link>
            </Button>

            <FieldFeedback variant="block-success" message="Keep your password secure and don't share it with anyone." />
          </div>
        </>
      )}
    </AuthCard>
  );
}
