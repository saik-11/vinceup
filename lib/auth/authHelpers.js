import { authStorage } from "./authStorage";

export const authHelpers = {
  isSessionExpired: () => {
    const meta = authStorage.getSessionMeta();
    if (!meta || !meta.expires_at) return false; // If no meta, can't reliably say it's expired based on time. We'll rely on token presence or 401s.
    return Date.now() > meta.expires_at;
  },

  isAuthenticated: () => {
    const token = authStorage.getToken();
    if (!token) return false;
    return !authHelpers.isSessionExpired();
  },

  loginUser: (loginResponse) => {
    authStorage.setAuthData(loginResponse);
  },

  logoutUser: () => {
    authStorage.clearAuthData();
  },

  getSyncData: () => {
    return {
      token: authStorage.getToken(),
      user: authStorage.getUser(),
      meta: authStorage.getSessionMeta(),
    };
  },
};
