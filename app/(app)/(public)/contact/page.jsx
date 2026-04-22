import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the VinceUP team. We're here to help with any questions about our mentorship platform.",
  openGraph: {
    title: "Contact VinceUP",
    description: "Reach out to the VinceUP team for support or partnership inquiries.",
  },
};


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
