import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/composable/Geterrormessage";
import { authApi } from "@/services/service";

export const useSignupMentee = ({ onSuccess, onError } = {}) => {
  return useMutation({
    mutationFn: (data) => authApi.signupMentee(data),
    onSuccess: (response, variables) => {
      onSuccess?.(response.data, variables);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Unable to create account. Please try again.");
      onError?.(message, error);
    },
  });
};
