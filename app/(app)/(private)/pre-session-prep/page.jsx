import PreSessionPrepClient from "@/components/dashboard/pre-session-prep/PreSessionPrepClient";

export const metadata = {
  title: "Pre-Session Prep",
  description: "VEGA-powered preparation for your upcoming mentorship sessions.",
  robots: { index: false, follow: false },
};

export default function PreSessionPrepPage() {
  return <PreSessionPrepClient />;
}
