import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/composable/Geterrormessage";
import { authApi } from "@/services/service";

export const useForgotPassword = ({ onSuccess, onError } = {}) => {
  return useMutation({
    mutationFn: (data) => authApi.forgotPassword(data),

    onSuccess: (response, variables) => {
      onSuccess?.(response.data, variables);
    },

    onError: (error) => {
      const message = getErrorMessage(error, "Unable to send reset email. Please try again.");

      onError?.(message, error);
    },
  });
};
