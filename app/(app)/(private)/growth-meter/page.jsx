import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Growth Meter",
  description: "Track your career progress and milestones across your mentorship journey.",
  robots: { index: false, follow: false },
};


export default function GrowthMeterPage() {
  return (
    <StatusPage
      badge="Vega AI"
      title="Growth Meter is not available yet"
      description="This route replaces another dead sidebar link. Wire it to real progress metrics when the analytics model is implemented."
      primaryHref="/dashboard"
      primaryLabel="Back to Dashboard"
    />
  );
}
