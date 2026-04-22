import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Action Board",
  description: "AI-generated action items and task tracking for your mentorship sessions.",
  robots: { index: false, follow: false },
};


export default function ActionBoardPage() {
  return (
    <StatusPage
      badge="Vega AI"
      title="Action Board is not live yet"
      description="The sidebar link now lands on a valid route. Build the AI-generated action tracking workflow here when the product requirements are ready."
      primaryHref="/dashboard"
      primaryLabel="Back to Dashboard"
    />
  );
}
