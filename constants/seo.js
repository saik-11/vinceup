/**
 * Brand and SEO constants.
 * Shared across metadata exports and OG/Twitter card configurations.
 */

export const SITE_NAME = "VinceUP";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vinceup.com";
export const SITE_TAGLINE = "Your Career Growth Operating System";

export const DEFAULT_DESCRIPTION =
  "Accelerate your career with AI-driven insights, 1:1 mentorship from verified industry experts, and structured roadmaps built for where you actually want to go.";

export const DEFAULT_KEYWORDS = [
  "mentorship",
  "career growth",
  "1:1 coaching",
  "AI career",
  "mentor platform",
  "career development",
];

/**
 * Build a consistent page title.
 * @example pageTitle("Dashboard") => "Dashboard | VinceUP"
 */
export function pageTitle(title) {
  return `${title} | ${SITE_NAME}`;
}

/**
 * Base metadata shared across pages. Merge with page-specific overrides.
 * Note: Next.js merges these automatically when you use the title template
 * in the root layout, so this is mainly useful for OG/Twitter consistency.
 */
export const baseMeta = {
  siteName: SITE_NAME,
  twitterCard: "summary_large_image",
};

