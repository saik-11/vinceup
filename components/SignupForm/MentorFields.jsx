import { Briefcase, Building2, TrendingUp } from "lucide-react";
import { Controller } from "react-hook-form";
import FieldFeedback from "@/components/FieldFeedback";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EXPERIENCE_OPTIONS = [
  { value: "<1",     label: "Less than 1 year" },
  { value: "1 to 3", label: "1 to 3 years" },
  { value: "3 to 5", label: "3 to 5 years" },
  { value: "5 to 10",label: "5 to 10 years" },
  { value: ">10",    label: "More than 10 years" },
];

const MentorFields = ({ control }) => (
  <FieldSet>
    <FieldLegend variant="label" className="flex items-center gap-2">
      <Briefcase className="h-4 w-4" /> Professional Details
    </FieldLegend>
    <FieldGroup>
      {/* Company + Title */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "companyName", label: "Company Name", placeholder: "e.g., Google",          Icon: Building2  },
          { name: "title",       label: "Title",         placeholder: "e.g., Senior Engineer", Icon: Briefcase  },
        ].map(({ name, label, placeholder, Icon }) => (
          <Controller key={name} name={name} control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`su-${name}`}>{label}</FieldLabel>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input {...field} id={`su-${name}`} placeholder={placeholder} className="pl-10" aria-invalid={fieldState.invalid} />
                </div>
                <FieldFeedback variant="error" message={fieldState.error?.message} />
              </Field>
            )}
          />
        ))}
      </div>

      {/* Industry + Sector */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "industry", label: "Industry", placeholder: "e.g., Technology" },
          { name: "sector",   label: "Sector",   placeholder: "e.g., IT" },
        ].map(({ name, label, placeholder }) => (
          <Controller key={name} name={name} control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`su-${name}`}>{label}</FieldLabel>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input {...field} id={`su-${name}`} placeholder={placeholder} className="pl-10" aria-invalid={fieldState.invalid} />
                </div>
                <FieldFeedback variant="error" message={fieldState.error?.message} />
              </Field>
            )}
          />
        ))}
      </div>

      {/* Work Experience */}
      <Controller name="workExperience" control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="su-workExperience">Work Experience</FieldLabel>
            <Select name={field.name} value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="su-workExperience" aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Select your experience" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldFeedback variant="error" message={fieldState.error?.message} />
          </Field>
        )}
      />
    </FieldGroup>
  </FieldSet>
);

export default MentorFields;