import { Geist, Geist_Mono, Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import { AUTH_TOKEN_KEY } from "@/lib/auth/authSession";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vinceup.com"),
  title: {
    default: "VinceUP — Your Career Growth Operating System",
    template: "%s | VinceUP",
  },
  description:
    "Accelerate your career with AI-driven insights, 1:1 mentorship from verified industry experts, and structured roadmaps built for where you actually want to go.",
  keywords: ["mentorship", "career growth", "1:1 coaching", "AI career", "mentor platform"],
  authors: [{ name: "VinceUP" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "VinceUP",
    title: "VinceUP — Your Career Growth Operating System",
    description:
      "AI-powered career mentorship platform. Connect with vetted industry experts and accelerate your growth.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VinceUP — Your Career Growth Operating System",
    description:
      "AI-powered career mentorship platform. Connect with vetted industry experts and accelerate your growth.",
  },
};
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const initialAuth = Boolean(cookieStore.get(AUTH_TOKEN_KEY)?.value);

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProviders initialAuth={initialAuth}>{children}</AppProviders>
      </body>
    </html>
  );
}
