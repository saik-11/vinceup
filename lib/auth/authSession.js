export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_REFRESH_TOKEN_KEY = "auth_refresh";
export const AUTH_USER_KEY = "auth_user";
export const AUTH_SESSION_META_KEY = "auth_session";

export const getAuthCookieOptions = (expiresInSeconds) => {
  const options = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };
  
  if (expiresInSeconds) {
    const sec = Number(expiresInSeconds);
    if (!isNaN(sec)) {
      options.expires = sec / 86400; // js-cookie expects number of days
    }
  }
  
  return options;
};
