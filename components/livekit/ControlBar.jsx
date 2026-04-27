"use client";

import { useCallback, useEffect, useState } from "react";
import { ParticipantEvent } from "livekit-client";
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
  Hand,
  Info,
  MessageSquare,
  Mic,
  MicOff,
  MonitorOff,
  MonitorUp,
  PhoneOff,
  Settings,
  Users,
  Video,
  VideoOff,
} from "lucide-react";

function ControlButton({ onClick, active, disabled, activeClassName, children, label, danger = false }) {
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
            "h-11 w-11 rounded-full border text-white shadow-sm transition-all sm:h-12 sm:w-12",
            "focus-visible:ring-white/40",
            danger
              ? "border-red-500/70 bg-red-600 text-white hover:bg-red-700"
              : "border-white/10 bg-white/8 hover:border-white/30 hover:bg-white/14",
            active && activeClassName,
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

export function ControlBar({
  room,
  onLeave,
  onToggleChat,
  onToggleParticipants,
  onToggleDetails,
  isChatOpen,
  isParticipantsOpen,
  isDetailsOpen,
  className,
}) {
  const local = room?.localParticipant;
  const [micEnabled, setMicEnabled] = useState(Boolean(local?.isMicrophoneEnabled));
  const [camEnabled, setCamEnabled] = useState(Boolean(local?.isCameraEnabled));
  const [screenSharing, setScreenSharing] = useState(Boolean(local?.isScreenShareEnabled));
  const [handRaised, setHandRaised] = useState(false);

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
    if (!local) return;
    const next = !local.isMicrophoneEnabled;
    await local.setMicrophoneEnabled(next);
    setMicEnabled(next);
  }, [local]);

  const toggleCamera = useCallback(async () => {
    if (!local) return;
    const next = !local.isCameraEnabled;
    await local.setCameraEnabled(next);
    setCamEnabled(next);
  }, [local]);

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

  return (
    <TooltipProvider>
      <div className={cn("pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-3", className)}>
        <div className="pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-slate-950/82 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <ControlButton
            label={micEnabled ? "Mute microphone" : "Unmute microphone"}
            onClick={toggleMic}
            active={!micEnabled}
            activeClassName="border-red-400/70 bg-red-500/22 text-red-100"
          >
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </ControlButton>

          <ControlButton
            label={camEnabled ? "Turn off camera" : "Turn on camera"}
            onClick={toggleCamera}
            active={!camEnabled}
            activeClassName="border-red-400/70 bg-red-500/22 text-red-100"
          >
            {camEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </ControlButton>

          <ControlButton
            label={screenSharing ? "Stop presenting" : "Present now"}
            onClick={toggleScreenShare}
            active={screenSharing}
            activeClassName="border-cyan-300/70 bg-cyan-400/18 text-cyan-100"
          >
            {screenSharing ? <MonitorOff className="h-5 w-5" /> : <MonitorUp className="h-5 w-5" />}
          </ControlButton>

          <ControlButton
            label={handRaised ? "Lower hand" : "Raise hand"}
            onClick={() => setHandRaised((current) => !current)}
            active={handRaised}
            activeClassName="border-amber-300/70 bg-amber-400/18 text-amber-100"
          >
            <Hand className="h-5 w-5" />
          </ControlButton>

          <div className="mx-1 h-7 w-px shrink-0 bg-white/10" />

          <ControlButton
            label={isChatOpen ? "Close chat" : "Open chat"}
            onClick={onToggleChat}
            active={isChatOpen}
            activeClassName="border-cyan-300/70 bg-cyan-400/18 text-cyan-100"
          >
            <MessageSquare className="h-5 w-5" />
          </ControlButton>

          <ControlButton
            label={isParticipantsOpen ? "Close participants" : "Open participants"}
            onClick={onToggleParticipants}
            active={isParticipantsOpen}
            activeClassName="border-cyan-300/70 bg-cyan-400/18 text-cyan-100"
          >
            <Users className="h-5 w-5" />
          </ControlButton>

          <ControlButton
            label={isDetailsOpen ? "Close meeting details" : "Meeting details"}
            onClick={onToggleDetails}
            active={isDetailsOpen}
            activeClassName="border-cyan-300/70 bg-cyan-400/18 text-cyan-100"
          >
            <Info className="h-5 w-5" />
          </ControlButton>

          <DeviceMenu room={room} />

          <div className="mx-1 h-7 w-px shrink-0 bg-white/10" />

          <ControlButton label="Leave session" onClick={onLeave} danger>
            <PhoneOff className="h-5 w-5" />
          </ControlButton>
        </div>
      </div>
    </TooltipProvider>
  );
}

function DeviceMenu({ room }) {
  const [devices, setDevices] = useState({ mics: [], cameras: [] });

  const loadDevices = useCallback(async () => {
    if (!navigator?.mediaDevices?.enumerateDevices) return;

    const all = await navigator.mediaDevices.enumerateDevices();
    setDevices({
      mics: all.filter((device) => device.kind === "audioinput"),
      cameras: all.filter((device) => device.kind === "videoinput"),
    });
  }, []);

  const switchMic = useCallback(
    async (deviceId) => {
      await room?.switchActiveDevice("audioinput", deviceId);
    },
    [room],
  );

  const switchCamera = useCallback(
    async (deviceId) => {
      await room?.switchActiveDevice("videoinput", deviceId);
    },
    [room],
  );

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
              className="h-11 w-11 rounded-full border border-white/10 bg-white/8 text-white shadow-sm hover:border-white/30 hover:bg-white/14 sm:h-12 sm:w-12"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Device settings</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="max-h-96 w-64 overflow-y-auto border-white/10 bg-slate-900 text-white">
        <DropdownMenuLabel className="text-xs text-slate-400">Microphone</DropdownMenuLabel>
        {devices.mics.length > 0 ? (
          devices.mics.map((device) => (
            <DropdownMenuItem
              key={device.deviceId}
              onClick={() => switchMic(device.deviceId)}
              className="cursor-pointer text-sm hover:bg-white/10"
            >
              {device.label || "Microphone"}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-sm text-slate-500">
            No microphones found
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuLabel className="text-xs text-slate-400">Camera</DropdownMenuLabel>
        {devices.cameras.length > 0 ? (
          devices.cameras.map((device) => (
            <DropdownMenuItem
              key={device.deviceId}
              onClick={() => switchCamera(device.deviceId)}
              className="cursor-pointer text-sm hover:bg-white/10"
            >
              {device.label || "Camera"}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-sm text-slate-500">
            No cameras found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
