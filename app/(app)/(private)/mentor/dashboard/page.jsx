import StatusPage from "@/components/common/StatusPage";

export default function MentorDashboardPage() {
  return (
    <StatusPage
      badge="Mentor Dashboard"
      title="Mentor dashboard is being built"
      description="This route no longer renders raw placeholder text. Add mentor bookings, earnings, and session management here."
      primaryHref="/dashboard"
      primaryLabel="Open Learner Dashboard"
      secondaryHref="/mentor"
      secondaryLabel="Mentor Overview"
    />
  );
}
