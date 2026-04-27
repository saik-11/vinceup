"use client";

import { SessionStats } from "./SessionStats";
import { SessionTabs } from "./SessionTabs";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-6 flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-7 w-12" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const TabsSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
    <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="py-5 flex justify-center">
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
    <div className="p-6 flex flex-col gap-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-52" />
                </div>
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl mb-6" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Failed to load sessions</h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
      Something went wrong while fetching your sessions. Please try again.
    </p>
    <Button onClick={onRetry} className="rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </Button>
  </div>
);

export const SessionManagementPage = ({ data, loading, error, onRetry, onAction }) => {
  const miniStats = data?.mini_stats ?? null;
  const tabs = {
    upcoming: data?.upcoming ?? [],
    requests: data?.requests ?? [],
    today: data?.today ?? [],
    past: data?.past ?? [],
  };
  const displayTimezone = data?.display_timezone ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Session Management</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your mentorship sessions and requests
          {displayTimezone && (
            <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">
              · {displayTimezone}
            </span>
          )}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {loading ? <StatsSkeleton /> : <SessionStats stats={miniStats} />}
      </motion.div>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {loading ? (
          <TabsSkeleton />
        ) : error ? (
          <ErrorState onRetry={onRetry} />
        ) : (
          <SessionTabs tabs={tabs} onAction={onAction ?? onRetry} />
        )}
      </motion.div>
    </div>
  );
};
