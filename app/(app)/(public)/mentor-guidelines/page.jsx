import StatusPage from "@/components/common/StatusPage";

export default function MentorGuidelinesPage() {
  return (
    <StatusPage
      badge="Mentor Program"
      title="Mentor guidelines are being prepared"
      description="This route keeps the mentor application flow coherent while the formal guidelines are finalized. Publish the reviewed mentor playbook here."
      primaryHref="/mentor-signup"
      primaryLabel="Return to Mentor Signup"
      secondaryHref="/become-a-mentor"
      secondaryLabel="Mentor Program"
    />
  );
}
