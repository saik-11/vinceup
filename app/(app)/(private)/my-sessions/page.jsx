import { getServerRole } from "@/lib/auth/serverAuth";
import MenteeSessions from "./MenteeSessions";
import MentorSessions from "./MentorSessions";

export const metadata = {
  title: "Session Management",
  description: "Manage mentorship sessions and requests.",
  robots: { index: false, follow: false },
};

export default async function MySessions() {
  const role = await getServerRole();

  const roleComponents = {
    mentee: MenteeSessions,
    mentor: MentorSessions,
  };

  const Component = role in roleComponents ? roleComponents[role] : null;

  return <>{Component ? <Component /> : null}</>;
}
