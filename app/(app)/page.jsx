import HomeContent from "./HomeContent";

export const metadata = {
  title: {
    absolute: "VinceUP — Your Career Growth Operating System",
  },
  description:
    "Accelerate your career with AI-driven insights, 1:1 mentorship from verified industry experts, and structured roadmaps built for where you actually want to go.",
  keywords: [
    "mentorship",
    "career growth",
    "1:1 coaching",
    "AI career mentor",
    "career development",
    "mentor platform",
  ],
  openGraph: {
    title: "VinceUP — Your Career Growth Operating System",
    description:
      "AI-powered career mentorship. Connect with 500+ vetted experts, track your progress, and hit your career goals faster.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VinceUP — Career Growth OS",
    description: "AI-powered mentorship platform with 500+ vetted industry experts.",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
