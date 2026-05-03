"use client";

import { AlertCircle, Award, Briefcase, Building2, MailCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import AuthCard from "@/components/auth/AuthCard";
import AuthFooterLink from "@/components/auth/AuthFooterLink";
import AuthHeader from "@/components/auth/AuthHeader";
import SocialButtons from "@/components/auth/SocialButtons";
import { EmailVerificationField } from "@/components/auth/signup/EmailVerificationField";
import { LocationSection } from "@/components/auth/signup/LocationSection";
import { NameFields } from "@/components/auth/signup/NameFields";
import { PasswordFields } from "@/components/auth/signup/PasswordFields";
import { MENTOR_LINKS, TermsField } from "@/components/auth/signup/TermsField";
import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSignupMentor } from "@/hooks/useSignupMentor";

const EXPERIENCE_OPTIONS = [
  { value: "<1", label: "Less than 1 year" },
  { value: "1 to 3", label: "1 to 3 years" },
  { value: "3 to 5", label: "3 to 5 years" },
  { value: "5 to 10", label: "5 to 10 years" },
  { value: ">10", label: "More than 10 years" },
];

const MentorPage = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const { mutate: signup, isPending } = useSignupMentor({
    onSuccess: (data) => {
      if (data?.mentor_status === "pending") {
        setPendingData(data);
      } else {
        router.push("/login?registered=true");
      }
    },
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
      companyName: "",
      title: "",
      industry: "",
      sector: "",
      workExperience: "",
      terms: false,
    },
  });

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

  if (pendingData) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center justify-center space-y-7 py-6 px-2 sm:px-4 text-center">
          <div className="rounded-[20px] bg-[#783cf9] p-4 flex items-center justify-center">
            <Award className="h-10 w-10 text-white" />
          </div>

          <div className="space-y-3">
            <h2 className="text-[26px] font-bold tracking-tight text-gray-900">Application Submitted!</h2>
            <p className="text-gray-600 text-[15px] leading-relaxed max-w-90 mx-auto">
              {pendingData.message || "Thank you for your interest in becoming a mentor. We've received your application and will review it shortly."}
            </p>
          </div>

          <div className="w-full pt-1">
            <div className="rounded-xl bg-[#fbf7ff] p-5 sm:px-8 text-center mx-auto max-w-95">
              <p className="text-[14.5px] text-gray-700 leading-snug">Our team will contact you via email within 2-3 business days with next steps.</p>
            </div>
          </div>

          <div className="pt-2">
            <Button asChild className="h-12 px-8 bg-[#783cf9] hover:bg-[#682ae1] text-white rounded-lg shadow-sm text-[15px] font-medium">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader title="Become a Mentor" subtitle="Share your expertise and help others grow in their careers" />

      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <FieldSet>
          <FieldLegend variant="label" className="flex items-center gap-2">
            <MailCheck className="h-4 w-4" /> Basic Information
          </FieldLegend>
          <FieldGroup>
            <NameFields control={form.control} idPrefix="mentor" />
            <EmailVerificationField control={form.control} idPrefix="mentor" onVerifiedChange={setEmailVerified} />
            <PasswordFields form={form} idPrefix="mentor" />
          </FieldGroup>
        </FieldSet>

        <LocationSection form={form} idPrefix="mentor" />

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

        <TermsField control={form.control} idPrefix="mentor" links={MENTOR_LINKS} />

        {apiError && <FieldFeedback variant="block-error" message={apiError} />}

        {!emailVerified && (
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 sm:px-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
            <p className="text-sm font-medium">Please verify your email to continue with account creation</p>
          </div>
        )}

        <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isPending || !emailVerified}>
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
