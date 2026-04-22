export const AUTH_COOKIE_NAME = "auth_token";
export const ROLE_COOKIE_NAME = "role";

export const getAuthCookieOptions = () => {
  return {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
};
