import { CareerGrowthDashboard } from "@/components/dashboard/career-growth-dashboard";
import { getDashboardPayload, getDashboardScenarioName } from "@/lib/dashboard-data";

export const metadata = {
  title: "Dashboard | Vinceup",
  description: "Career growth dashboard for mentorship progress and VEGA insights.",
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const scenario = getDashboardScenarioName(params);
  const data = getDashboardPayload(scenario);

  if (data.meta.simulateLatencyMs > 0) {
    await sleep(data.meta.simulateLatencyMs);
  }

  if (data.meta.shouldThrow) {
    throw new Error("The requested dashboard scenario intentionally triggered a render failure.");
  }

  return <CareerGrowthDashboard data={data} activeScenario={scenario} />;
}
