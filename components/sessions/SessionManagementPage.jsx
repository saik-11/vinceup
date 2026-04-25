"use client";

import { useState } from "react";
import { SessionStats } from "./SessionStats";
import { SessionTabs } from "./SessionTabs";
import { motion } from "framer-motion";

const MOCK_SESSIONS = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    avatar: "A",
    sessionNumber: 3,
    badgeType: "Repeat",
    type: "Mock Interview",
    duration: "45 Min",
    scheduledAt: "Oct 24, 2024 at 10:00 AM",
    status: "Confirmed",
    category: "upcoming"
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    avatar: "S",
    sessionNumber: 1,
    badgeType: "New",
    type: "Career Guidance",
    duration: "30 Min",
    scheduledAt: "Oct 25, 2024 at 2:00 PM",
    status: "Confirmed",
    category: "upcoming"
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatar: "M",
    sessionNumber: 1,
    badgeType: "New",
    type: "Resume Review",
    duration: "30 Min",
    scheduledAt: "TBD",
    status: "Pending",
    category: "requests"
  },
  {
    id: "4",
    name: "Jessica Taylor",
    email: "jtaylor@example.com",
    avatar: "J",
    sessionNumber: 4,
    badgeType: "Repeat",
    type: "Career Guidance",
    duration: "60 Min",
    scheduledAt: "Today at 4:00 PM",
    status: "Confirmed",
    category: "today"
  },
  {
    id: "5",
    name: "David Miller",
    email: "dmiller@example.com",
    avatar: "D",
    sessionNumber: 2,
    badgeType: "Repeat",
    type: "Mock Interview",
    duration: "45 Min",
    scheduledAt: "Oct 15, 2024 at 11:00 AM",
    status: "Completed",
    category: "past"
  },
  {
    id: "6",
    name: "Emma Davis",
    email: "emma.d@example.com",
    avatar: "E",
    sessionNumber: 1,
    badgeType: "New",
    type: "Portfolio Review",
    duration: "30 Min",
    scheduledAt: "Oct 10, 2024 at 3:30 PM",
    status: "Cancelled",
    category: "past"
  }
];

export const SessionManagementPage = () => {
  const [sessions] = useState(MOCK_SESSIONS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Session Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your mentorship sessions and requests</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <SessionStats />
      </motion.div>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <SessionTabs sessions={sessions} />
      </motion.div>
    </div>
  );
};
