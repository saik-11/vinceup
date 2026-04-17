import StatusPage from "@/components/common/StatusPage";

export default function PurchaseHistoryPage() {
  return (
    <StatusPage
      badge="Billing"
      title="Purchase history is coming soon"
      description="The account menu now points to a real page. Wire this route to invoices, receipts, and order history when billing data is available."
      primaryHref="/dashboard"
      primaryLabel="Back to Dashboard"
      secondaryHref="/settings"
      secondaryLabel="Settings"
    />
  );
}
