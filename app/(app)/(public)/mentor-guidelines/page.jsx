import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Mentor Guidelines",
  description: "Understand VinceUP's mentor guidelines, quality standards, and community expectations.",
  robots: { index: true, follow: true },
};


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
