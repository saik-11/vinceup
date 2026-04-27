"use client";

import { useEffect, useMemo, useState } from "react";
import { RoomEvent } from "livekit-client";
import { AlertCircle, CalendarClock, Copy, Info, ShieldCheck, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./ChatPanel";
import { ConnectionStatus } from "./ConnectionStatus";
import { ControlBar } from "./ControlBar";
import { getParticipantDisplayName, ParticipantStatusRow } from "./ParticipantTile";
import { VideoGrid } from "./VideoGrid";

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getQualityLabel(quality) {
  if (!quality) return "Checking";

  const value = String(quality).toLowerCase();
  if (value.includes("excellent")) return "Excellent";
  if (value.includes("good")) return "Good";
  if (value.includes("poor")) return "Poor";
  if (value.includes("lost")) return "Lost";
  return "Stable";
}

export function LiveRoom({
  room,
  roomName = "Live Session",
  participants,
  connectionState,
  error,
  onLeave,
  className,
}) {
  const [activePanel, setActivePanel] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeSpeakers, setActiveSpeakers] = useState([]);
  const localIdentity = room?.localParticipant?.identity;
  const localQuality = getQualityLabel(room?.localParticipant?.connectionQuality);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!room) return;

    const handleSpeakers = (speakers) => {
      setActiveSpeakers(speakers.map((speaker) => speaker.identity));
    };

    handleSpeakers(room.activeSpeakers ?? []);
    room.on(RoomEvent.ActiveSpeakersChanged, handleSpeakers);
    return () => room.off(RoomEvent.ActiveSpeakersChanged, handleSpeakers);
  }, [room]);

  const activeIdentitySet = useMemo(() => new Set(activeSpeakers), [activeSpeakers]);
  const panelOpen = Boolean(activePanel);

  const togglePanel = (panel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className={cn("relative flex h-full w-full flex-col overflow-hidden bg-slate-950 text-white", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_34%)]" />

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-slate-950/75 px-3 py-3 backdrop-blur-xl sm:px-5">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white sm:text-base">{roomName}</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{formatDuration(elapsedSeconds)}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              {participants.length} participant{participants.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className="hidden border-emerald-400/30 bg-emerald-400/10 text-emerald-200 sm:inline-flex">
            <ShieldCheck className="h-3 w-3" />
            {localQuality}
          </Badge>
          <Badge variant="outline" className="hidden border-white/10 bg-white/5 text-slate-300 md:inline-flex">
            Recording off
          </Badge>
          <ConnectionStatus connectionState={connectionState} className="bg-white/8 text-white" />
        </div>
      </header>

      {error && (
        <div className="relative z-10 flex shrink-0 items-center gap-2 border-b border-red-500/30 bg-red-950/50 px-4 py-2 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        <VideoGrid room={room} participants={participants} className={cn(panelOpen && "lg:pr-1")} />

        {activePanel === "chat" && (
          <ChatPanel
            room={room}
            localIdentity={localIdentity}
            onClose={() => setActivePanel(null)}
            className="absolute inset-y-0 right-0 z-30 w-full max-w-sm lg:relative lg:z-auto lg:w-96"
          />
        )}

        {activePanel === "participants" && (
          <ParticipantsPanel
            room={room}
            participants={participants}
            activeIdentitySet={activeIdentitySet}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "details" && (
          <MeetingDetailsPanel
            room={room}
            roomName={roomName}
            elapsedSeconds={elapsedSeconds}
            participants={participants}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>

      <ControlBar
        room={room}
        onLeave={onLeave}
        onToggleChat={() => togglePanel("chat")}
        onToggleParticipants={() => togglePanel("participants")}
        onToggleDetails={() => togglePanel("details")}
        isChatOpen={activePanel === "chat"}
        isParticipantsOpen={activePanel === "participants"}
        isDetailsOpen={activePanel === "details"}
      />
    </div>
  );
}

function PanelShell({ title, icon: Icon, onClose, children }) {
  return (
    <aside className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm shrink-0 flex-col border-l border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl lg:relative lg:z-auto lg:w-96">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-cyan-200">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="h-9 w-9 rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </aside>
  );
}

function ParticipantsPanel({ room, participants, activeIdentitySet, onClose }) {
  return (
    <PanelShell title="Participants" icon={Users} onClose={onClose}>
      <ScrollArea className="min-h-0 flex-1 px-3 py-3">
        <div className="space-y-1">
          {participants.map((participant) => (
            <ParticipantStatusRow
              key={participant.identity}
              participant={participant}
              isLocal={participant === room?.localParticipant}
              isActiveSpeaker={activeIdentitySet.has(participant.identity)}
            />
          ))}
        </div>
      </ScrollArea>
    </PanelShell>
  );
}

function MeetingDetailsPanel({ room, roomName, elapsedSeconds, participants, onClose }) {
  const localName = getParticipantDisplayName(room?.localParticipant);

  return (
    <PanelShell title="Meeting details" icon={Info} onClose={onClose}>
      <div className="space-y-4 p-4 text-sm text-slate-300">
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Room</div>
          <div className="mt-1 break-words text-base font-semibold text-white">{roomName}</div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 rounded-full bg-white/8 text-slate-200 hover:bg-white/14 hover:text-white"
            onClick={() => navigator?.clipboard?.writeText?.(roomName)}
          >
            <Copy className="h-4 w-4" />
            Copy room name
          </Button>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <DetailCard label="Duration" value={formatDuration(elapsedSeconds)} />
          <DetailCard label="Participants" value={String(participants.length)} />
          <DetailCard label="You joined as" value={localName} className="col-span-2" />
          <DetailCard label="Recording" value="Off" className="col-span-2" />
        </section>
      </div>
    </PanelShell>
  );
}

function DetailCard({ label, value, className }) {
  return (
    <div className={cn("rounded-lg border border-white/10 bg-white/[0.04] p-3", className)}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 truncate text-sm font-medium text-white">{value}</div>
    </div>
  );
}
