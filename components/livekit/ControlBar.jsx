"use client";

import { useCallback, useEffect, useState } from "react";
import { ParticipantEvent } from "livekit-client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Circle,
  Hand,
  Info,
  Loader2,
  MessageSquare,
  Mic,
  MicOff,
  MonitorOff,
  MonitorUp,
  MoreVertical,
  PhoneOff,
  Settings,
  Users,
  Video,
  VideoOff,
} from "lucide-react";

/* ─── Data channel topics ─── */

const HAND_RAISE_TOPIC = "lk-hand-raise";
const RECORDING_TOPIC = "lk-recording-state";

/* ─── Icon size helper ─── */

const ICON = "h-5 w-5";

/* ─── Control Button — Google Meet style ─── */

function ControlButton({ onClick, active, disabled, variant = "default", children, label }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          aria-pressed={active}
          className={cn(
            "relative h-12 w-12 rounded-full transition-all duration-200",
            "focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0",
            variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
            variant === "muted" && "bg-[#3c4043] text-white hover:bg-[#484b4e]",
            variant === "active" && "bg-[#8ab4f8]/20 text-[#8ab4f8] hover:bg-[#8ab4f8]/30",
            variant === "warning" && "bg-amber-400/20 text-amber-300 hover:bg-amber-400/30",
            variant === "default" && "bg-[#3c4043] text-[#e8eaed] hover:bg-[#484b4e]",
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="border-none bg-[#2d2e30] text-white">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

/* ─── Control Bar ─── */

export function ControlBar({
  room,
  onLeave,
  onToggleChat,
  onToggleParticipants,
  onToggleDetails,
  onToggleRecording,
  isChatOpen,
  isParticipantsOpen,
  isDetailsOpen,
  isRecording,
  // Pre-join choices — used as initial state so controls are consistent
  initialMicEnabled = true,
  initialCamEnabled = false,
  className,
}) {
  const local = room?.localParticipant;
  const [micEnabled, setMicEnabled] = useState(initialMicEnabled);
  const [camEnabled, setCamEnabled] = useState(initialCamEnabled);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    if (!local) return;

    const sync = () => {
      setMicEnabled(Boolean(local.isMicrophoneEnabled));
      setCamEnabled(Boolean(local.isCameraEnabled));
      setScreenSharing(Boolean(local.isScreenShareEnabled));
    };

    sync();
    local.on(ParticipantEvent.TrackMuted, sync);
    local.on(ParticipantEvent.TrackUnmuted, sync);
    local.on(ParticipantEvent.LocalTrackPublished, sync);
    local.on(ParticipantEvent.LocalTrackUnpublished, sync);

    return () => {
      local.off(ParticipantEvent.TrackMuted, sync);
      local.off(ParticipantEvent.TrackUnmuted, sync);
      local.off(ParticipantEvent.LocalTrackPublished, sync);
      local.off(ParticipantEvent.LocalTrackUnpublished, sync);
    };
  }, [local]);

  const toggleMic = useCallback(async () => {
    if (!local || toggling) return;
    setToggling("mic");
    try {
      const next = !local.isMicrophoneEnabled;
      await local.setMicrophoneEnabled(next);
      setMicEnabled(next);
    } catch (err) {
      console.error("Failed to toggle microphone:", err);
      if (err?.name === "NotReadableError" || String(err?.message).includes("Device in use")) {
        toast.error("Microphone is currently in use by another application. Please close it and try again.", { duration: 5000 });
      } else {
        toast.error("Could not toggle microphone. Check permissions.");
      }
    } finally {
      setToggling(null);
    }
  }, [local, toggling]);

  const toggleCamera = useCallback(async () => {
    if (!local || toggling) return;
    setToggling("cam");
    try {
      const next = !local.isCameraEnabled;
      await local.setCameraEnabled(next);
      setCamEnabled(next);
    } catch (err) {
      console.error("Failed to toggle camera:", err);
      if (err?.name === "NotReadableError" || String(err?.message).includes("Device in use")) {
        toast.error("Camera is currently in use by another application. Please close it and try again.", { duration: 5000 });
      } else {
        toast.error("Could not toggle camera. Check permissions.");
      }
    } finally {
      setToggling(null);
    }
  }, [local, toggling]);

  const toggleScreenShare = useCallback(async () => {
    if (!local) return;
    const next = !local.isScreenShareEnabled;
    try {
      await local.setScreenShareEnabled(next);
      setScreenSharing(next);
    } catch {
      setScreenSharing(Boolean(local.isScreenShareEnabled));
    }
  }, [local]);

  const toggleHandRaise = useCallback(() => {
    if (!room) return;
    const next = !handRaised;
    setHandRaised(next);

    try {
      const payload = JSON.stringify({
        topic: HAND_RAISE_TOPIC,
        identity: local?.identity,
        raised: next,
      });
      room.localParticipant.publishData(new TextEncoder().encode(payload), { reliable: true });
    } catch (err) {
      console.error("Failed to broadcast hand raise:", err);
    }
  }, [room, local, handRaised]);

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.15 }}
        className={cn(
          "pointer-events-none z-20 flex w-full shrink-0 justify-center px-3 pb-4 pt-2 sm:pb-5",
          className,
        )}
      >
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#202124]/90 px-3 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl sm:gap-2.5 sm:px-4">
          {/* ─── Mic ─── */}
          <ControlButton
            label={micEnabled ? "Mute microphone (Ctrl+D)" : "Unmute microphone (Ctrl+D)"}
            onClick={toggleMic}
            disabled={toggling === "mic"}
            variant={!micEnabled ? "muted" : "default"}
          >
            {toggling === "mic" ? (
              <Loader2 className={cn(ICON, "animate-spin")} />
            ) : micEnabled ? (
              <Mic className={ICON} />
            ) : (
              <MicOff className={cn(ICON, "text-red-400")} />
            )}
            {/* Red indicator dot when muted */}
            {!micEnabled && !toggling && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#202124] bg-red-500" />
            )}
          </ControlButton>

          {/* ─── Camera ─── */}
          <ControlButton
            label={camEnabled ? "Turn off camera (Ctrl+E)" : "Turn on camera (Ctrl+E)"}
            onClick={toggleCamera}
            disabled={toggling === "cam"}
            variant={!camEnabled ? "muted" : "default"}
          >
            {toggling === "cam" ? (
              <Loader2 className={cn(ICON, "animate-spin")} />
            ) : camEnabled ? (
              <Video className={ICON} />
            ) : (
              <VideoOff className={cn(ICON, "text-red-400")} />
            )}
            {!camEnabled && !toggling && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#202124] bg-red-500" />
            )}
          </ControlButton>

          {/* ─── Screen share (sm+) ─── */}
          <div className="hidden sm:block">
            <ControlButton
              label={screenSharing ? "Stop presenting" : "Present now"}
              onClick={toggleScreenShare}
              variant={screenSharing ? "active" : "default"}
            >
              {screenSharing ? <MonitorOff className={ICON} /> : <MonitorUp className={ICON} />}
            </ControlButton>
          </div>

          {/* ─── Hand raise (md+) ─── */}
          <div className="hidden md:block">
            <ControlButton
              label={handRaised ? "Lower hand" : "Raise hand"}
              onClick={toggleHandRaise}
              variant={handRaised ? "warning" : "default"}
            >
              <Hand className={ICON} />
            </ControlButton>
          </div>

          {/* Separator */}
          <div className="mx-0.5 h-8 w-px bg-white/10" />

          {/* ─── Panel toggles (md+) ─── */}
          <div className="hidden items-center gap-2 md:flex">
            <ControlButton
              label={isChatOpen ? "Close chat" : "Chat with everyone"}
              onClick={onToggleChat}
              variant={isChatOpen ? "active" : "default"}
            >
              <MessageSquare className={ICON} />
            </ControlButton>

            <ControlButton
              label={isParticipantsOpen ? "Close participants" : "Show everyone"}
              onClick={onToggleParticipants}
              variant={isParticipantsOpen ? "active" : "default"}
            >
              <Users className={ICON} />
            </ControlButton>

            <ControlButton
              label={isDetailsOpen ? "Close meeting info" : "Meeting details"}
              onClick={onToggleDetails}
              variant={isDetailsOpen ? "active" : "default"}
            >
              <Info className={ICON} />
            </ControlButton>

            <ControlButton
              label={isRecording ? "Stop recording" : "Start recording"}
              onClick={onToggleRecording}
              variant={isRecording ? "muted" : "default"}
            >
              <Circle className={cn(ICON, isRecording && "fill-red-400 text-red-400 animate-pulse")} />
            </ControlButton>

            <DeviceMenu room={room} />
          </div>

          {/* ─── Mobile "More" dropdown ─── */}
          <div className="md:hidden">
            <MobileMoreMenu
              room={room}
              screenSharing={screenSharing}
              handRaised={handRaised}
              isChatOpen={isChatOpen}
              isParticipantsOpen={isParticipantsOpen}
              isDetailsOpen={isDetailsOpen}
              isRecording={isRecording}
              onToggleScreenShare={toggleScreenShare}
              onToggleHand={toggleHandRaise}
              onToggleChat={onToggleChat}
              onToggleParticipants={onToggleParticipants}
              onToggleDetails={onToggleDetails}
              onToggleRecording={onToggleRecording}
            />
          </div>

          {/* Separator */}
          <div className="mx-0.5 h-8 w-px bg-white/10" />

          {/* ─── Leave ─── */}
          <ControlButton label="Leave session" onClick={onLeave} variant="danger">
            <PhoneOff className={ICON} />
          </ControlButton>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}

/* ─── Mobile More Menu ─── */

function MobileMoreMenu({
  room,
  screenSharing,
  handRaised,
  isChatOpen,
  isParticipantsOpen,
  isDetailsOpen,
  isRecording,
  onToggleScreenShare,
  onToggleHand,
  onToggleChat,
  onToggleParticipants,
  onToggleDetails,
  onToggleRecording,
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="More options"
              className="h-12 w-12 rounded-full bg-[#3c4043] text-[#e8eaed] hover:bg-[#484b4e]"
            >
              <MoreVertical className={ICON} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" className="border-none bg-[#2d2e30] text-white">
          More options
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#2d2e30] text-[#e8eaed]">
        <div className="sm:hidden">
          <DropdownMenuItem onClick={onToggleScreenShare} className="cursor-pointer gap-3 px-3 py-2.5 hover:bg-white/10">
            {screenSharing ? <MonitorOff className="h-4 w-4" /> : <MonitorUp className="h-4 w-4" />}
            {screenSharing ? "Stop presenting" : "Present now"}
          </DropdownMenuItem>
        </div>

        <DropdownMenuItem onClick={onToggleHand} className="cursor-pointer gap-3 px-3 py-2.5 hover:bg-white/10">
          <Hand className="h-4 w-4" />
          {handRaised ? "Lower hand" : "Raise hand"}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem onClick={onToggleChat} className="cursor-pointer gap-3 px-3 py-2.5 hover:bg-white/10">
          <MessageSquare className="h-4 w-4" />
          {isChatOpen ? "Close chat" : "Chat with everyone"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onToggleParticipants} className="cursor-pointer gap-3 px-3 py-2.5 hover:bg-white/10">
          <Users className="h-4 w-4" />
          {isParticipantsOpen ? "Close participants" : "Show everyone"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onToggleDetails} className="cursor-pointer gap-3 px-3 py-2.5 hover:bg-white/10">
          <Info className="h-4 w-4" />
          {isDetailsOpen ? "Close details" : "Meeting details"}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem onClick={onToggleRecording} className="cursor-pointer gap-3 px-3 py-2.5 hover:bg-white/10">
          <Circle className={cn("h-4 w-4", isRecording && "fill-red-400 text-red-400")} />
          {isRecording ? "Stop recording" : "Start recording"}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuLabel className="px-3 text-xs text-slate-500">Device settings</DropdownMenuLabel>
        <DeviceMenuItems room={room} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─── Device Menu (Desktop) ─── */

function DeviceMenu({ room }) {
  const [devices, setDevices] = useState({ mics: [], cameras: [] });

  const loadDevices = useCallback(async () => {
    if (!navigator?.mediaDevices?.enumerateDevices) return;
    const all = await navigator.mediaDevices.enumerateDevices();
    setDevices({
      mics: all.filter((d) => d.kind === "audioinput"),
      cameras: all.filter((d) => d.kind === "videoinput"),
    });
  }, []);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onMouseEnter={loadDevices}
              onFocus={loadDevices}
              aria-label="Device settings"
              className="h-12 w-12 rounded-full bg-[#3c4043] text-[#e8eaed] hover:bg-[#484b4e]"
            >
              <Settings className={ICON} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" className="border-none bg-[#2d2e30] text-white">
          Settings
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="max-h-96 w-72 overflow-y-auto border-white/10 bg-[#2d2e30] text-[#e8eaed]">
        <DropdownMenuLabel className="px-3 text-xs text-slate-500">Microphone</DropdownMenuLabel>
        {devices.mics.length > 0 ? (
          devices.mics.map((d) => (
            <DropdownMenuItem
              key={d.deviceId}
              onClick={() => room?.switchActiveDevice("audioinput", d.deviceId)}
              className="cursor-pointer gap-3 px-3 py-2.5 text-sm hover:bg-white/10"
            >
              <Mic className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">{d.label || "Microphone"}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="px-3 text-sm text-slate-500">No microphones found</DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuLabel className="px-3 text-xs text-slate-500">Camera</DropdownMenuLabel>
        {devices.cameras.length > 0 ? (
          devices.cameras.map((d) => (
            <DropdownMenuItem
              key={d.deviceId}
              onClick={() => room?.switchActiveDevice("videoinput", d.deviceId)}
              className="cursor-pointer gap-3 px-3 py-2.5 text-sm hover:bg-white/10"
            >
              <Video className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">{d.label || "Camera"}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="px-3 text-sm text-slate-500">No cameras found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─── Device Menu Items (for mobile dropdown) ─── */

function DeviceMenuItems({ room }) {
  const [devices, setDevices] = useState({ mics: [], cameras: [] });

  useEffect(() => {
    async function load() {
      if (!navigator?.mediaDevices?.enumerateDevices) return;
      const all = await navigator.mediaDevices.enumerateDevices();
      setDevices({
        mics: all.filter((d) => d.kind === "audioinput"),
        cameras: all.filter((d) => d.kind === "videoinput"),
      });
    }
    load();
  }, []);

  if (devices.mics.length === 0 && devices.cameras.length === 0) {
    return <DropdownMenuItem disabled className="px-3 text-sm text-slate-500">No devices found</DropdownMenuItem>;
  }

  return (
    <>
      {devices.mics.map((d) => (
        <DropdownMenuItem
          key={d.deviceId}
          onClick={() => room?.switchActiveDevice("audioinput", d.deviceId)}
          className="cursor-pointer gap-3 px-3 py-2.5 text-sm hover:bg-white/10"
        >
          <Mic className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{d.label || "Microphone"}</span>
        </DropdownMenuItem>
      ))}
      {devices.cameras.map((d) => (
        <DropdownMenuItem
          key={d.deviceId}
          onClick={() => room?.switchActiveDevice("videoinput", d.deviceId)}
          className="cursor-pointer gap-3 px-3 py-2.5 text-sm hover:bg-white/10"
        >
          <Video className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{d.label || "Camera"}</span>
        </DropdownMenuItem>
      ))}
    </>
  );
}

export { HAND_RAISE_TOPIC, RECORDING_TOPIC };
