"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MailCheck,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import SocialButtons from "@/components/auth/SocialButtons";
import CountryPicker from "@/components/CountryPicker";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignupMentor } from "@/hooks/useSignupMentor";
import { useCountries } from "@/services/Usecountries";

// ─── Constants ───
const EXPERIENCE_OPTIONS = [
  { value: "<1", label: "Less than 1 year" },
  { value: "1 to 3", label: "1 to 3 years" },
  { value: "3 to 5", label: "3 to 5 years" },
  { value: "5 to 10", label: "5 to 10 years" },
  { value: ">10", label: "More than 10 years" },
];

// ─── Validation Schema ───
const mentorSchema = z
  .object({
    first_name: z.string().min(1, "Please enter your first name").max(50, "First name is too long"),
    last_name: z.string().min(1, "Please enter your last name").max(50, "Last name is too long"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
        "Must include uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "Province/State is required"),
    city: z.string().min(1, "City is required"),
    companyName: z.string().min(1, "Company name is required"),
    title: z.string().min(1, "Title is required"),
    industry: z.string().min(1, "Industry is required"),
    sector: z.string().min(1, "Sector is required"),
    workExperience: z.string().min(1, "Work experience is required"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms" }),
    }),
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

const MentorPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const { mutate: signup, isPending } = useSignupMentor({
    onSuccess: () => router.push("/login?registered=true"),
    onError: (message) => setApiError(message),
  });
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  const form = useForm({
    resolver: zodResolver(mentorSchema),
    mode: "onTouched",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      state: "",
      city: "",
      companyName: "",
      title: "",
      industry: "",
      sector: "",
      workExperience: "",
      terms: false,
    },
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
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      country: values.country,
      province: values.state,
      city: values.city,
      company_name: values.companyName,
      title: values.title,
      industry: values.industry,
      work_experience: values.workExperience,
    };
    signup(payload);
  };

  return (
    <AuthCard maxWidth="lg">
      <AuthHeader
        title="Become a Mentor"
        subtitle="Share your expertise and help others grow in their careers"
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
        {/* ━━ Section: Basic Information ━━ */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <MailCheck className="h-4 w-4" />
            Basic Information
          </FieldLegend>
          <FieldGroup>
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="first_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-first-name">First name</FieldLabel>
                    <Input
                      {...field}
                      id="mentor-first-name"
                      placeholder="John"
                      aria-invalid={fieldState.invalid}
                      autoComplete="given-name"
                    />
                    <FieldFeedback
                      variant={fieldState.invalid ? "error" : "hint"}
                      message={fieldState.error?.message}
                    />
                  </Field>
                )}
              />
              <Controller
                name="last_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-last-name">Last name</FieldLabel>
                    <Input
                      {...field}
                      id="mentor-last-name"
                      placeholder="Doe"
                      aria-invalid={fieldState.invalid}
                      autoComplete="family-name"
                    />
                    <FieldFeedback
                      variant={fieldState.invalid ? "error" : "hint"}
                      message={fieldState.error?.message}
                    />
                  </Field>
                )}
              />
            </div>

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="mentor-email"
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

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="mentor-password">Password</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="mentor-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-9"
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                          onFocus={() => setShowPasswordHints(true)}
                          onBlur={() => {
                            field.onBlur();
                            if (!fieldState.error?.message) {
                              setTimeout(() => setShowPasswordHints(false), 150);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
                      <FieldFeedback variant="error" message={fieldState.error?.message} />
                      {(showPasswordHints || !!fieldState.error?.message) && (
                        <div className="col-span-2 space-y-1">
                          <FieldFeedback variant={passwordChecks.length ? "success" : "error"} message="At least 8 characters" />
                          <FieldFeedback variant={passwordChecks.lowercase ? "success" : "error"} message="1 lowercase letter" />
                          <FieldFeedback variant={passwordChecks.uppercase ? "success" : "error"} message="1 uppercase letter" />
                          <FieldFeedback variant={passwordChecks.number ? "success" : "error"} message="1 number" />
                          <FieldFeedback variant={passwordChecks.special ? "success" : "error"} message="1 special character" />
                        </div>
                      )}
                    </Field>
                  </>
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
                      <FieldLabel htmlFor="mentor-confirm">Confirm Password</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="mentor-confirm"
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
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
                          onClick={() => setShowConfirm((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          tabIndex={-1}
                          aria-label={
                            showConfirm ? "Hide confirm password" : "Show confirm password"
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
                        <FieldFeedback variant="success" message="Passwords match" />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </FieldGroup>
        </FieldSet>

        {/* ━━ Section: Location ━━ */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </FieldLegend>
          <div className="grid grid-cols-3 gap-3">
            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-country">Country</FieldLabel>
                  <CountryPicker
                    id="mentor-country"
                    countries={countries}
                    isLoading={countriesLoading}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="e.g., US"
                  />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
            <Controller
              name="state"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-state">Province/State</FieldLabel>
                  <Input
                    {...field}
                    id="mentor-state"
                    placeholder="e.g., California"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-city">City</FieldLabel>
                  <Input
                    {...field}
                    id="mentor-city"
                    placeholder="e.g., San Francisco"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
          </div>
        </FieldSet>

        {/* ━━ Section: Professional Details ━━ */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Professional Details
          </FieldLegend>
          <FieldGroup>
            {/* Company Name + Title */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="companyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-company">Company Name</FieldLabel>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        id="mentor-company"
                        placeholder="e.g., Google"
                        className="pl-10"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    <FieldFeedback variant="error" message={fieldState.error?.message} />
                  </Field>
                )}
              />
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-title">Title</FieldLabel>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        id="mentor-title"
                        placeholder="e.g., Senior Engineer"
                        className="pl-10"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    <FieldFeedback variant="error" message={fieldState.error?.message} />
                  </Field>
                )}
              />
            </div>

            {/* Industry + Sector */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="industry"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-industry">Industry</FieldLabel>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        id="mentor-industry"
                        placeholder="e.g., Technology"
                        className="pl-10"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    <FieldFeedback variant="error" message={fieldState.error?.message} />
                  </Field>
                )}
              />
              <Controller
                name="sector"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-sector">Sector</FieldLabel>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        id="mentor-sector"
                        placeholder="e.g., IT"
                        className="pl-10"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    <FieldFeedback variant="error" message={fieldState.error?.message} />
                  </Field>
                )}
              />
            </div>

            {/* Work Experience */}
            <Controller
              name="workExperience"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-experience">Work Experience</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="mentor-experience" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select your experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        {/* ━━ Terms ━━ */}
        <Controller
          name="terms"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mentor-terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <label
                  htmlFor="mentor-terms"
                  className="text-sm cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link href="/terms-of-service" className="font-medium text-primary hover:underline">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link href="/mentor-guidelines" className="font-medium text-primary hover:underline">
                    Mentor Guidelines
                  </Link>
                </label>
              </div>
              <FieldFeedback variant="error" message={fieldState.error?.message} />
            </div>
          )}
        />

        {/* ── API Feedback ── */}
        {apiError && <FieldFeedback variant="block-error" message={apiError} />}

        {/* ━━ Submit ━━ */}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          size="lg"
          disabled={isPending}
        >
          {isPending ? "Submitting…" : "Submit Application"}
        </Button>
      </form>

      {/* ── Footer ── */}
      <SocialButtons />
      <AuthFooterLink text="Already have an account?" href="/login" label="Sign in" />

      <Button
        asChild
        variant="outline"
        className="mt-3 w-full cursor-pointer border-primary! text-primary! border-0 bg-gray-100 hover:bg-gray-200"
        size="lg"
      >
        <Link href="/signup">
          Are you a Mentee?{" "}
          <span className="font-semibold">Sign Up here!</span>
        </Link>
      </Button>
    </AuthCard>
  );
};

export default MentorPage;