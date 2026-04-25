import { cookies } from "next/headers";
import { AUTH_USER_KEY } from "./authSession";

/**
 * getServerUser()
 * 
 * Safely parses the auth_user cookie on the server-side.
 * Returns the user object or null if not found/invalid.
 */
export async function getServerUser() {
  const cookieStore = await cookies();
  const authUserCookie = cookieStore.get(AUTH_USER_KEY)?.value;
  
  if (!authUserCookie) return null;
  
  try {
    return JSON.parse(decodeURIComponent(authUserCookie));
  } catch (e) {
    return null;
  }
}

/**
 * getServerRole()
 * 
 * Returns the current user's role on the server-side.
 */
export async function getServerRole() {
  const user = await getServerUser();
  return user?.role || null;
}
