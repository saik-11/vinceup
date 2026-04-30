"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useParticipantTracks } from "@/hooks/useLiveKit";
import { cn } from "@/lib/utils";
import { Hand, Mic, MicOff, MonitorUp, VideoOff } from "lucide-react";

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

/**
 * ParticipantTile — Google Meet style
 *
 * - When `featured`: Fills all available space, no aspect-ratio lock, massive avatar
 * - When not featured (strip tile): Fixed small size with aspect-video
 * - Name shown as a small floating pill at bottom-left
 * - Mic status as a small circle at bottom-right
 */
export function ParticipantTile({
  participant,
  isActiveSpeaker,
  isLocal,
  hasRaisedHand = false,
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
        "group relative flex items-center justify-center overflow-hidden text-left",
        "transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none",
        /* Featured tile fills the parent entirely — no aspect-ratio lock */
        featured
          ? "h-full w-full rounded-xl bg-[#1a1a2e] sm:rounded-2xl"
          : "aspect-video w-full rounded-xl bg-[#1a1a2e]",
        /* Border: subtle by default, glow on active speaker */
        isActiveSpeaker
          ? "ring-2 ring-cyan-400/60"
          : "ring-1 ring-white/[0.08]",
        selected && "ring-2 ring-white/40",
        onClick && "cursor-pointer hover:ring-white/20",
        className,
      )}
    >
      {/* Video */}
      {hasVideo ? (
        <TrackElement
          track={visibleTrack}
          isVideo
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            hasScreenShare && "bg-black object-contain",
          )}
        />
      ) : (
        /* No video — large avatar like Google Meet */
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center rounded-full",
              "bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400",
              featured
                ? "h-20 w-20 text-2xl sm:h-28 sm:w-28 sm:text-4xl md:h-36 md:w-36 md:text-5xl"
                : compact
                  ? "h-10 w-10 text-sm"
                  : "h-14 w-14 text-lg sm:h-16 sm:w-16 sm:text-xl",
            )}
          >
            <span className="font-semibold text-white select-none">{getInitials(name)}</span>
          </div>
          {/* Show name under avatar only on featured tile when no video */}
          {featured && (
            <span className="text-sm font-medium text-slate-300 sm:text-base">{displayName}</span>
          )}
        </div>
      )}

      {/* Remote audio */}
      {!isLocal && microphone && <TrackElement track={microphone} isVideo={false} />}

      {/* Active speaker glow ring (animated) */}
      <AnimatePresence>
        {isActiveSpeaker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-cyan-400/70 ring-offset-0"
          />
        )}
      </AnimatePresence>

      {/* Screen share badge */}
      {hasScreenShare && (
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <MonitorUp className="h-3.5 w-3.5" />
          Presenting
        </div>
      )}

      {/* ✋ Hand raised badge */}
      <AnimatePresence>
        {hasRaisedHand && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={cn(
              "absolute z-10 flex items-center gap-1 rounded-md bg-amber-400 px-2 py-1 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/30",
              featured
                ? "right-3 top-3 sm:right-4 sm:top-4"
                : "right-2 top-2",
            )}
          >
            <Hand className="h-3.5 w-3.5" />
            {!compact && <span>Raised</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        Bottom overlay — Google Meet style:
        - Small name pill on the left
        - Small mic indicator on the right
        - No full-width gradient bar
      */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-2 pb-2",
        featured ? "px-3 pb-3 sm:px-4 sm:pb-4" : "px-2 pb-2",
      )}>
        {/* Name pill */}
        <span
          className={cn(
            "min-w-0 truncate rounded-md bg-black/60 px-2 py-1 font-medium text-white backdrop-blur-sm",
            featured ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs",
            /* Hide name on very small strip tiles */
            compact && "max-w-28",
          )}
        >
          {displayName}
        </span>

        {/* Mic indicator */}
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full backdrop-blur-sm",
            micEnabled ? "bg-transparent" : "bg-red-500",
            featured ? "h-7 w-7 sm:h-8 sm:w-8" : "h-5 w-5 sm:h-6 sm:w-6",
          )}
          aria-label={micEnabled ? "Microphone on" : "Microphone muted"}
        >
          {!micEnabled && (
            <MicOff className={cn(
              "text-white",
              featured ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-2.5 w-2.5 sm:h-3 sm:w-3",
            )} />
          )}
        </span>
      </div>

      {/* "You" badge — top-left */}
      {isLocal && !featured && !hasScreenShare && !hasRaisedHand && (
        <div className="absolute left-2 top-2">
          <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            You
          </span>
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
