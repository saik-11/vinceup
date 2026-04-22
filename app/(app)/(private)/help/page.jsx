import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Help Center",
  description: "Find answers, FAQs, and support resources for your VinceUP account.",
  robots: { index: false, follow: false },
};


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
