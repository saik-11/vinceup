import StatusPage from "@/components/common/StatusPage";

export default function TermsOfServicePage() {
  return (
    <StatusPage
      badge="Legal"
      title="Terms of service will be published here"
      description="This route keeps auth and footer links valid. Replace it with the approved terms content before exposing the app broadly."
      primaryHref="/signup"
      primaryLabel="Back to Signup"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}
