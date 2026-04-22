/**
 * Centralized route constants.
 * Use these instead of hardcoding strings throughout the app.
 * This makes refactoring routes trivial â€” change here, everything updates.
 */

// â”€â”€â”€ Public routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  SERVICE: "/service",
  BECOME_MENTOR: "/become-a-mentor",
  MENTOR_GUIDELINES: "/mentor-guidelines",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  COOKIE_POLICY: "/cookie-policy",

  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  MENTOR_SIGNUP: "/mentor-signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Private (dashboard)
  DASHBOARD: "/dashboard",
  MENTOR_CALENDAR: "/mentor-calendar",
  MY_SESSIONS: "/my-sessions",
  ACTION_BOARD: "/action-board",
  CLARITY_CAPSULE: "/clarity-capsule",
  CLARITY_MAP: "/clarity-map",
  GROWTH_METER: "/growth-meter",
  PERSONAL_DETAILS: "/personal-details",
  PURCHASE_HISTORY: "/purchase-history",
  SETTINGS: "/settings",
  HELP: "/help",

  // Bookings
  BOOK_SESSION: "/book-session",
};

