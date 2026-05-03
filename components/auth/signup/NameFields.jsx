"use client";

import { Controller } from "react-hook-form";

import FieldFeedback from "@/components/FieldFeedback";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function NameFields({ control, idPrefix }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Controller
        name="first_name"
        control={control}
        rules={{
          required: "Please enter your first name",
          maxLength: { value: 50, message: "First name is too long" },
        }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`${idPrefix}-first-name`}>First name</FieldLabel>
            <Input
              {...field}
              id={`${idPrefix}-first-name`}
              placeholder="John"
              aria-invalid={fieldState.invalid}
              autoComplete="given-name"
            />
            <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />
          </Field>
        )}
      />
      <Controller
        name="last_name"
        control={control}
        rules={{
          required: "Please enter your last name",
          maxLength: { value: 50, message: "Last name is too long" },
        }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`${idPrefix}-last-name`}>Last name</FieldLabel>
            <Input
              {...field}
              id={`${idPrefix}-last-name`}
              placeholder="Doe"
              aria-invalid={fieldState.invalid}
              autoComplete="family-name"
            />
            <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />
          </Field>
        )}
      />
    </div>
  );
}
