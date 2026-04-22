import AboutContent from "./AboutContent";

export const metadata = {
  title: "About Us",
  description: "Learn about VinceUP mission to democratize career mentorship through AI-powered tools and vetted industry experts.",
  openGraph: {
    title: "About VinceUP",
    description: "Our mission, values, and the team behind the AI-powered career mentorship platform.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
