"use client";

import { AlertCircle, Briefcase, GraduationCap, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import AuthCard from "@/components/auth/AuthCard";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import AuthHeader from "@/components/auth/AuthHeader";
import SocialButtons from "@/components/auth/SocialButtons";
import { EmailVerificationField } from "@/components/auth/signup/EmailVerificationField";
import { LocationSection } from "@/components/auth/signup/LocationSection";
import { NameFields } from "@/components/auth/signup/NameFields";
import { PasswordFields } from "@/components/auth/signup/PasswordFields";
import { MENTEE_LINKS, TermsField } from "@/components/auth/signup/TermsField";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
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

const SignupPage = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);

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
    <AuthCard>
      <AuthHeader title="Start Your Journey" subtitle="Create your mentee account to access expert mentorship" />

      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <MailCheck className="h-4 w-4" /> Basic Information
          </FieldLegend>
          <FieldGroup>
            <NameFields control={form.control} idPrefix="signup" />
            <EmailVerificationField control={form.control} idPrefix="signup" onVerifiedChange={setEmailVerified} />
            <PasswordFields form={form} idPrefix="signup" />
          </FieldGroup>
        </FieldSet>

        <LocationSection form={form} idPrefix="signup" />

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
                rules={{
                  validate: (v) => (occupation === "working_professional" && !v ? "Please select your work experience" : true),
                }}
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

        <TermsField control={form.control} idPrefix="signup" links={MENTEE_LINKS} />

        {apiError && <FieldFeedback variant="block-error" message={apiError} />}

        {!emailVerified && (
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 sm:px-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
            <p className="text-sm font-medium">Please verify your email to continue with account creation</p>
          </div>
        )}

        <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isPending || !emailVerified}>
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
