"use client";

import {
  Briefcase, Building2, Eye, EyeOff, LockKeyhole, Mail, MailCheck, MapPin, TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import SocialButtons from "@/components/auth/SocialButtons";
import CountryPicker from "@/components/CountryPicker";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSignupMentor } from "@/hooks/useSignupMentor";
import { useCountries } from "@/services/Usecountries";

const EXPERIENCE_OPTIONS = [
  { value: "<1", label: "Less than 1 year" },
  { value: "1 to 3", label: "1 to 3 years" },
  { value: "3 to 5", label: "3 to 5 years" },
  { value: "5 to 10", label: "5 to 10 years" },
  { value: ">10", label: "More than 10 years" },
];

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: "", last_name: "", email: "", password: "", confirmPassword: "",
      country: "", state: "", city: "", companyName: "", title: "",
      industry: "", sector: "", workExperience: "", terms: false,
    },
  });

  const passwordValue = useWatch({ control: form.control, name: "password" }) ?? "";
  const confirmValue = useWatch({ control: form.control, name: "confirmPassword" }) ?? "";

  const passwordChecks = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /\d/.test(passwordValue),
    special: /[@$!%*?&#]/.test(passwordValue),
  };

  const onSubmit = (values) => {
    setApiError(null);
    signup({
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
    });
  };

  return (
    <AuthCard maxWidth="lg">
      <AuthHeader title="Become a Mentor" subtitle="Share your expertise and help others grow in their careers" />

      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <MailCheck className="h-4 w-4" /> Basic Information
          </FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="first_name"
                control={form.control}
                rules={{
                  required: "Please enter your first name",
                  maxLength: { value: 50, message: "First name is too long" },
                }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-first-name">First name</FieldLabel>
                    <Input {...field} id="mentor-first-name" placeholder="John" aria-invalid={fieldState.invalid} autoComplete="given-name" />
                    <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />
                  </Field>
                )}
              />
              <Controller
                name="last_name"
                control={form.control}
                rules={{
                  required: "Please enter your last name",
                  maxLength: { value: 50, message: "Last name is too long" },
                }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-last-name">Last name</FieldLabel>
                    <Input {...field} id="mentor-last-name" placeholder="Doe" aria-invalid={fieldState.invalid} autoComplete="family-name" />
                    <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="email"
              control={form.control}
              rules={{
                required: "Email is required",
                pattern: { value: EMAIL_RX, message: "Please enter a valid email" },
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} id="mentor-email" type="email" placeholder="your@email.com" className="pl-10" aria-invalid={fieldState.invalid} autoComplete="email" />
                  </div>
                  <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="password"
                control={form.control}
                rules={{
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  validate: (v) => {
                    if (!/[a-z]/.test(v)) return "Must include a lowercase letter";
                    if (!/[A-Z]/.test(v)) return "Must include an uppercase letter";
                    if (!/\d/.test(v)) return "Must include a number";
                    if (!/[@$!%*?&#]/.test(v)) return "Must include a special character";
                    return true;
                  },
                  onChange: () => {
                    if (form.formState.touchedFields.confirmPassword) {
                      form.trigger("confirmPassword");
                    }
                  },
                }}
                render={({ field, fieldState }) => (
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
                        onBlur={(e) => {
                          field.onBlur(e);
                          if (!fieldState.error?.message) setTimeout(() => setShowPasswordHints(false), 150);
                        }}
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                rules={{
                  required: "Please confirm your password",
                  validate: (v) => v === form.getValues("password") || "Passwords do not match",
                }}
                render={({ field, fieldState }) => {
                  const showSuccess =
                    fieldState.isTouched && confirmValue && passwordValue === confirmValue && !fieldState.error;
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="mentor-confirm">Confirm Password</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="mentor-confirm"
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-10 pr-9 ${showSuccess ? "border-emerald-500 focus-visible:ring-emerald-500/30" : ""}`}
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((p) => !p)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          tabIndex={-1}
                          aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldState.error?.message && <FieldFeedback variant="error" message={fieldState.error.message} />}
                      {showSuccess && <FieldFeedback variant="success" message="Passwords match" />}
                    </Field>
                  );
                }}
              />
            </div>
          </FieldGroup>
        </FieldSet>

        {/* Location */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Location
          </FieldLegend>
          <div className="grid grid-cols-3 gap-3">
            <Controller
              name="country"
              control={form.control}
              rules={{ required: "Country is required" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-country">Country</FieldLabel>
                  <CountryPicker id="mentor-country" countries={countries} isLoading={countriesLoading} value={field.value} onChange={field.onChange} placeholder="e.g., US" />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
            <Controller
              name="state"
              control={form.control}
              rules={{ required: "Province/State is required" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-state">Province/State</FieldLabel>
                  <Input {...field} id="mentor-state" placeholder="e.g., California" aria-invalid={fieldState.invalid} />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              rules={{ required: "City is required" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-city">City</FieldLabel>
                  <Input {...field} id="mentor-city" placeholder="e.g., San Francisco" aria-invalid={fieldState.invalid} />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
          </div>
        </FieldSet>

        {/* Professional Details */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Professional Details
          </FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="companyName"
                control={form.control}
                rules={{ required: "Company name is required" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-company">Company Name</FieldLabel>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} id="mentor-company" placeholder="e.g., Google" className="pl-10" aria-invalid={fieldState.invalid} />
                    </div>
                    <FieldFeedback variant="error" message={fieldState.error?.message} />
                  </Field>
                )}
              />
              <Controller
                name="title"
                control={form.control}
                rules={{ required: "Title is required" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-title">Title</FieldLabel>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} id="mentor-title" placeholder="e.g., Senior Engineer" className="pl-10" aria-invalid={fieldState.invalid} />
                    </div>
                    <FieldFeedback variant="error" message={fieldState.error?.message} />
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="industry"
                control={form.control}
                rules={{ required: "Industry is required" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-industry">Industry</FieldLabel>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} id="mentor-industry" placeholder="e.g., Technology" className="pl-10" aria-invalid={fieldState.invalid} />
                    </div>
                    <FieldFeedback variant="error" message={fieldState.error?.message} />
                  </Field>
                )}
              />
              <Controller
                name="sector"
                control={form.control}
                rules={{ required: "Sector is required" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mentor-sector">Sector</FieldLabel>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} id="mentor-sector" placeholder="e.g., IT" className="pl-10" aria-invalid={fieldState.invalid} />
                    </div>
                    <FieldFeedback variant="error" message={fieldState.error?.message} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="workExperience"
              control={form.control}
              rules={{ required: "Work experience is required" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mentor-experience">Work Experience</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="mentor-experience" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select your experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        {/* Terms */}
        <Controller
          name="terms"
          control={form.control}
          rules={{ validate: (v) => v === true || "You must agree to the terms" }}
          render={({ field, fieldState }) => (
            <div>
              <div className="flex items-center gap-2">
                <Checkbox id="mentor-terms" checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
                <label htmlFor="mentor-terms" className="text-sm cursor-pointer select-none">
                  I agree to the{" "}
                  <Link href="/terms-of-service" className="font-medium text-primary hover:underline">Terms of Service</Link>,{" "}
                  <Link href="/privacy-policy" className="font-medium text-primary hover:underline">Privacy Policy</Link>, and{" "}
                  <Link href="/mentor-guidelines" className="font-medium text-primary hover:underline">Mentor Guidelines</Link>
                </label>
              </div>
              <FieldFeedback variant="error" message={fieldState.error?.message} />
            </div>
          )}
        />

        {apiError && <FieldFeedback variant="block-error" message={apiError} />}

        <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit Application"}
        </Button>
      </form>

      <SocialButtons />
      <AuthFooterLink text="Already have an account?" href="/login" label="Sign in" />

      <Button asChild variant="outline" className="mt-3 w-full cursor-pointer border-primary! text-primary! border-0 bg-gray-100 hover:bg-gray-200" size="lg">
        <Link href="/signup">
          Are you a Mentee? <span className="font-semibold">Sign Up here!</span>
        </Link>
      </Button>
    </AuthCard>
  );
};

export default MentorPage;