"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import SocialButtons from "@/components/auth/SocialButtons";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLogin } from "@/hooks/useLogin";

// ─── Validation Schema ───
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const hasHandled = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: (data) => {
      const token = data?.token || data?.access_token;
      const role = data?.user?.role;

      const callbackUrl = new URLSearchParams(window.location.search).get(
        "callbackUrl",
      );

      const getRedirectUrl = (callbackUrl, role) => {
        if (typeof callbackUrl === "string" && callbackUrl.startsWith("/")) {
          return callbackUrl;
        }
        return role === "mentor" ? "/mentor/dashboard" : "/dashboard";
      };

      const redirectTo = getRedirectUrl(callbackUrl, role);
      login(token);
      setTimeout(() => router.push(redirectTo), 0);
    },
    onError: (message) => {
      setApiError(message);
    },
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (values) => {
    setApiError(null);
    loginMutate({
      email: values.email,
      password: values.password,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    // Only run if auth params exist
    if (hash.includes("access_token") || hash.includes("refresh_token")) {
      // ✅ Remove hash WITHOUT re-render issues
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <AuthCard>
      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to continue your growth journey"
      />

      {/* ── Form ── */}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="space-y-5"
      >
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  {...field}
                  type="email"
                  id="login-email"
                  placeholder="your@email.com"
                  className="pl-10"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                />
              </div>
              {fieldState.invalid && (
                <FieldFeedback
                  variant="error"
                  message={fieldState.error?.message}
                />
              )}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  {...field}
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  aria-invalid={fieldState.invalid}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldState.invalid && (
                <FieldFeedback
                  variant="error"
                  message={fieldState.error?.message}
                />
              )}
            </Field>
          )}
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <Controller
            name="remember"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="login-remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor="login-remember"
                  className="text-sm font-normal cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
          >
            Forgot password?
          </Link>
        </div>

        {/* ── API Feedback ── */}
        {apiError && <FieldFeedback variant="block-error" message={apiError} />}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          size="lg"
          disabled={isPending}
        >
          {isPending ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      {/* ── Footer ── */}
      <AuthFooterLink
        text="Don't have an account?"
        href="/signup"
        label="Sign up"
      />
      <SocialButtons />
    </AuthCard>
  );
}
