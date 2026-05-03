"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Controller, useWatch } from "react-hook-form";

import FieldFeedback from "@/components/FieldFeedback";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function PasswordFields({ form, idPrefix }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const { control } = form;
  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const confirmValue = useWatch({ control, name: "confirmPassword" }) ?? "";

  const checks = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /\d/.test(passwordValue),
    special: /[@$!%*?&#]/.test(passwordValue),
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Please create a password",
          minLength: { value: 8 },
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
            <FieldLabel htmlFor={`${idPrefix}-password`}>Password</FieldLabel>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                id={`${idPrefix}-password`}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-9"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                onFocus={() => setShowHints(true)}
                onBlur={(e) => {
                  field.onBlur(e);
                  if (!fieldState.error?.message) setTimeout(() => setShowHints(false), 150);
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
            {(showHints || !!fieldState.error?.message) && (
              <div className="space-y-1">
                <FieldFeedback variant={checks.length ? "success" : "error"} message="At least 8 characters" />
                <FieldFeedback variant={checks.lowercase ? "success" : "error"} message="1 lowercase letter" />
                <FieldFeedback variant={checks.uppercase ? "success" : "error"} message="1 uppercase letter" />
                <FieldFeedback variant={checks.number ? "success" : "error"} message="1 number" />
                <FieldFeedback variant={checks.special ? "success" : "error"} message="1 special character" />
              </div>
            )}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Please confirm your password",
          validate: (v) => v === form.getValues("password") || "Passwords don't match",
        }}
        render={({ field, fieldState }) => {
          const showSuccess =
            fieldState.isTouched && confirmValue && passwordValue === confirmValue && !fieldState.error;
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${idPrefix}-confirm`}>Confirm Password</FieldLabel>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  {...field}
                  id={`${idPrefix}-confirm`}
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
  );
}
