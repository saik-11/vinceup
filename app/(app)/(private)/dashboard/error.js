"use client";

import { useEffect } from "react";

import { DashboardErrorState } from "./CareerGrowthDashboard";

export default function Error({ error, unstable_retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <DashboardErrorState error={error} retryLabel="Retry dashboard" onRetry={() => unstable_retry()} />;
}
