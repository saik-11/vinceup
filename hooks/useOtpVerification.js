import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { getErrorMessage } from "@/composable/Geterrormessage";
import { authApi } from "@/lib/api/service";

export function useOtpVerification() {
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const sendMutation = useMutation({
    mutationFn: (email) => authApi.sendOtp({ email }),
    onSuccess: () => {
      setOtpSent(true);
      setVerified(false);
    },
  });

  const resendMutation = useMutation({
    mutationFn: (email) => authApi.resendOtp({ email }),
    onSuccess: () => {
      setOtpSent(true);
      setVerified(false);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ email, otp }) => authApi.verifyOtp({ email, otp }),
    onSuccess: () => setVerified(true),
  });

  const sendOtp = (email) => {
    sendMutation.reset();
    resendMutation.reset();
    verifyMutation.reset();
    sendMutation.mutate(email);
  };

  const resendOtp = (email) => {
    resendMutation.reset();
    verifyMutation.reset();
    resendMutation.mutate(email);
  };

  const verifyOtp = (email, otp) => verifyMutation.mutate({ email, otp });

  const reset = () => {
    setOtpSent(false);
    setVerified(false);
    sendMutation.reset();
    resendMutation.reset();
    verifyMutation.reset();
  };

  const isSending = sendMutation.isPending || resendMutation.isPending;
  const sendError = sendMutation.error || resendMutation.error;

  return {
    otpSent,
    verified,
    isSending,
    isVerifying: verifyMutation.isPending,
    sendError: sendError
      ? getErrorMessage(sendError, "Failed to send OTP. Please try again.")
      : null,
    verifyError: verifyMutation.error
      ? getErrorMessage(verifyMutation.error, "Invalid OTP. Please try again.")
      : null,
    sendOtp,
    resendOtp,
    verifyOtp,
    reset,
  };
}
