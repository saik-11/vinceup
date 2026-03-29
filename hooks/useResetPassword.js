import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/composable/Geterrormessage";
import { authApi } from "@/services/service";

export const useResetPassword = ({ onSuccess, onError } = {}) => {
  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),

    onSuccess: (res, vars) => {
      onSuccess?.(res.data, vars);
    },

    onError: (error) => {
      const message = getErrorMessage(
        error,
        "Unable to reset password. Please try again.",
      );
      onError?.(message, error);
    },
  });
};
