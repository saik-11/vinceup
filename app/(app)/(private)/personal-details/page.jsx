import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Personal Details",
  description: "Manage your personal profile information on VinceUP.",
  robots: { index: false, follow: false },
};


export default function PersonalDetailsPage() {
  return (
    <StatusPage
      badge="Account"
      title="Personal details will be editable here"
      description="This screen is a stable destination for the account menu until the real profile editor is implemented."
      primaryHref="/dashboard"
      primaryLabel="Back to Dashboard"
      secondaryHref="/settings"
      secondaryLabel="Settings"
    />
  );
}
