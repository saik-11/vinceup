"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
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
  const pathnameRef = useRef(pathname);
  const [isSuccess, setIsSuccess] = useState(false);
  const [seconds, setSeconds] = useState(5);

  const { mutate: resetPassword, isPending } = useResetPassword({
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (message) => {
      setApiError(message);
    },
  });

  const form = useForm({
    resolver: zodResolver(resetSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  const passwordChecks = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /\d/.test(passwordValue),
    special: /[@$!%*?&#]/.test(passwordValue),
  };

  // ⏳ Redirect countdown
  useEffect(() => {
    if (!isSuccess) return;

    if (seconds === 0) {
      router.replace("/login?reset=true");
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, isSuccess, router]);

  const onSubmit = (values) => {
    setApiError(null);

    resetPassword({
      email,
      new_password: values.password,
      token,
    });
  };

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
    }

    setIsChecking(false);

    if (accessToken) {
      router.replace(pathnameRef.current); // ✅ stable ref, no dep needed
    }
  }, [router]);

  if (isChecking) return null;
  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-6 shadow-md text-center max-w-sm">
          <p className="text-sm text-muted-foreground mb-3">
            Invalid or expired reset link.
          </p>
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/60">
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">Create a new password</h1>
              <p className="text-sm text-muted-foreground">
                Enter a new password to secure your account.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }}
              className="space-y-6"
            >
              <FieldSet>
                <FieldGroup>
                  {/* Password */}
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>New Password</FieldLabel>

                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="pl-10 pr-9"
                            aria-invalid={false}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>

                        <div className="mt-2 space-y-1">
                          <FieldFeedback
                            variant={passwordChecks.length ? "success" : "hint"}
                            message="At least 8 characters"
                          />
                          <FieldFeedback
                            variant={
                              passwordChecks.lowercase ? "success" : "hint"
                            }
                            message="1 lowercase letter"
                          />
                          <FieldFeedback
                            variant={
                              passwordChecks.uppercase ? "success" : "hint"
                            }
                            message="1 uppercase letter"
                          />
                          <FieldFeedback
                            variant={passwordChecks.number ? "success" : "hint"}
                            message="1 number"
                          />
                          <FieldFeedback
                            variant={
                              passwordChecks.special ? "success" : "hint"
                            }
                            message="1 special character"
                          />
                        </div>
                      </Field>
                    )}
                  />

                  {/* Confirm */}
                  <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => {
                      const hasValue = field.value?.length > 0;
                      const match = passwordValue === field.value;

                      return (
                        <Field data-invalid={hasValue && !match}>
                          <FieldLabel>Confirm Password</FieldLabel>

                          <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              id="confirmPassword"
                              type={showConfirm ? "text" : "password"}
                              placeholder="Confirm new password"
                              className="pl-10 pr-9"
                              aria-invalid={hasValue && !match}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirm((p) => !p)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2"
                            >
                              {showConfirm ? <EyeOff /> : <Eye />}
                            </button>
                          </div>

                          {hasValue && !match && (
                            <FieldFeedback
                              variant="error"
                              message="Passwords do not match"
                            />
                          )}
                          {hasValue && match && (
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

              <Button className="w-full" disabled={isPending}>
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <Link
              href="/login"
              className="mt-5 block text-center text-sm text-muted-foreground"
            >
              Cancel and return to Login
            </Link>
          </>
        ) : (
          <>
            {/* Success UI */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white">
                <CircleCheckBig />
              </div>

              <h1 className="text-2xl font-bold">Password Reset Successful!</h1>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully updated.
              </p>
              <p className="text-sm text-muted-foreground">
                You can now log in using your new password.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-purple-50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Redirecting to login in
              </p>
              <p className="text-2xl font-bold text-primary">
                {seconds} seconds
              </p>
            </div>

            <Button asChild className="mt-4 w-full">
              <Link href="/login">Go to Login Now</Link>
            </Button>

            <div className="mt-4">
              <FieldFeedback
                variant="block-success"
                message="Keep your password secure and don't share it with anyone."
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
