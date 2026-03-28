import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/composable/Geterrormessage";
import { authApi } from "@/services/service";

export const useLogin = ({ onSuccess, onError } = {}) => {
  return useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response, variables) => {
      onSuccess?.(response.data, variables);
    },
    onError: (error) => {
      const message = getErrorMessage(
        error,
        "Unable to sign in. Please try again.",
      );
      onError?.(message, error);
    },
  });
};
