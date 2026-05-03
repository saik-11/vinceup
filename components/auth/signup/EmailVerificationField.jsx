"use client";

import { Check, Loader2, Mail, Pencil } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Controller, useWatch } from "react-hook-form";

import FieldFeedback from "@/components/FieldFeedback";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useOtpVerification } from "@/hooks/useOtpVerification";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_LENGTH = 6;
const RESEND_DELAY_SECONDS = 30;

export function EmailVerificationField({ control, idPrefix, onVerifiedChange }) {
  const [otp, setOtp] = useState("");
  const emailValue = useWatch({ control, name: "email" }) ?? "";
  const isEmailValid = EMAIL_RX.test(emailValue);
  const [countdown, setCountdown] = useState(0);

  const { otpSent, verified, isSending, isVerifying, sendError, verifyError, sendOtp, resendOtp, verifyOtp, reset } = useOtpVerification();

  useEffect(() => {
    onVerifiedChange?.(verified);
  }, [verified, onVerifiedChange]);

  useEffect(() => {
    let timer;
    if (otpSent && !verified && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, verified, countdown]);

  const handleSendOtp = () => {
    sendOtp(emailValue);
    setCountdown(RESEND_DELAY_SECONDS);
  };

  const handleResendOtp = () => {
    resendOtp(emailValue);
    setCountdown(RESEND_DELAY_SECONDS);
  };

  const handleVerifyOtp = () => {
    if (otp.length === OTP_LENGTH) verifyOtp(emailValue, otp);
  };

  const handleEditEmail = () => {
    reset();
    setOtp("");
    setCountdown(0);
  };

  return (
    <div className="space-y-3">
      {otpSent && !verified ? (
        <div className="space-y-2">
          <FieldLabel>Email</FieldLabel>
          <div className="rounded-lg border-2 border-blue-200 bg-[#f4f8ff] dark:bg-blue-950/20 dark:border-blue-900 p-4 sm:p-5 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex gap-2.5 text-blue-600 dark:text-blue-400">
                <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-blue-800 dark:text-blue-300">OTP sent to your email</span>
                  <span className="text-[13px]">{emailValue}</span>
                </div>
              </div>
              <button type="button" onClick={handleEditEmail} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" aria-label="Edit email">
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter {OTP_LENGTH}-digit OTP</label>
              <div className="flex justify-center w-full mx-auto">
                <InputOTP maxLength={OTP_LENGTH} value={otp} onChange={setOtp} onComplete={handleVerifyOtp}>
                  <div className="flex gap-2 sm:gap-3 justify-between w-full">
                    {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-10 sm:size-11.5 rounded-lg border border-gray-300 bg-white dark:bg-transparent dark:border-gray-600 text-lg shadow-sm"
                      />
                    ))}
                  </div>
                </InputOTP>
              </div>
              {verifyError && <FieldFeedback variant="error" message={verifyError} />}
            </div>

            <Button type="button" className="w-full bg-[#4F46E5] hover:bg-[#4338ca] text-white transition-colors" disabled={otp.length !== OTP_LENGTH || isVerifying} onClick={handleVerifyOtp}>
              {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify OTP"}
            </Button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {countdown > 0 ? (
                <span>Resend OTP in {countdown}s</span>
              ) : (
                <button type="button" onClick={handleResendOtp} disabled={isSending} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium transition-colors disabled:opacity-50">
                  {isSending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Please enter your email address",
            pattern: { value: EMAIL_RX, message: "That doesn't look like a valid email" },
          }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${idPrefix}-email`}>Email</FieldLabel>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id={`${idPrefix}-email`}
                    type="email"
                    placeholder="your@email.com"
                    className={`pl-10 transition-colors ${verified ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 dark:border-emerald-500/50" : ""}`}
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                    onChange={(e) => {
                      field.onChange(e);
                      if (otpSent || verified) {
                        reset();
                        setOtp("");
                        setCountdown(0);
                      }
                    }}
                    readOnly={verified}
                  />
                </div>

                {verified ? (
                  <Button type="button" variant="outline" className="shrink-0 px-3 w-10 border-gray-200 dark:border-gray-700" onClick={handleEditEmail} aria-label="Edit email">
                    <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                ) : (
                  <Button type="button" className="shrink-0 bg-[#4F46E5] hover:bg-[#4338ca] text-white border-transparent" disabled={!isEmailValid || isSending} onClick={handleSendOtp}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                  </Button>
                )}
              </div>
              
              {verified && (
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-500 mt-1.5">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Email verified successfully</span>
                </div>
              )}
              
              {!verified && <FieldFeedback variant={fieldState.invalid ? "error" : "hint"} message={fieldState.error?.message} />}
              {sendError && !verified && <FieldFeedback variant="error" message={sendError} />}
            </Field>
          )}
        />
      )}
    </div>
  );
}
