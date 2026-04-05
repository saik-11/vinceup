"use client";

import { Check } from "lucide-react";
import { STEPS } from "./booking-config";

export default function BookingStepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="size-5" /> : stepNum}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  isCompleted
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isActive
                      ? "text-primary"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={`mx-3 h-0.5 w-20 rounded-full transition-colors duration-300 ${
                  isCompleted ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}