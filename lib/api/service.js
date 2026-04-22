import apiClient from "./apiClient";

export const authApi = {
  signupMentee: (data) => apiClient.post("auth/signup/mentee", data),
  signupMentor: (data) => apiClient.post("auth/signup/mentor", data),
  login: (data) => apiClient.post("auth/login", data),
  forgotPassword: (data) => apiClient.post("auth/forgot-password", data),
  resetPassword: (data) => apiClient.post("auth/reset-password", data),
};

export const mentorApi = {
  getAvailability: () => apiClient.get("mentor/availability"),
  createAvailability: (payload) => apiClient.post("mentor/availability", payload),
  deleteAvailability: (slotId) => apiClient.delete("mentor/availability/" + slotId),
  getDashboard: (timezone = "UTC") => apiClient.get("mentor/dashboard"),
  getTransactions: (timezone = "UTC") => apiClient.get("mentor/transactions"),
  getPastSessions: (timezone = "UTC") => apiClient.get("mentor/past-sessions"),
  getRatings: () => apiClient.get("mentor/ratings"),
  getSessions: (timezone = "UTC") => apiClient.get("mentor/sessions"),
  acceptSession: (bookingId) => apiClient.post("mentor/sessions/" + bookingId + "/accept"),
  declineSession: (bookingId, payload = {}) => apiClient.post("mentor/sessions/" + bookingId + "/decline", payload),
  markCompleted: (bookingId) => apiClient.post("mentor/sessions/" + bookingId + "/mark-completed"),
  markNoShow: (bookingId) => apiClient.post("mentor/sessions/" + bookingId + "/mark-noshow"),
};
