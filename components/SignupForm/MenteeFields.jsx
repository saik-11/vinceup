import { Briefcase, GraduationCap } from "lucide-react";
import { Controller } from "react-hook-form";
import FieldFeedback from "@/components/FieldFeedback";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const MenteeFields = ({ control, form }) => {
  const occupation = form.watch("occupation");

  return (
    <FieldSet>
      <FieldLegend variant="label" className="flex items-center gap-2">
        <Briefcase className="h-4 w-4" /> Current Occupation
      </FieldLegend>
      <FieldGroup>
        {/* Occupation radio */}
        <Controller
          name="occupation"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>I am a</FieldLabel>
              <RadioGroup
                name={field.name}
                value={field.value || ""}
                onValueChange={(val) => {
                  field.onChange(val);
                  if (val === "student")
                    form.setValue("yearsOfExperience", "", {
                      shouldValidate: true,
                    });
                }}
                className="flex items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="working_professional"
                    id="su-professional"
                    aria-invalid={fieldState.invalid}
                  />
                  <label
                    htmlFor="su-professional"
                    className="text-sm cursor-pointer"
                  >
                    Working Professional
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="student"
                    id="su-student"
                    aria-invalid={fieldState.invalid}
                  />
                  <label
                    htmlFor="su-student"
                    className="text-sm cursor-pointer"
                  >
                    Student
                  </label>
                </div>
              </RadioGroup>
              <FieldFeedback
                variant="error"
                message={fieldState.error?.message}
              />
            </Field>
          )}
        />

        {/* Experience (conditional) */}
        {occupation === "working_professional" && (
          <Controller
            name="yearsOfExperience"
            control={control}
            render={({ field, fieldState }) => {
              const error =
                fieldState.error || form.formState.errors.yearsOfExperience;
              return (
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="su-experience">
                    Work Experience
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    onOpenChange={(open) => !open && field.onBlur()}
                  >
                    <SelectTrigger id="su-experience" aria-invalid={!!error}>
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

        {/* Education */}
        <Controller
          name="highestEducation"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="su-education">
                <GraduationCap className="inline h-4 w-4 mr-1" /> Highest
                Education
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="su-education"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldFeedback
                variant="error"
                message={fieldState.error?.message}
              />
            </Field>
          )}
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default MenteeFields;
