import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Clarity Capsule",
  description: "AI-powered session summaries and key takeaways from your mentorship sessions.",
  robots: { index: false, follow: false },
};


export default function ClarityCapsulePage() {
  return (
    <StatusPage
      badge="Vega AI"
      title="Clarity Capsule is being prepared"
      description="This route keeps the sidebar coherent while the feature is under construction."
      primaryHref="/dashboard"
      primaryLabel="Back to Dashboard"
    />
  );
}
