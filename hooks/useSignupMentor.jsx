import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/composable/Geterrormessage";
import { authApi } from "@/services/service";

export const useSignupMentor = ({ onSuccess, onError } = {}) => {
  return useMutation({
    mutationFn: (data) => authApi.signupMentor(data),
    onSuccess: (response, variables) => {
      onSuccess?.(response.data, variables);
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Unable to submit application. Please try again.");
      onError?.(message, error);
    },
  });
};
