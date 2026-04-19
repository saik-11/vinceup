// import apiClient from "@/lib/apiClient";
import axios from "axios";
import apiClient from "./Apiclient";

// const AUTH_BASE = "https://vinceup-dev.onrender.com/auth";

export const authApi = {
  signupMentee: (data) => apiClient.post(`auth/signup/mentee`, data),
  signupMentor: (data) => apiClient.post(`auth/signup/mentor`, data),
  login: (data) => axios.post(`/api/auth/login`, data, { withCredentials: true }),
  forgotPassword: (data) => apiClient.post(`auth/forgot-password`, data),
  resetPassword: (data) => apiClient.post(`auth/reset-password`, data),
};

export const mentorApi = {
  // 1. Availability
  getAvailability: () => apiClient.get(`mentor/availability`),
  createAvailability: (payload) => apiClient.post(`mentor/availability`, payload),
  deleteAvailability: (slotId) => apiClient.delete(`mentor/availability/${slotId}`),
  // 2. Dashboard
  getDashboard: (timezone = "UTC") => apiClient.get(`mentor/dashboard`),
  // 3. Transactions
  getTransactions: (timezone = "UTC") => apiClient.get(`mentor/transactions`),
  // 4. Past Sessions
  getPastSessions: (timezone = "UTC") => apiClient.get(`mentor/past-sessions`),
  // 5. Ratings
  getRatings: () => apiClient.get(`mentor/ratings`),
  // 6. Sessions
  getSessions: (timezone = "UTC") => apiClient.get(`mentor/sessions`),
  // 7. Accept Booking Request
  acceptSession: (bookingId) => apiClient.post(`mentor/sessions/${bookingId}/accept`),
  // 8. Decline Booking Request
  declineSession: (bookingId, payload = {}) => apiClient.post(`mentor/sessions/${bookingId}/decline`, payload),
  // 9. Mark Session Completed
  markCompleted: (bookingId) => apiClient.post(`mentor/sessions/${bookingId}/mark-completed`),
  // 10. Mark Session No Show
  markNoShow: (bookingId) => apiClient.post(`mentor/sessions/${bookingId}/mark-noshow`),
};
