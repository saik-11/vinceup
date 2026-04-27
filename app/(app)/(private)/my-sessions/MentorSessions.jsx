"use client";

import { SessionManagementPage } from "@/components/sessions/SessionManagementPage";
import { mentorApi } from "@/lib/api/service";
import { useEffect, useState } from "react";

const MentorSessions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    mentorApi
      .getSessions()
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount((c) => c + 1);
  };

  // Called after a successful accept / decline to re-fetch the sessions list
  const handleAction = () => {
    setLoading(true);
    setData(null);
    setRetryCount((c) => c + 1);
  };

  return (
    <SessionManagementPage
      data={data}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      onAction={handleAction}
    />
  );
};

export default MentorSessions;
