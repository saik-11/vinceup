import ClarityCapsuleClient from "@/components/dashboard/clarity-capsules/ClarityCapsuleClient";

export const metadata = {
  title: "Clarity Capsules | VinceUp",
  description: "VEGA-generated post-session insights for your mentees.",
  robots: { index: false, follow: false },
};

export default function CapsulesPage() {
  return <ClarityCapsuleClient />;
}
