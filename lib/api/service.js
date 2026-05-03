import apiClient from "./apiClient";

export const authApi = {
  signupMentee: (data) => apiClient.post("auth/signup/mentee", data),
  signupMentor: (data) => apiClient.post("auth/signup/mentor", data),
  login: (data) => apiClient.post("auth/login", data),
  forgotPassword: (data) => apiClient.post("auth/forgot-password", data),
  resetPassword: (data) => apiClient.post("auth/reset-password", data),
  sendOtp: (data) => apiClient.post("auth/send-otp", data),
  resendOtp: (data) => apiClient.post("auth/resend-otp", data),
  verifyOtp: (data) => apiClient.post("auth/verify-otp", data),
};

export const mentorApi = {
  getAvailability: () => apiClient.get("/mentor/availability"),
  createAvailability: (payload) => apiClient.post("/mentor/availability", payload),
  deleteAvailability: (slotId) => apiClient.delete("/mentor/availability/" + slotId),
  getDashboard: (timezone = "UTC") => apiClient.get("/mentor/dashboard"),
  getTransactions: (timezone = "UTC") => apiClient.get("/mentor/transactions"),
  getPastSessions: (timezone = "UTC") => apiClient.get("/mentor/past-sessions"),
  getRatings: () => apiClient.get("/mentor/ratings"),
  getSessions: (timezone = "UTC") => apiClient.get("/mentor/sessions"),
  acceptSession: (bookingId) => apiClient.post("/mentor/sessions/" + bookingId + "/accept"),
  declineSession: (bookingId, payload = {}) => apiClient.post("/mentor/sessions/" + bookingId + "/decline", payload),
  markCompleted: (bookingId) => apiClient.post("/mentor/sessions/" + bookingId + "/mark-completed"),
  markNoShow: (bookingId) => apiClient.post("/mentor/sessions/" + bookingId + "/mark-noshow"),
};

export const menteeApi = {
  getBookingAvailableMentors: (params, config = {}) => apiClient.get("/booking/available-mentors", { params, ...config }),
  getMenteeBookings: () => apiClient.get("/booking/my-bookings"),
  createSessionBooking: (body) => apiClient.post("/booking/book", body),
};

export const livekitApi = {
  getToken: (payload) => apiClient.post("/sessions/livekit/token", payload),
};

// temp
export const paySimulation = {
  paidedSimulation: (bookingId) => apiClient.post(`booking/${bookingId}/dev-simulate-payment`),
};
