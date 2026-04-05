"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  MailCheck,
  MapPin,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignupMentee } from "@/hooks/useSignupMentee";
import { useCountries } from "@/services/Usecountries";

// ─── Constants ───
const EDUCATION_OPTIONS = [
  "High School",
  "Diploma",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  { value: "<1", label: "Less than 1 year" },
  { value: "1 to 3", label: "1 to 3 years" },
  { value: "3 to 5", label: "3 to 5 years" },
  { value: ">5", label: "More than 5 years" },
];

// ─── Validation Schema ───
const signupSchema = z
  .object({
    first_name: z.string().min(1, "Please enter your first name").max(50, "First name is too long"),
    last_name: z.string().min(1, "Please enter your last name").max(50, "Last name is too long"),
    email: z.string().min(1, "Please enter your email address").email("That doesn't look like a valid email"),
    password: z
      .string()
      .min(1, "Please create a password")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
        "Use uppercase, lowercase, number, and a special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    country: z.string().min(1, "Please select your country"),
    state: z.string().min(1, "Please enter your state"),
    city: z.string().min(1, "Please enter your city"),
    occupation: z.enum(["working_professional", "student"], {
      error: (iss) =>
        iss.input === undefined || iss.input === ""
          ? "Please select your occupation"
          : "Please select a valid occupation",
    }),
    yearsOfExperience: z.string().optional(),
    highestEducation: z.string().min(1, "Please select your education level"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You need to accept the terms to continue",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
    if (
      data.occupation === "working_professional" &&
      (!data.yearsOfExperience || data.yearsOfExperience === "")
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Please select your work experience",
        path: ["yearsOfExperience"],
      });
    }
  });

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { mutate: signup, isPending } = useSignupMentee({
    onSuccess: () => router.push("/login?registered=true"),
    onError: (message) => setApiError(message),
  });

  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      state: "",
      city: "",
      occupation: undefined,
      yearsOfExperience: "",
      highestEducation: "",
      terms: false,
    },
  });

  const occupation = form.watch("occupation");
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
      current_occupation: values.occupation,
      highest_education: values.highestEducation,
      ...(values.occupation === "working_professional" && {
        years_of_experience: values.yearsOfExperience,
      }),
    };
    signup(payload);
  };

  return (
    <AuthCard maxWidth="lg">
      <AuthHeader
        title="Start Your Journey"
        subtitle="Create your mentee account to access expert mentorship"
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
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="first_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-first-name">First name</FieldLabel>
                    <Input
                      {...field}
                      id="signup-first-name"
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
                    <FieldLabel htmlFor="signup-last-name">Last name</FieldLabel>
                    <Input
                      {...field}
                      id="signup-last-name"
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
                  <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="signup-email"
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
                      <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signup-password"
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
                      <FieldLabel htmlFor="signup-confirm">
                        Confirm Password
                      </FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signup-confirm"
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
                  <FieldLabel htmlFor="signup-country">Country</FieldLabel>
                  <CountryPicker
                    id="signup-country"
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
                  <FieldLabel htmlFor="signup-state">Province/State</FieldLabel>
                  <Input
                    {...field}
                    id="signup-state"
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
                  <FieldLabel htmlFor="signup-city">City</FieldLabel>
                  <Input
                    {...field}
                    id="signup-city"
                    placeholder="e.g., San Francisco"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
          </div>
        </FieldSet>

        {/* ━━ Section: Current Occupation ━━ */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Current Occupation
          </FieldLegend>
          <FieldGroup>
            {/* Occupation Radio */}
            <Controller
              name="occupation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>I am a</FieldLabel>
                  <RadioGroup
                    name={field.name}
                    value={field.value || ""}
                    onValueChange={(val) => {
                      field.onChange(val);
                      if (val === "student") {
                        form.setValue("yearsOfExperience", "", {
                          shouldValidate: true,
                        });
                      }
                    }}
                    className="flex items-center gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="working_professional"
                        id="signup-professional"
                        aria-invalid={fieldState.invalid}
                      />
                      <label htmlFor="signup-professional" className="text-sm cursor-pointer">
                        Working Professional
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="student"
                        id="signup-student"
                        aria-invalid={fieldState.invalid}
                      />
                      <label htmlFor="signup-student" className="text-sm cursor-pointer">
                        Student
                      </label>
                    </div>
                  </RadioGroup>
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />

            {/* Years of Experience (conditional) */}
            {occupation === "working_professional" && (
              <Controller
                name="yearsOfExperience"
                control={form.control}
                render={({ field, fieldState }) => {
                  const error =
                    fieldState.error || form.formState.errors.yearsOfExperience;
                  return (
                    <Field data-invalid={!!error}>
                      <FieldLabel htmlFor="signup-experience">
                        Work Experience
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        onOpenChange={(open) => !open && field.onBlur()}
                      >
                        <SelectTrigger id="signup-experience" aria-invalid={!!error}>
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
                      <FieldFeedback variant="error" message={error?.message} />
                    </Field>
                  );
                }}
              />
            )}

            {/* Highest Education */}
            <Controller
              name="highestEducation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-education">
                    <GraduationCap className="inline h-4 w-4 mr-1" />
                    Highest Education
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="signup-education" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
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
                  id="signup-terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <label
                  htmlFor="signup-terms"
                  className="text-sm cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link href="/terms-of-service" className="font-medium text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
                    Privacy Policy
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
        <Button type="submit" className="w-full cursor-pointer" size="lg">
          {isPending ? "Creating Account…" : "Create Account"}
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
        <Link href="/mentor-signup">
          Want to become a Mentor?{" "}
          <span className="font-semibold">Sign Up</span>
        </Link>
      </Button>
    </AuthCard>
  );
};

export default SignupPage;