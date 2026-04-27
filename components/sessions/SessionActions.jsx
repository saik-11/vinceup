import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, Eye, FileText, Pencil, Loader2 } from "lucide-react";
import { mentorApi } from "@/lib/api/service";
import { toast } from "sonner";

export const SessionActions = ({ category, capsuleStatus, sessionId, onAction }) => {
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await mentorApi.acceptSession(sessionId);
      toast.success("Session accepted successfully.");
      onAction?.();
    } catch {
      toast.error("Failed to accept session. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    setDeclining(true);
    try {
      await mentorApi.declineSession(sessionId);
      toast.success("Session declined.");
      onAction?.();
    } catch {
      toast.error("Failed to decline session. Please try again.");
    } finally {
      setDeclining(false);
    }
  };

  if (category === "upcoming" || category === "today") {
    return (
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition-all"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Prep
        </Button>
        <Button
          className="flex-1 rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition-all"
          onClick={() => router.push(`/session/${sessionId}`)}
        >
          <Play className="w-4 h-4 mr-2" />
          Join Session
        </Button>
      </div>
    );
  }

  if (category === "requests") {
    return (
      <div className="flex gap-4">
        <Button
          className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-none transition-all"
          onClick={handleAccept}
          disabled={accepting || declining}
        >
          {accepting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Accept
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-none transition-colors"
          onClick={handleDecline}
          disabled={accepting || declining}
        >
          {declining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Decline
        </Button>
      </div>
    );
  }

  if (category === "past" && capsuleStatus) {
    return (
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition-all"
        >
          <FileText className="w-4 h-4 mr-2" />
          View Capsule
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm transition-all"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Capsule
        </Button>
      </div>
    );
  }

  return null;
};
