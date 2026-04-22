import Cookies from "js-cookie";
import {
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_SESSION_META_KEY,
  getAuthCookieOptions,
} from "./authSession";

export const authStorage = {
  getToken: () => Cookies.get(AUTH_TOKEN_KEY),
  getRefreshToken: () => Cookies.get(AUTH_REFRESH_TOKEN_KEY),
  getUser: () => {
    const userStr = Cookies.get(AUTH_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
  getSessionMeta: () => {
    const metaStr = Cookies.get(AUTH_SESSION_META_KEY);
    if (!metaStr) return null;
    try {
      return JSON.parse(metaStr);
    } catch (e) {
      return null;
    }
  },

  setAuthData: (loginResponse) => {
    // Determine expiration from response, fallback to 1 day (86400 seconds) if not provided
    const expiresInSeconds = loginResponse.expires_in || 86400;
    // Add a 24-hour buffer to the actual browser cookie so it doesn't vanish automatically
    // before the user can see the "Session Expired" popup.
    const options = getAuthCookieOptions(expiresInSeconds + 86400);

    // auth_token
    const token = loginResponse.access_token || loginResponse.token;
    if (token) {
      Cookies.set(AUTH_TOKEN_KEY, token, options);
    }
    // auth_refresh
    const refreshToken = loginResponse.refresh_token || loginResponse.refreshToken;
    if (refreshToken) {
      Cookies.set(AUTH_REFRESH_TOKEN_KEY, refreshToken, options);
    }
    // auth_user
    if (loginResponse.user) {
      const { id, email, role, first_name, timezone } = loginResponse.user;
      const userObj = { id, email, role, first_name, timezone };
      Cookies.set(AUTH_USER_KEY, JSON.stringify(userObj), options);
    }
    // auth_session
    if (loginResponse.expires_in) {
      const login_time = Date.now();
      const expires_at = login_time + loginResponse.expires_in * 1000;
      const sessionMeta = {
        expires_in: loginResponse.expires_in,
        login_time,
        expires_at,
      };
      Cookies.set(AUTH_SESSION_META_KEY, JSON.stringify(sessionMeta), options);
    }
  },

  clearAuthData: () => {
    const options = getAuthCookieOptions();
    // remove maxAge and expires just in case, js-cookie handles the removal by setting expires to past date
    delete options.maxAge;
    delete options.expires;

    Cookies.remove(AUTH_TOKEN_KEY, options);
    Cookies.remove(AUTH_REFRESH_TOKEN_KEY, options);
    Cookies.remove(AUTH_USER_KEY, options);
    Cookies.remove(AUTH_SESSION_META_KEY, options);
    // Cleanup any legacy or stray stuff
    Cookies.remove("role", options);
    try {
      localStorage.removeItem("role");
    } catch (e) {}
  },
};
