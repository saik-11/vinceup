"use client";

import { Briefcase, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, MailCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import SocialButtons from "@/components/auth/SocialButtons";
import { CountrySelect, StateSelect, CitySelect } from "@/components/shared/LocationPicker";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSignupMentee } from "@/hooks/useSignupMentee";

const EDUCATION_OPTIONS = ["High School", "Diploma", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate (PhD)", "Other"];
const EXPERIENCE_OPTIONS = [
  { value: "<1", label: "Less than 1 year" },
  { value: "1 to 3", label: "1 to 3 years" },
  { value: "3 to 5", label: "3 to 5 years" },
  { value: ">5", label: "More than 5 years" },
];
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const { mutate: signup, isPending } = useSignupMentee({
    onSuccess: () => router.push("/login?registered=true"),
    onError: (message) => setApiError(message),
  });

  const form = useForm({
    mode: "all",
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
      occupation: "",
      yearsOfExperience: "",
      highestEducation: "",
      terms: false,
    },
  });

  const occupation = useWatch({ control: form.control, name: "occupation" });
  const passwordValue = useWatch({ control: form.control, name: "password" }) ?? "";
  const confirmValue = useWatch({ control: form.control, name: "confirmPassword" }) ?? "";
  const countryValue = useWatch({ control: form.control, name: "country" });
  const stateValue = useWatch({ control: form.control, name: "state" });

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
      current_occupation: values.occupation,
      highest_education: values.highestEducation,
      ...(values.occupation === "working_professional" && { years_of_experience: values.yearsOfExperience }),
    });
  };

  return (
    <AuthCard maxWidth="lg">
      <AuthHeader title="Start Your Journey" subtitle="Create your mentee account to access expert mentorship" />

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
                rules={{ required: "Please enter your first name", maxLength: { value: 50, message: "First name is too long" } }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-first-name">First name</FieldLabel>
                    <Input {...field} id="signup-first-name" placeholder="John" aria-invalid={fieldState.invalid} autoComplete="given-name" />
                    <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />
                  </Field>
                )}
              />
              <Controller
                name="last_name"
                control={form.control}
                rules={{ required: "Please enter your last name", maxLength: { value: 50, message: "Last name is too long" } }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-last-name">Last name</FieldLabel>
                    <Input {...field} id="signup-last-name" placeholder="Doe" aria-invalid={fieldState.invalid} autoComplete="family-name" />
                    <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="email"
              control={form.control}
              rules={{
                required: "Please enter your email address",
                pattern: { value: EMAIL_RX, message: "That doesn't look like a valid email" },
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} id="signup-email" type="email" placeholder="your@email.com" className="pl-10" aria-invalid={fieldState.invalid} autoComplete="email" />
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
                  required: "Please create a password",
                  minLength: { value: 8, message: "Password must be at least 8 characters long" },
                  validate: (v) => {
                    if (!/[a-z]/.test(v)) return "Must include a lowercase letter";
                    if (!/[A-Z]/.test(v)) return "Must include an uppercase letter";
                    if (!/\d/.test(v)) return "Must include a number";
                    if (!/[@$!%*?&#]/.test(v)) return "Must include a special character";
                    return true;
                  },
                  onChange: () => {
                    if (form.formState.touchedFields.confirmPassword) form.trigger("confirmPassword");
                  },
                }}
                render={({ field, fieldState }) => (
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
                  validate: (v) => v === form.getValues("password") || "Passwords don't match",
                }}
                render={({ field, fieldState }) => {
                  const showSuccess = fieldState.isTouched && confirmValue && passwordValue === confirmValue && !fieldState.error;
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signup-confirm">Confirm Password</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signup-confirm"
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
              rules={{ required: "Please select your country" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-country">Country</FieldLabel>
                  <CountrySelect id="signup-country" value={field.value} onChange={(val) => {
                    field.onChange(val);
                    form.setValue("state", "", { shouldValidate: true });
                    form.setValue("city", "", { shouldValidate: true });
                  }} placeholder="e.g., US" />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
            <Controller
              name="state"
              control={form.control}
              rules={{ required: "Please enter your state" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-state">Province/State</FieldLabel>
                  <StateSelect id="signup-state" countryName={countryValue} value={field.value} onChange={(val) => {
                    field.onChange(val);
                    form.setValue("city", "", { shouldValidate: true });
                  }} placeholder="e.g., California" />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              rules={{ required: "Please enter your city" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-city">City</FieldLabel>
                  <CitySelect id="signup-city" countryName={countryValue} stateName={stateValue} value={field.value} onChange={field.onChange} placeholder="e.g., San Francisco" />
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />
          </div>
        </FieldSet>

        {/* Current Occupation */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Current Occupation
          </FieldLegend>
          <FieldGroup>
            <Controller
              name="occupation"
              control={form.control}
              rules={{ required: "Please select your occupation" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>I am a</FieldLabel>
                  <RadioGroup
                    name={field.name}
                    value={field.value || ""}
                    onValueChange={(val) => {
                      field.onChange(val);
                      if (val === "student") form.setValue("yearsOfExperience", "", { shouldValidate: true });
                    }}
                    className="flex items-center gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="working_professional" id="signup-professional" aria-invalid={fieldState.invalid} />
                      <label htmlFor="signup-professional" className="text-sm cursor-pointer">
                        Working Professional
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="student" id="signup-student" aria-invalid={fieldState.invalid} />
                      <label htmlFor="signup-student" className="text-sm cursor-pointer">
                        Student
                      </label>
                    </div>
                  </RadioGroup>
                  <FieldFeedback variant="error" message={fieldState.error?.message} />
                </Field>
              )}
            />

            {occupation === "working_professional" && (
              <Controller
                name="yearsOfExperience"
                control={form.control}
                rules={{ validate: (v) => (occupation === "working_professional" && !v ? "Please select your work experience" : true) }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-experience">Work Experience</FieldLabel>
                    <Select name={field.name} value={field.value || ""} onValueChange={field.onChange} onOpenChange={(o) => !o && field.onBlur()}>
                      <SelectTrigger id="signup-experience" aria-invalid={fieldState.invalid}>
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
            )}

            <Controller
              name="highestEducation"
              control={form.control}
              rules={{ required: "Please select your education level" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-education">
                    <GraduationCap className="inline h-4 w-4 mr-1" /> Highest Education
                  </FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
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

        {/* Terms */}
        <Controller
          name="terms"
          control={form.control}
          rules={{ validate: (v) => v === true || "You need to accept the terms to continue" }}
          render={({ field, fieldState }) => (
            <div>
              <div className="flex items-center gap-2">
                <Checkbox id="signup-terms" checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
                <label htmlFor="signup-terms" className="text-sm cursor-pointer select-none">
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

        {apiError && <FieldFeedback variant="block-error" message={apiError} />}

        <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isPending}>
          {isPending ? "Creating Account…" : "Create Account"}
        </Button>
      </form>

      <SocialButtons />
      <AuthFooterLink text="Already have an account?" href="/login" label="Sign in" />

      <Button asChild variant="outline" className="mt-3 w-full cursor-pointer border-primary! text-primary! border-0 bg-gray-100 hover:bg-gray-200" size="lg">
        <Link href="/mentor-signup">
          Want to become a Mentor? <span className="font-semibold">Sign Up</span>
        </Link>
      </Button>
    </AuthCard>
  );
};

export default SignupPage;
