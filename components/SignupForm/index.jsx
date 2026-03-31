"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MailCheck,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CountryPicker from "@/components/CountryPicker";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignupMentee } from "@/hooks/useSignupMentee";
import { useSignupMentor } from "@/hooks/useSignupMentor";
import { useCountries } from "@/services/Usecountries";
import vinceup_logo from "../../public/assets/vinceup_logo.png";
import MenteeFields from "./MenteeFields";
import MentorFields from "./MentorFields";
import { buildDefaultValues, buildPayload, buildSchema } from "./schema";

// ── Social Icons ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="#0A66C2"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ── Config per variant ────────────────────────────────────────────────────────
const VARIANT_CONFIG = {
  mentee: {
    title: "Start Your Journey",
    subtitle: "Create your mentee account to access expert mentorship",
    submitLabel: "Create Account",
    pendingLabel: "Creating Account…",
    termsLinks: (
      <>
        the{" "}
        <Link
          href="/terms-of-service"
          className="font-medium text-primary hover:underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="font-medium text-primary hover:underline"
        >
          Privacy Policy
        </Link>
      </>
    ),
    footerLink: (
      <Button
        asChild
        variant="outline"
        className="mt-3 w-full cursor-pointer border-0 bg-gray-100 hover:bg-gray-200"
        size="lg"
      >
        <Link href="/mentor-signup">
          Want to become a Mentor?{" "}
          <span className="font-semibold">Sign Up</span>
        </Link>
      </Button>
    ),
  },
  mentor: {
    title: "Become a Mentor",
    subtitle: "Share your expertise and help others grow in their careers",
    submitLabel: "Submit Application",
    pendingLabel: "Submitting…",
    termsLinks: (
      <>
        the{" "}
        <Link
          href="/terms-of-service"
          className="font-medium text-primary hover:underline"
        >
          Terms of Service
        </Link>
        ,{" "}
        <Link
          href="/privacy-policy"
          className="font-medium text-primary hover:underline"
        >
          Privacy Policy
        </Link>
        , and{" "}
        <Link
          href="/mentor-guidelines"
          className="font-medium text-primary hover:underline"
        >
          Mentor Guidelines
        </Link>
      </>
    ),
    footerLink: (
      <Button
        asChild
        variant="outline"
        className="mt-3 w-full cursor-pointer border-0 bg-gray-100 hover:bg-gray-200"
        size="lg"
      >
        <Link href="/signup">
          Are you a Mentee? <span className="font-semibold">Sign Up here!</span>
        </Link>
      </Button>
    ),
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
const SignupForm = ({ variant = "mentee" }) => {
  const router = useRouter();
  const config = VARIANT_CONFIG[variant];
  const isMentor = variant === "mentor";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  const menteeSignup = useSignupMentee({
    onSuccess: () => router.push("/login?registered=true"),
    onError: setApiError,
  });
  const mentorSignup = useSignupMentor({
    onSuccess: () => router.push("/login?registered=true"),
    onError: setApiError,
  });
  const { mutate: signup, isPending } = isMentor ? mentorSignup : menteeSignup;

  const form = useForm({
    resolver: zodResolver(buildSchema(variant)),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: buildDefaultValues(variant),
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

  const onSubmit = (values) => {
    setApiError(null);
    signup(buildPayload(values, variant));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/60">
        {/* ── Header ── */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <Image
              src={vinceup_logo}
              alt="VinceUp"
              className="h-8 w-8 object-contain brightness-0 invert"
              loading="eager"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {config.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* ── Form ── */}
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }}
          className="space-y-6"
        >
          {/* ━━ Basic Information ━━ */}
          <FieldSet>
            <FieldLegend variant="label" className="flex items-center gap-2">
              <MailCheck className="h-4 w-4" /> Basic Information
            </FieldLegend>
            <FieldGroup>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                {["first_name", "last_name"].map((name) => (
                  <Controller
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`su-${name}`}>
                          {name === "first_name" ? "First name" : "Last name"}
                        </FieldLabel>
                        <Input
                          {...field}
                          id={`su-${name}`}
                          placeholder={name === "first_name" ? "John" : "Doe"}
                          aria-invalid={fieldState.invalid}
                          autoComplete={
                            name === "first_name" ? "given-name" : "family-name"
                          }
                        />
                        <FieldFeedback
                          variant={fieldState.invalid ? "error" : "hint"}
                          message={fieldState.error?.message}
                        />
                      </Field>
                    )}
                  />
                ))}
              </div>

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="su-email">Email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        id="su-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
                      />
                    </div>
                    <FieldFeedback
                      variant={fieldState.invalid ? "error" : "hint"}
                      message={fieldState.error?.message}
                    />
                  </Field>
                )}
              />

              {/* Password row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="su-password">Password</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="su-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-9"
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                          onFocus={() => setShowPasswordHints(true)}
                          onBlur={() => {
                            field.onBlur();
                            if (!fieldState.error?.message)
                              setTimeout(
                                () => setShowPasswordHints(false),
                                150,
                              );
                          }}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
                      {(showPasswordHints || !!fieldState.error?.message) && (
                        <div className="space-y-1 mt-1">
                          <FieldFeedback
                            variant={
                              passwordChecks.length ? "success" : "error"
                            }
                            message="At least 8 characters"
                          />
                          <FieldFeedback
                            variant={
                              passwordChecks.lowercase ? "success" : "error"
                            }
                            message="1 lowercase letter"
                          />
                          <FieldFeedback
                            variant={
                              passwordChecks.uppercase ? "success" : "error"
                            }
                            message="1 uppercase letter"
                          />
                          <FieldFeedback
                            variant={
                              passwordChecks.number ? "success" : "error"
                            }
                            message="1 number"
                          />
                          <FieldFeedback
                            variant={
                              passwordChecks.special ? "success" : "error"
                            }
                            message="1 special character"
                          />
                        </div>
                      )}
                    </Field>
                  )}
                />

                {/* Confirm Password */}
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const showError =
                      fieldState.invalid || (confirmTouched && confirmError);
                    const showSuccess = passwordsMatch && !showError;
                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="su-confirm">
                          Confirm Password
                        </FieldLabel>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            {...field}
                            id="su-confirm"
                            type={showConfirm ? "text" : "password"}
                            placeholder="••••••••"
                            className={`pl-10 pr-9 ${showSuccess ? "border-emerald-500 focus-visible:ring-emerald-500/30" : ""}`}
                            aria-invalid={showError}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowConfirm((p) => !p)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
                              fieldState.error?.message ||
                              confirmError?.message ||
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
              </div>
            </FieldGroup>
          </FieldSet>

          {/* ━━ Location ━━ */}
          <FieldSet>
            <FieldLegend variant="label" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Location
            </FieldLegend>
            <div className="grid grid-cols-3 gap-3">
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="su-country">Country</FieldLabel>
                    <CountryPicker
                      id="su-country"
                      countries={countries}
                      isLoading={countriesLoading}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g., US"
                    />
                    <FieldFeedback
                      variant="error"
                      message={fieldState.error?.message}
                    />
                  </Field>
                )}
              />
              {[
                ["state", "Province/State", "e.g., California"],
                ["city", "City", "e.g., San Francisco"],
              ].map(([name, label, placeholder]) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`su-${name}`}>{label}</FieldLabel>
                      <Input
                        {...field}
                        id={`su-${name}`}
                        placeholder={placeholder}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldFeedback
                        variant="error"
                        message={fieldState.error?.message}
                      />
                    </Field>
                  )}
                />
              ))}
            </div>
          </FieldSet>

          {/* ━━ Role-specific Section ━━ */}
          {isMentor ? (
            <MentorFields control={form.control} />
          ) : (
            <MenteeFields control={form.control} form={form} />
          )}

          {/* ━━ Terms ━━ */}
          <Controller
            name="terms"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="su-terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  <label
                    htmlFor="su-terms"
                    className="text-sm cursor-pointer select-none"
                  >
                    I agree to {config.termsLinks}
                  </label>
                </div>
                <FieldFeedback
                  variant="error"
                  message={fieldState.error?.message}
                />
              </div>
            )}
          />

          {apiError && (
            <FieldFeedback variant="block-error" message={apiError} />
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            size="lg"
            disabled={isPending}
          >
            {isPending ? config.pendingLabel : config.submitLabel}
          </Button>
        </form>

        {/* ── Social ── */}
        <FieldSeparator className="my-6">Or continue with</FieldSeparator>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="cursor-pointer"
          >
            <GoogleIcon /> Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="cursor-pointer"
          >
            <LinkedInIcon /> LinkedIn
          </Button>
        </div>

        {/* ── Footer ── */}
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
        {config.footerLink}
      </div>
    </div>
  );
};

export default SignupForm;
