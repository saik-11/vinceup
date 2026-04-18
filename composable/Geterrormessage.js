import axios from "axios";

/**
 * Converts an axios error into a user-friendly message.
 * Falls back to a generic message if nothing specific can be inferred.
 */
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  // Server responded with an error status (4xx, 5xx)
  if (error.response) {
    const { status, data } = error.response;

    // Use the server's message if available
    const serverMessage = data?.message || data?.error;
    if (serverMessage && typeof serverMessage === "string") return serverMessage;

    // Handle FastAPI/Pydantic validation errors: { detail: [{ msg, loc, ... }] }
    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((err) => {
          const field = err.loc?.slice(-1)[0]; // last element is the field name
          const msg = err.msg?.replace(/^Value error, /, ""); // clean up Pydantic prefix
          return field && field !== "body" ? `${field}: ${msg}` : msg;
        })
        .join(". ");
    }

    // Handle FastAPI single detail string: { detail: "some message" }
    if (typeof data?.detail === "string") return data.detail;

    // Map common HTTP status codes
    switch (status) {
      case 400:
        return "The request was invalid. Please check your input and try again.";
      case 401:
        return "Invalid email or password. Please try again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "This account already exists. Try signing in instead.";
      case 422:
        return "Please check your input — some fields are invalid.";
      case 429:
        return "Too many attempts. Please wait a moment and try again.";
      case 500:
      case 502:
      case 503:
        return "Our servers are temporarily unavailable. Please try again in a few minutes.";
      default:
        return fallback;
    }
  }

  // Request was made but no response received
  if (error.request) {
    if (!navigator.onLine) {
      return "You appear to be offline. Please check your internet connection and try again.";
    }
    return "Unable to reach the server. Please check your connection and try again.";
  }

  // Request cancelled
  if (axios.isCancel(error)) {
    return "The request was cancelled. Please try again.";
  }

  // Timeout
  if (error.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  return fallback;
};
