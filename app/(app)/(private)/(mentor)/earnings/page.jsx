import EarningsClient from "@/components/dashboard/earnings/EarningsClient";

export const metadata = {
  title: "Earnings | VinceUp",
  description: "Track your mentorship income and payouts.",
  robots: { index: false, follow: false },
};

export default function EarningsPage() {
  return <EarningsClient />;
}
