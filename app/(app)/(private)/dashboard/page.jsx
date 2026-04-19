import { CareerGrowthDashboard } from "@/components/dashboard/career-growth-dashboard";
import { getDashboardPayload, getDashboardScenarioName } from "@/lib/dashboard-data";
import { cookies } from "next/headers";
import MentorDashboard from "./MentorDashboard";

export const metadata = {
  title: "Dashboard | Vinceup",
  description: "Career growth dashboard for mentorship progress and VEGA insights.",
};

// ─── Role → Dashboard registry ────────────────────────────────────────────────
// To add a new role, import its component above and add one entry here.
// The render logic below stays untouched.
//
// Example:
//   import AdminDashboard from "./AdminDashboard";
//   admin: AdminDashboard,

const DASHBOARD_BY_ROLE = {
  mentor: MentorDashboard,
  mentee: CareerGrowthDashboard,
};

/** Fallback when the cookie role doesn't match any registered dashboard. */
const FallbackDashboard = CareerGrowthDashboard;

// ─────────────────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const scenario = getDashboardScenarioName(params);
  const data = getDashboardPayload(scenario);
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (data.meta.simulateLatencyMs > 0) {
    await sleep(data.meta.simulateLatencyMs);
  }

  if (data.meta.shouldThrow) {
    throw new Error("The requested dashboard scenario intentionally triggered a render failure.");
  }

  const Dashboard = DASHBOARD_BY_ROLE[role] ?? FallbackDashboard;
  return <Dashboard data={data} activeScenario={scenario} />;
}
