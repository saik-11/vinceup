"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RoomEvent } from "livekit-client";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertCircle,
  CalendarClock,
  Circle,
  Copy,
  Info,
  ShieldCheck,
  Users,
  X,
  Hand,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsDesktop, useIsMobile } from "@/hooks/useMediaQuery";
import { useParticipantTracks } from "@/hooks/useLiveKit";
import { ChatPanel } from "./ChatPanel";
import { ConnectionStatus } from "./ConnectionStatus";
import { ControlBar, HAND_RAISE_TOPIC } from "./ControlBar";
import { getParticipantDisplayName } from "./ParticipantTile";
import { VideoGrid } from "./VideoGrid";

/* ─── Helpers ─── */

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

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase() || "?";
}

/* ─── Panel animation variants ─── */

const panelSlideVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 320, damping: 32, mass: 0.8 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { type: "spring", stiffness: 400, damping: 40, mass: 0.6 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ─── LiveRoom ─── */

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
  const [raisedHands, setRaisedHands] = useState(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  const localIdentity = room?.localParticipant?.identity;
  const localQuality = getQualityLabel(room?.localParticipant?.connectionQuality);

  // Elapsed time
  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  // Active speakers
  useEffect(() => {
    if (!room) return;

    const handleSpeakers = (speakers) => {
      setActiveSpeakers(speakers.map((speaker) => speaker.identity));
    };

    handleSpeakers(room.activeSpeakers ?? []);
    room.on(RoomEvent.ActiveSpeakersChanged, handleSpeakers);
    return () => room.off(RoomEvent.ActiveSpeakersChanged, handleSpeakers);
  }, [room]);

  // Listen for hand raise data from other participants
  useEffect(() => {
    if (!room) return;

    const handleData = (payload) => {
      try {
        const text = new TextDecoder().decode(payload);
        const parsed = JSON.parse(text);
        if (parsed.topic !== HAND_RAISE_TOPIC) return;

        setRaisedHands((prev) => {
          const next = new Set(prev);
          if (parsed.raised) {
            next.add(parsed.identity);
          } else {
            next.delete(parsed.identity);
          }
          return next;
        });
      } catch {
        // Ignore
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => room.off(RoomEvent.DataReceived, handleData);
  }, [room]);

  // Track local hand raise in the set too
  useEffect(() => {
    if (!room) return;

    const handleData = (payload, participant) => {
      // Only care about our own data for the local hand raise tracking
      if (participant?.identity !== localIdentity) return;
      try {
        const text = new TextDecoder().decode(payload);
        const parsed = JSON.parse(text);
        if (parsed.topic !== HAND_RAISE_TOPIC) return;
        setRaisedHands((prev) => {
          const next = new Set(prev);
          if (parsed.raised) next.add(parsed.identity);
          else next.delete(parsed.identity);
          return next;
        });
      } catch {
        // Ignore
      }
    };

    // The local publish also triggers DataReceived for self
    // But in case it doesn't, we handle it from the control bar event
  }, [room, localIdentity]);

  const activeIdentitySet = useMemo(() => new Set(activeSpeakers), [activeSpeakers]);
  const panelOpen = Boolean(activePanel);

  const togglePanel = (panel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  const closePanel = () => setActivePanel(null);

  const handleToggleRecording = useCallback(() => {
    setIsRecording((prev) => {
      const next = !prev;
      toast.info(next ? "Recording started" : "Recording stopped");
      return next;
    });
  }, []);

  // Resolve which panel content to render
  const panelTitle = activePanel === "chat"
    ? "In-call messages"
    : activePanel === "participants"
      ? "Participants"
      : activePanel === "details"
        ? "Meeting details"
        : "";

  const panelIcon = activePanel === "participants"
    ? Users
    : activePanel === "details"
      ? Info
      : null;

  // Render panel inner content (reused across desktop/tablet/mobile)
  function renderPanelContent() {
    switch (activePanel) {
      case "participants":
        return (
          <ParticipantsContent
            room={room}
            participants={participants}
            activeIdentitySet={activeIdentitySet}
            raisedHands={raisedHands}
          />
        );
      case "details":
        return (
          <MeetingDetailsContent
            room={room}
            roomName={roomName}
            elapsedSeconds={elapsedSeconds}
            participants={participants}
            isRecording={isRecording}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className={cn("relative flex h-full w-full flex-col overflow-hidden bg-slate-950 text-white", className)}>
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_34%)]" />

      {/* Header */}
      <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-slate-950/75 px-3 py-2.5 backdrop-blur-xl sm:px-5 sm:py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white sm:text-base">{roomName}</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDuration(elapsedSeconds)}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              {participants.length} participant{participants.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Badge variant="outline" className="hidden border-emerald-400/30 bg-emerald-400/10 text-emerald-200 sm:inline-flex">
            <ShieldCheck className="h-3 w-3" />
            {localQuality}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "hidden md:inline-flex",
              isRecording
                ? "border-red-400/40 bg-red-500/15 text-red-200"
                : "border-white/10 bg-white/5 text-slate-300",
            )}
          >
            <Circle className={cn("h-2 w-2", isRecording ? "fill-red-400 text-red-400 animate-pulse" : "fill-slate-500 text-slate-500")} />
            {isRecording ? "Recording" : "Not recording"}
          </Badge>
          <ConnectionStatus connectionState={connectionState} className="bg-white/8 text-white" />
        </div>
      </header>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 shrink-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-red-500/30 bg-red-950/50 px-4 py-2 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        {/* Video grid */}
        <div className="relative min-h-0 min-w-0 flex-1">
          <VideoGrid room={room} participants={participants} raisedHands={raisedHands} />

          {/* Control bar — overlaid on video, absolute bottom center */}
          <ControlBar
            room={room}
            onLeave={onLeave}
            onToggleChat={() => togglePanel("chat")}
            onToggleParticipants={() => togglePanel("participants")}
            onToggleDetails={() => togglePanel("details")}
            onToggleRecording={handleToggleRecording}
            isChatOpen={activePanel === "chat"}
            isParticipantsOpen={activePanel === "participants"}
            isDetailsOpen={activePanel === "details"}
            isRecording={isRecording}
          />
        </div>

        {/* Desktop: Animated slide-in panel */}
        {isDesktop && (
          <AnimatePresence mode="wait">
            {panelOpen && activePanel === "chat" && (
              <motion.div
                key="chat-panel"
                variants={panelSlideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex w-[360px] shrink-0 flex-col xl:w-[400px]"
              >
                <ChatPanel
                  room={room}
                  localIdentity={localIdentity}
                  onClose={closePanel}
                  className="h-full w-full border-l border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
                />
              </motion.div>
            )}
            {panelOpen && activePanel !== "chat" && (
              <motion.aside
                key={activePanel}
                variants={panelSlideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex w-[360px] shrink-0 flex-col border-l border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl xl:w-[400px]"
              >
                <PanelHeader title={panelTitle} icon={panelIcon} onClose={closePanel} />
                <div className="min-h-0 flex-1 overflow-y-auto">{renderPanelContent()}</div>
              </motion.aside>
            )}
          </AnimatePresence>
        )}

        {/* Tablet: Overlay panel */}
        {!isDesktop && !isMobile && (
          <>
            <AnimatePresence>
              {panelOpen && (
                <motion.div
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm"
                  onClick={closePanel}
                />
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {panelOpen && activePanel === "chat" && (
                <motion.div
                  key="chat-panel-tablet"
                  variants={panelSlideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col"
                >
                  <ChatPanel
                    room={room}
                    localIdentity={localIdentity}
                    onClose={closePanel}
                    className="h-full w-full border-l border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
                  />
                </motion.div>
              )}
              {panelOpen && activePanel !== "chat" && (
                <motion.aside
                  key={activePanel}
                  variants={panelSlideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col border-l border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
                >
                  <PanelHeader title={panelTitle} icon={panelIcon} onClose={closePanel} />
                  <div className="min-h-0 flex-1 overflow-y-auto">{renderPanelContent()}</div>
                </motion.aside>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Mobile: Vaul drawer */}
        {isMobile && (
          <Drawer open={panelOpen} onOpenChange={(open) => !open && closePanel()}>
            <DrawerContent className="max-h-[85vh] border-white/10 bg-slate-950 text-white">
              <DrawerHeader className="border-b border-white/10 pb-3">
                <DrawerTitle className="text-white">{panelTitle}</DrawerTitle>
                <DrawerDescription className="text-slate-400">
                  {activePanel === "chat"
                    ? "Messages are only visible during this call"
                    : activePanel === "participants"
                      ? `${participants.length} in this call`
                      : "Session information"}
                </DrawerDescription>
              </DrawerHeader>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {activePanel === "chat" ? (
                  <ChatPanel
                    room={room}
                    localIdentity={localIdentity}
                    onClose={closePanel}
                    embedded
                    className="h-full border-0 bg-transparent shadow-none backdrop-blur-0"
                  />
                ) : (
                  renderPanelContent()
                )}
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}

/* ─── Panel Header ─── */

function PanelHeader({ title, icon: Icon, onClose }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label={`Close ${title}`}
        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ─── Participants panel content ─── */

function ParticipantsContent({ room, participants, activeIdentitySet, raisedHands }) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-0.5 p-3">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            In this call ({participants.length})
          </span>
        </div>
        {participants.map((participant) => (
          <ParticipantRow
            key={participant.identity}
            participant={participant}
            isLocal={participant === room?.localParticipant}
            isActiveSpeaker={activeIdentitySet.has(participant.identity)}
            hasRaisedHand={raisedHands.has(participant.identity)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

/* ─── Participant Row (improved version for panel) ─── */

function ParticipantRow({ participant, isLocal, isActiveSpeaker, hasRaisedHand }) {
  const { cameraEnabled, micEnabled } = useParticipantTracks(participant);
  const name = getParticipantDisplayName(participant);
  const displayName = isLocal ? `${name} (You)` : name;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
        isActiveSpeaker && "bg-cyan-500/8",
        hasRaisedHand && "bg-amber-500/8",
      )}
    >
      <div className="relative">
        <Avatar className="h-9 w-9 border border-white/10">
          <AvatarFallback className="bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400 text-xs font-semibold text-white">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        {/* Active speaker indicator dot */}
        {isActiveSpeaker && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-cyan-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-white">{displayName}</span>
          {isLocal && (
            <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              You
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500">
          {hasRaisedHand
            ? "✋ Hand raised"
            : isActiveSpeaker
              ? "Speaking now"
              : "In the call"}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {hasRaisedHand && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300" title="Hand raised">
            <Hand className="h-3.5 w-3.5" />
          </span>
        )}
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            cameraEnabled ? "bg-emerald-400/10 text-emerald-300" : "bg-white/5 text-slate-500",
          )}
          title={cameraEnabled ? "Camera on" : "Camera off"}
        >
          {cameraEnabled ? <VideoIcon className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
        </span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            micEnabled ? "bg-emerald-400/10 text-emerald-300" : "bg-red-500/10 text-red-400",
          )}
          title={micEnabled ? "Mic on" : "Mic muted"}
        >
          {micEnabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
        </span>
      </div>
    </div>
  );
}

/* ─── Meeting Details panel content ─── */

function MeetingDetailsContent({ room, roomName, elapsedSeconds, participants, isRecording }) {
  const localName = getParticipantDisplayName(room?.localParticipant);

  return (
    <div className="space-y-5 p-4 text-sm text-slate-300">
      {/* Room info */}
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Room</div>
        <div className="mt-1.5 break-words text-base font-semibold text-white">{roomName}</div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 gap-1.5 rounded-lg bg-white/8 text-slate-200 hover:bg-white/14 hover:text-white"
          onClick={() => {
            navigator?.clipboard?.writeText?.(roomName);
            toast.success("Room name copied!");
          }}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy room name
        </Button>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3">
        <DetailCard label="Duration" value={formatDuration(elapsedSeconds)} icon={CalendarClock} />
        <DetailCard label="Participants" value={String(participants.length)} icon={Users} />
        <DetailCard label="You joined as" value={localName} className="col-span-2" />
      </section>

      {/* Recording section */}
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Recording</div>
        <div className="mt-3 flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            isRecording ? "bg-red-500/15" : "bg-white/5",
          )}>
            <Circle className={cn(
              "h-5 w-5",
              isRecording ? "fill-red-400 text-red-400 animate-pulse" : "text-slate-500",
            )} />
          </div>
          <div>
            <div className={cn("text-sm font-medium", isRecording ? "text-red-300" : "text-white")}>
              {isRecording ? "Recording in progress" : "Not recording"}
            </div>
            <div className="text-xs text-slate-500">
              {isRecording
                ? `Recording for ${formatDuration(elapsedSeconds)}`
                : "Start recording from the control bar"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Detail Card ─── */

function DetailCard({ label, value, icon: Icon, className }) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-white/[0.03] p-3", className)}>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-slate-500" />}
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <div className="mt-1.5 truncate text-sm font-medium text-white">{value}</div>
    </div>
  );
}
