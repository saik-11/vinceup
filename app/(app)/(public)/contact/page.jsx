import StatusPage from "@/components/common/StatusPage";

export default function ContactPage() {
  return (
    <StatusPage
      badge="Contact"
      title="Talk to the VinceUp team"
      description="The contact workflow is being wired into the product. Until the full support flow is live, use the About page and shared onboarding channels for updates."
      primaryHref="/about"
      primaryLabel="Visit About"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}
