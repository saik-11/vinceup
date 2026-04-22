import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Clarity Map",
  description: "Visual career roadmap and planning tool powered by your mentorship sessions.",
  robots: { index: false, follow: false },
};


export default function ClarityMapPage() {
  return (
    <StatusPage
      badge="Vega AI"
      title="Clarity Map is being prepared"
      description="The navigation target is now valid. Add the visual planning experience here when the supporting data model is ready."
      primaryHref="/dashboard"
      primaryLabel="Back to Dashboard"
    />
  );
}
