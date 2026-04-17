import StatusPage from "@/components/common/StatusPage";

export default function BecomeMentorPage() {
  return (
    <StatusPage
      badge="Mentor Program"
      title="Mentor applications are opening here"
      description="The dedicated mentor-application landing page is still being finalized. You can already start the application flow from the mentor signup screen."
      primaryHref="/mentor-signup"
      primaryLabel="Start Mentor Signup"
      secondaryHref="/mentor"
      secondaryLabel="Browse Mentor Area"
    />
  );
}
