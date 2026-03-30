"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/useResetPassword";

// ─── Validation ───
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
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const ResetPassword = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [seconds, setSeconds] = useState(5);
  const pathnameRef = useRef(pathname);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword({
    onSuccess: () => setIsSuccess(true),
    onError: (message) => setApiError(message),
  });

  const form = useForm({
    resolver: zodResolver(resetSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("password");
  const confirmValue = form.watch("confirmPassword");

  const passwordChecks = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /\d/.test(passwordValue),
    special: /[@$!%*?&#]/.test(passwordValue),
  };

  const confirmTouched = form.formState.touchedFields.confirmPassword;
  const confirmError = form.formState.errors.confirmPassword;
  const passwordsMatch =
    confirmTouched && confirmValue.length > 0 && passwordValue === confirmValue;

  // ⏳ Redirect countdown
  useEffect(() => {
    if (!isSuccess) return;
    if (seconds === 0) {
      router.replace("/login?reset=true");
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, isSuccess, router]);

  // 🔑 Extract token from URL hash
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    if (accessToken) {
      setToken(accessToken);
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        setEmail(payload.email);
      } catch {
        setEmail(null);
      }
      router.replace(pathnameRef.current);
    }
    setIsChecking(false);
  }, [router]);

  const onSubmit = (values) => {
    setApiError(null);
    resetPassword({ email, new_password: values.password, token });
  };

  if (isChecking) return null;

  // ── Invalid / expired link ──
  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Invalid or expired reset link.
            </p>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-10">
      <Card className="w-full max-w-md shadow-xl shadow-gray-200/60">
        {!isSuccess ? (
          <>
            {/* ── Header ── */}
            <CardHeader className="flex flex-col items-center gap-3 text-center pb-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Create a new password</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter a new password to secure your account.
                </p>
              </div>
            </CardHeader>

            {/* ── Form ── */}
            <CardContent className="pt-6">
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
                    {/* ── New Password ── */}
                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="reset-password">
                            New Password
                          </FieldLabel>
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
                                // Delay so eye-toggle click doesn't instantly collapse hints
                                setTimeout(
                                  () => setShowPasswordHints(false),
                                  150,
                                );
                              }}
                            />
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()} // ← prevents Input blur on toggle click
                              onClick={() => setShowPassword((p) => !p)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                              tabIndex={-1}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <FieldFeedback
                            variant="error"
                            message={fieldState.error?.message}
                          />

                          {/* ── Password hints — only visible when field is focused ── */}
                          {showPasswordHints && (
                            <div className="mt-2 space-y-1">
                              <FieldFeedback variant={passwordChecks.length ? "success" : "error"} message="At least 8 characters"/>
                              <FieldFeedback variant={passwordChecks.lowercase ? "success" : "error"} message="1 lowercase letter"/>
                              <FieldFeedback variant={passwordChecks.uppercase ? "success" : "error"} message="1 uppercase letter"/>
                              <FieldFeedback variant={passwordChecks.number ? "success" : "error"} message="1 number"/>
                              <FieldFeedback variant={passwordChecks.special ? "success" : "error"}message="1 special character"/>
                            </div>
                          )}
                        </Field>
                      )}
                    />

                    {/* ── Confirm Password ── */}
                    <Controller
                      name="confirmPassword"
                      control={form.control}
                      render={({ field, fieldState }) => {
                        const showError =
                          fieldState.invalid ||
                          (confirmTouched && confirmError);
                        const showSuccess = passwordsMatch && !showError;

                        return (
                          <Field data-invalid={showError}>
                            <FieldLabel htmlFor="reset-confirm">
                              Confirm Password
                            </FieldLabel>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                {...field}
                                id="reset-confirm"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                className={`pl-10 pr-9 ${
                                  showSuccess
                                    ? "border-emerald-500 focus-visible:ring-emerald-500/30"
                                    : ""
                                }`}
                                aria-invalid={showError}
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirm((p) => !p)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                tabIndex={-1}
                                aria-label={
                                  showConfirm
                                    ? "Hide confirm password"
                                    : "Show confirm password"
                                }
                              >
                                {showConfirm ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            {showError && (
                              <FieldFeedback
                                variant="error"
                                message={
                                  fieldState.error?.message ??
                                  confirmError?.message ??
                                  "Passwords do not match"
                                }
                              />
                            )}
                            {showSuccess && (
                              <FieldFeedback
                                variant="success"
                                message="Passwords match"
                              />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </FieldGroup>
                </FieldSet>

                {apiError && (
                  <FieldFeedback variant="block-error" message={apiError} />
                )}

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? "Resetting..." : "Reset Password"}
                </Button>
              </form>

              <Link
                href="/login"
                className="mt-5 block text-center text-sm text-muted-foreground hover:underline"
              >
                Cancel and return to Login
              </Link>
            </CardContent>
          </>
        ) : (
          <>
            {/* ── Success Header ── */}
            <CardHeader className="flex flex-col items-center gap-3 text-center pb-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white">
                <CircleCheckBig className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Password Reset Successful!
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your password has been updated. You can now log in using your
                  new password.
                </p>
              </div>
            </CardHeader>

            {/* ── Success Body ── */}
            <CardContent className="pt-6 space-y-4">
              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Redirecting to login in
                </p>
                <p className="text-2xl font-bold text-primary">
                  {seconds} seconds
                </p>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/login">Go to Login Now</Link>
              </Button>

              <FieldFeedback
                variant="block-success"
                message="Keep your password secure and don't share it with anyone."
              />
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
