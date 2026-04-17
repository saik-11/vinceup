import StatusPage from "@/components/common/StatusPage";

export default function HelpPage() {
  return (
    <StatusPage
      badge="Support"
      title="Help center content is on the way"
      description="This route replaces a dead navigation target. Add FAQs, support contact details, and troubleshooting content here."
      primaryHref="/dashboard"
      primaryLabel="Back to Dashboard"
      secondaryHref="/contact"
      secondaryLabel="Contact Page"
    />
  );
}
