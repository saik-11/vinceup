import StatusPage from "@/components/common/StatusPage";

export default function MentorPage() {
  return (
    <StatusPage
      badge="Mentors"
      title="Mentor discovery is still under construction"
      description="The route now presents a proper shell instead of a raw text node. Replace it with mentor search, filters, and profile cards."
      primaryHref="/book-session"
      primaryLabel="Book a Session"
      secondaryHref="/about"
      secondaryLabel="Learn More"
    />
  );
}
