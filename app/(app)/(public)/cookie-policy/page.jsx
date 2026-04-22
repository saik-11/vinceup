import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Cookie Policy",
  description: "Learn how VinceUP uses cookies and similar technologies on our platform.",
  robots: { index: true, follow: false },
};


export default function CookiePolicyPage() {
  return (
    <StatusPage
      badge="Legal"
      title="Cookie policy will live here"
      description="The footer no longer lands on a 404. Replace this screen with the final cookie disclosure and consent guidance before launch."
      primaryHref="/"
      primaryLabel="Back Home"
      secondaryHref="/privacy-policy"
      secondaryLabel="Privacy Policy"
    />
  );
}
