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
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import CountryCodePicker from "@/components/Countrycodepicker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
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
import { Textarea } from "@/components/ui/textarea";
import { useSignupMentee } from "@/hooks/useSignupMentee";
import { useCountries } from "@/services/Usecountries";
import vinceup_logo from "../../../public/assets/vinceup_logo.png";

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

// ─── Validation Schema ───
const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
      "Must include uppercase, lowercase, number, and special character",
    ),
  countryCode: z.string().min(1, "Country code is required"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[\d\s()-]{7,15}$/, "Please enter a valid phone number"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "Province/State is required"),
  city: z.string().min(1, "City is required"),
  occupation: z.enum(["professional", "student"], {
    required_error: "Please select your occupation",
  }),
  highestEducation: z.string().min(1, "Please select your education level"),
  experience: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  const { mutate: signup, isPending } = useSignupMentee({
    onSuccess: () => {
      router.push("/login?registered=true");
    },
    onError: (message) => {
      setApiError(message);
    },
  });

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      countryCode: "+91",
      mobile: "",
      country: "",
      state: "",
      city: "",
      occupation: undefined,
      highestEducation: "",
      experience: "",
      terms: false,
    },
  });

  const onSubmit = (values) => {
    setApiError(null);

    // Map form fields → API payload
    const payload = {
      email: values.email,
      password: values.password,
      mobile_number: `${values.countryCode}${values.mobile.replace(/[\s()-]/g, "")}`,
      country: values.country,
      province: values.state,
      city: values.city,
      current_occupation: values.occupation,
      highest_education: values.highestEducation,
    };

    signup(payload);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
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
              Start Your Journey
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your mentee account to access expert mentorship
            </p>
          </div>
        </div>

        {/* ── Form ── */}
        <form
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
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
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
                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        id="signup-password"
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Mobile with Country Code */}
              <Controller
                name="mobile"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-mobile">
                      Mobile Number
                    </FieldLabel>
                    <div className="flex gap-2">
                      <CountryCodePicker
                        id="signup-country-code"
                        countries={countries}
                        isLoading={countriesLoading}
                        value={form.watch("countryCode")}
                        onChange={(dialCode) =>
                          form.setValue("countryCode", dialCode, {
                            shouldValidate: true,
                          })
                        }
                      />
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signup-mobile"
                          type="tel"
                          placeholder="(555) 000-0000"
                          className="pl-10"
                          aria-invalid={fieldState.invalid}
                        />
                      </div>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
                    <Input
                      {...field}
                      id="signup-country"
                      placeholder="e.g., Canada"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="state"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-state">
                      Province/State
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-state"
                      placeholder="e.g., British Columbia"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                      placeholder="e.g., Vancouver"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
              <Controller
                name="occupation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>I am a</FieldLabel>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="professional"
                          id="signup-professional"
                          aria-invalid={fieldState.invalid}
                        />
                        <label
                          htmlFor="signup-professional"
                          className="text-sm cursor-pointer"
                        >
                          Working Professional
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="student"
                          id="signup-student"
                          aria-invalid={fieldState.invalid}
                        />
                        <label
                          htmlFor="signup-student"
                          className="text-sm cursor-pointer"
                        >
                          Student
                        </label>
                      </div>
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

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
                      <SelectTrigger
                        id="signup-education"
                        aria-invalid={fieldState.invalid}
                      >
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Work Experience */}
              <Controller
                name="experience"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-experience">
                      Work Experience
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="signup-experience"
                      placeholder="Briefly describe your experience or current studies..."
                      className="min-h-20 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    I agree to the
                    <Link
                      href="/terms-of-service"
                      className="font-medium text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>
                    and
                    <Link
                      href="/privacy-policy"
                      className="font-medium text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {fieldState.invalid && (
                  <p className="mt-1 text-sm text-destructive">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* ── API Feedback ── */}
          {apiError && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {apiError}
            </div>
          )}

          {/* ━━ Submit ━━ */}
          <Button
            type="submit"
            className="w-full cursor-pointer"
            size="lg"
            disabled={isPending}
          >
            {isPending ? "Creating Account…" : "Create Account"}
          </Button>
        </form>

        {/* ── Footer Links ── */}
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>

        <Button
          asChild
          variant="outline"
          className="mt-3 w-full cursor-pointer border-primary! text-primary! border-0 bg-gray-100 hover:bg-gray-200"
          size="lg"
        >
          <Link href="/become-a-mentor">
            Want to become a Mentor?
            <span className="font-semibold">Sign Up</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SignupPage;
