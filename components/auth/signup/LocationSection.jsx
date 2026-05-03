"use client";

import { MapPin } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";

import FieldFeedback from "@/components/FieldFeedback";
import { CitySelect, CountrySelect, StateSelect } from "@/components/shared/LocationPicker";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";

export function LocationSection({ form, idPrefix }) {
  const { control, setValue } = form;
  const countryValue = useWatch({ control, name: "country" });
  const stateValue = useWatch({ control, name: "state" });

  return (
    <FieldSet>
      <FieldLegend variant="label" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" /> Location
      </FieldLegend>
      <div className="grid grid-cols-3 gap-3">
        <Controller
          name="country"
          control={control}
          rules={{ required: "Please select your country" }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${idPrefix}-country`}>Country</FieldLabel>
              <CountrySelect
                id={`${idPrefix}-country`}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("state", "", { shouldValidate: true });
                  setValue("city", "", { shouldValidate: true });
                }}
                placeholder="e.g., US"
              />
              <FieldFeedback variant="error" message={fieldState.error?.message} />
            </Field>
          )}
        />
        <Controller
          name="state"
          control={control}
          rules={{ required: "Please enter your state" }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${idPrefix}-state`}>Province/State</FieldLabel>
              <StateSelect
                id={`${idPrefix}-state`}
                countryName={countryValue}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("city", "", { shouldValidate: true });
                }}
                placeholder="e.g., California"
              />
              <FieldFeedback variant="error" message={fieldState.error?.message} />
            </Field>
          )}
        />
        <Controller
          name="city"
          control={control}
          rules={{ required: "Please enter your city" }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${idPrefix}-city`}>City</FieldLabel>
              <CitySelect
                id={`${idPrefix}-city`}
                countryName={countryValue}
                stateName={stateValue}
                value={field.value}
                onChange={field.onChange}
                placeholder="e.g., San Francisco"
              />
              <FieldFeedback variant="error" message={fieldState.error?.message} />
            </Field>
          )}
        />
      </div>
    </FieldSet>
  );
}
