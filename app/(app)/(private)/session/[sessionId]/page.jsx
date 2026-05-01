"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import dynamic from "next/dynamic";

// Lazy-load so LiveKit JS is not bundled into pages that don't need it
const JoinSession = dynamic(
  () => import("@/components/livekit/JoinSession").then((m) => m.JoinSession),
  { ssr: false },
);

export default function SessionRoomPage({ params }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const durationParam = searchParams.get("duration");
  const { user } = useAuth();
  const { role } = useRole();

  // LiveKit role mapping: mentors are "agent", mentees are "customer"
  const livekitRole = role === "mentor" ? "agent" : "customer";

  const handleClose = () => {
    router.push("/my-sessions");
  };

  return (
    <JoinSession
      sessionId={sessionId}
      userId={user?.id ?? user?.user_id ?? ""}
      userName={user?.first_name ?? user?.name ?? user?.full_name ?? ""}
      sessionDuration={durationParam}
      role={livekitRole}
      onClose={handleClose}
      className="h-full w-full"
    />
  );
}
