import StatusPage from "@/components/common/StatusPage";

export const metadata = {
  title: "Become a Mentor",
  description: "Apply to join the VinceUP mentor network. Share your expertise, set your own rates, and make a real difference in someone's career.",
  keywords: ["become a mentor", "mentor application", "mentor program", "career coaching"],
  openGraph: {
    title: "Become a Mentor at VinceUP",
    description: "Turn your experience into impact. Join 500+ vetted experts on our mentorship platform.",
  },
};


export default function BecomeMentorPage() {
  return (
    <StatusPage
      badge="Mentor Program"
      title="Mentor applications are opening here"
      description="The dedicated mentor-application landing page is still being finalized. You can already start the application flow from the mentor signup screen."
      primaryHref="/mentor-signup"
      primaryLabel="Start Mentor Signup"
      secondaryHref="/mentor"
      secondaryLabel="Browse Mentor Area"
    />
  );
}
