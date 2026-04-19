// Server Component — owns metadata, delegates rendering to the client component.
import { MentorCalendarContent } from "./MentorCalendarContent";

export const metadata = {
  title: "Calendar | Vinceup",
  description: "Manage your availability and bookings as a mentor.",
};

export default function MentorCalendarPage() {
  return <MentorCalendarContent />;
}
