"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Controller } from "react-hook-form";

import FieldFeedback from "@/components/FieldFeedback";
import { Checkbox } from "@/components/ui/checkbox";

export const MENTEE_LINKS = [
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

export const MENTOR_LINKS = [
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/mentor-guidelines", label: "Mentor Guidelines" },
];

function PolicyLink({ href, children }) {
  return (
    <Link href={href} className="font-medium text-primary hover:underline">
      {children}
    </Link>
  );
}

function LinkList({ links }) {
  if (links.length === 1) {
    return <PolicyLink href={links[0].href}>{links[0].label}</PolicyLink>;
  }
  return links.map((link, i) => (
    <Fragment key={link.href}>
      {i > 0 && (i === links.length - 1 ? (links.length > 2 ? ", and " : " and ") : ", ")}
      <PolicyLink href={link.href}>{link.label}</PolicyLink>
    </Fragment>
  ));
}

export function TermsField({ control, idPrefix, links = MENTEE_LINKS }) {
  return (
    <Controller
      name="terms"
      control={control}
      rules={{ validate: (v) => v === true || "You must accept the terms to continue" }}
      render={({ field, fieldState }) => (
        <div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${idPrefix}-terms`}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <label htmlFor={`${idPrefix}-terms`} className="text-sm cursor-pointer select-none">
              I agree to the <LinkList links={links} />
            </label>
          </div>
          <FieldFeedback variant="error" message={fieldState.error?.message} />
        </div>
      )}
    />
  );
}
