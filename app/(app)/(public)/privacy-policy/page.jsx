import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Privacy Policy",
  description: "Read VinceUP's privacy policy to understand how we collect, use, and protect your personal data.",
  robots: { index: true, follow: false },
};


export default function PrivacyPolicyPage() {
  return (
    <StatusPage
      badge="Legal"
      title="Privacy policy publishing is in progress"
      description="This route now exists so the legal links are valid. Replace this placeholder with the approved privacy policy copy before production release."
      primaryHref="/signup"
      primaryLabel="Back to Signup"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}
