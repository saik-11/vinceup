"use client";

import { Fragment } from "react";
import { Check } from "lucide-react";
import { STEPS } from "./booking-config";

export default function BookingStepIndicator({ currentStep }) {
  return (
    <nav aria-label="Booking progress" className="mx-auto w-full max-w-[760px] px-4">
      <div className="grid grid-cols-[1fr_120px_1fr_120px_1fr] items-start max-sm:grid-cols-[1fr_48px_1fr_48px_1fr]">
        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <Fragment key={step.label}>
              <div className="flex min-w-0 flex-col items-center text-center">
                <div
                  className={`flex size-10 items-center justify-center rounded-full text-sm font-bold ${
                    isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check className="size-5" /> : stepNum}
                </div>
                <span className={`mt-2 max-w-40 truncate text-sm font-medium max-sm:text-xs ${isActive ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}>
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && <div className={`mt-5 h-1 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800"}`} />}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}
