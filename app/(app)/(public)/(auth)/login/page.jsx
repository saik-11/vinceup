"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import AuthCard from "@/components/auth/AuthCard";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import AuthHeader from "@/components/auth/AuthHeader";
import FieldFeedback from "@/components/FieldFeedback";
import SocialButtons from "@/components/auth/SocialButtons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLogin } from "@/hooks/useLogin";
import { getBrowserTimezone } from "@/lib/timezone";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: (data) => {
      const role = data?.user?.role;
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");

      const redirectTo =
        typeof callbackUrl === "string" && callbackUrl.startsWith("/")
          ? callbackUrl
          : role === "mentor"
            ? "/mentor/dashboard"
            : "/dashboard";

      login(data.user);
      router.replace(redirectTo);
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
      timezone: getBrowserTimezone(),
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash;
    if (hash && (hash.includes("access_token") || hash.includes("refresh_token"))) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <AuthCard>
      <AuthHeader title="Welcome Back" subtitle="Sign in to continue your growth journey" />

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="space-y-5"
      >
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
              {fieldState.invalid && <FieldFeedback variant="error" message={fieldState.error?.message} />}
            </Field>
          )}
        />

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
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  aria-invalid={fieldState.invalid}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldState.invalid && <FieldFeedback variant="error" message={fieldState.error?.message} />}
            </Field>
          )}
        />

        <div className="flex items-center justify-between">
          <Controller
            name="remember"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox id="login-remember" checked={field.value} onCheckedChange={field.onChange} />
                <label htmlFor="login-remember" className="cursor-pointer select-none text-sm font-normal">
                  Remember me
                </label>
              </div>
            )}
          />

          <Link href="/forgot-password" className="whitespace-nowrap text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {apiError && <FieldFeedback variant="block-error" message={apiError} />}

        <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <AuthFooterLink text="Don't have an account?" href="/signup" label="Sign up" />
      <SocialButtons />
    </AuthCard>
  );
}
