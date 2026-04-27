"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useParticipantTracks } from "@/hooks/useLiveKit";
import { cn } from "@/lib/utils";
import { Mic, MicOff, MonitorUp, VideoOff } from "lucide-react";

function getInitials(name = "") {
  return name.split(" ").map((word) => word[0]).join("").substring(0, 2).toUpperCase() || "?";
}

export function getParticipantDisplayName(participant) {
  return participant?.name || participant?.identity || "Unknown";
}

function TrackElement({ track, isVideo, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !track) return;

    track.attach(element);
    return () => {
      track.detach(element);
    };
  }, [track]);

  return isVideo ? (
    <video ref={ref} autoPlay muted playsInline className={className} />
  ) : (
    <audio ref={ref} autoPlay />
  );
}

export function ParticipantTile({
  participant,
  isActiveSpeaker,
  isLocal,
  className,
  compact = false,
  featured = false,
  selected = false,
  onClick,
}) {
  const { camera, cameraEnabled, microphone, micEnabled, screenShare } = useParticipantTracks(participant);
  const name = getParticipantDisplayName(participant);
  const displayName = isLocal ? `${name} (You)` : name;
  const hasScreenShare = Boolean(screenShare);
  const visibleTrack = hasScreenShare ? screenShare : camera;
  const hasVideo = hasScreenShare || (cameraEnabled && camera);
  const TileElement = onClick ? "button" : "div";

  return (
    <TileElement
      {...(onClick
        ? {
            type: "button",
            onClick,
            "aria-label": `Show ${displayName}`,
          }
        : {})}
      className={cn(
        "group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-slate-900 text-left",
        "border shadow-sm shadow-black/20 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none",
        featured ? "rounded-2xl md:rounded-[1.35rem]" : "rounded-xl",
        isActiveSpeaker
          ? "border-cyan-300 shadow-lg shadow-cyan-500/20"
          : "border-white/10 hover:border-white/30",
        selected && "border-white/50",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {hasVideo ? (
        <TrackElement
          track={visibleTrack}
          isVideo
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]",
            hasScreenShare && "bg-black object-contain",
          )}
        />
      ) : (
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          <Avatar
            className={cn(
              "border-2 border-white/10 shadow-lg shadow-black/30",
              featured ? "h-24 w-24" : compact ? "h-11 w-11" : "h-16 w-16",
            )}
          >
            <AvatarFallback className="bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400 font-semibold text-white">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          {!compact && (
            <div className="flex items-center gap-2 text-slate-300">
              <VideoOff className="h-4 w-4" />
              <span className="max-w-48 truncate text-sm">{displayName}</span>
            </div>
          )}
        </div>
      )}

      {!isLocal && microphone && <TrackElement track={microphone} isVideo={false} />}

      {isActiveSpeaker && <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-cyan-300/90" />}

      {hasScreenShare && (
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          <MonitorUp className="h-3.5 w-3.5" />
          Sharing
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/75 via-black/35 to-transparent px-3 pb-3 pt-10">
        <span className={cn("min-w-0 truncate font-medium text-white", featured ? "text-sm md:text-base" : "text-xs")}>
          {displayName}
        </span>
        <span
          className={cn(
            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white backdrop-blur",
            micEnabled ? "bg-emerald-500/80" : "bg-red-500/90",
          )}
          aria-label={micEnabled ? "Microphone on" : "Microphone muted"}
        >
          {micEnabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
        </span>
      </div>

      {isActiveSpeaker && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-cyan-300 px-2 py-1 text-xs font-semibold text-slate-950 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
          Speaking
        </div>
      )}

      {isLocal && !featured && (
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur">You</span>
        </div>
      )}
    </TileElement>
  );
}

export function ParticipantStatusRow({ participant, isLocal, isActiveSpeaker, className }) {
  const { cameraEnabled, micEnabled } = useParticipantTracks(participant);
  const name = getParticipantDisplayName(participant);
  const displayName = isLocal ? `${name} (You)` : name;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-2 py-2 transition-colors",
        isActiveSpeaker && "bg-cyan-400/10",
        className,
      )}
    >
      <Avatar className="h-9 w-9 border border-white/10">
        <AvatarFallback className="bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400 text-xs font-semibold text-white">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-white">{displayName}</div>
        <div className="text-xs text-slate-400">{isActiveSpeaker ? "Speaking now" : "In the call"}</div>
      </div>
      <div className="flex items-center gap-1.5 text-slate-400">
        {!cameraEnabled && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-slate-300" title="Camera off">
            <VideoOff className="h-3.5 w-3.5" />
          </span>
        )}
        <span
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full",
            micEnabled ? "bg-emerald-400/15 text-emerald-300" : "bg-red-500/15 text-red-300",
          )}
          title={micEnabled ? "Microphone on" : "Microphone muted"}
        >
          {micEnabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
        </span>
      </div>
    </div>
  );
}
