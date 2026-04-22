import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Terms of Service",
  description: "Read VinceUP's terms of service governing the use of our mentorship platform and services.",
  robots: { index: true, follow: false },
};


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
