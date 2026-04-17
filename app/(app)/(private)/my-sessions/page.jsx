import StatusPage from "@/components/common/StatusPage";

export default function MySessionsPage() {
  return (
    <StatusPage
      badge="Sessions"
      title="Session history is coming soon"
      description="The route now has a proper page shell. Replace it with upcoming sessions, completed sessions, and reschedule flows."
      primaryHref="/book-session"
      primaryLabel="Book a Session"
      secondaryHref="/dashboard"
      secondaryLabel="Back to Dashboard"
    />
  );
}
