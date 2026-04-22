import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Services",
  description: "Explore the full range of mentorship services offered on VinceUP, from 1:1 sessions to AI-powered career tools.",
  openGraph: {
    title: "VinceUP Services",
    description: "Discover 1:1 mentorship, AI session summaries, and structured career roadmaps.",
  },
};


export default function ServicesPage() {
  return (
    <StatusPage
      badge="Services"
      title="Service catalog is being assembled"
      description="This page now renders a stable shell instead of raw placeholder text. Replace it with the real service list, pricing, and conversion paths."
      primaryHref="/mentor"
      primaryLabel="Explore Mentors"
      secondaryHref="/book-session"
      secondaryLabel="Book a Session"
    />
  );
}
