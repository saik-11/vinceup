import StatusPage from "@/components/common/StatusPage";

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
