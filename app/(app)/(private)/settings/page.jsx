import StatusPage from "@/components/common/StatusPage";

export default function SettingsPage() {
  return (
    <StatusPage
      badge="Account"
      title="Settings are being built"
      description="The route now resolves correctly for authenticated users. Replace this shell with profile, notification, and security settings when those flows are ready."
      primaryHref="/dashboard"
      primaryLabel="Back to Dashboard"
    />
  );
}
