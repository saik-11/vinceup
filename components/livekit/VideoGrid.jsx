"use client";

import { useEffect, useMemo, useState } from "react";
import { RoomEvent, Track } from "livekit-client";
import { AnimatePresence, motion } from "framer-motion";
import { ParticipantTile } from "./ParticipantTile";
import { cn } from "@/lib/utils";

function firstRemoteOrLocal(room, participants) {
  return participants.find((p) => p !== room?.localParticipant) ?? participants[0] ?? null;
}

/** Returns true if any participant in the room is screen-sharing. */
function anyoneScreenSharing(participants) {
  return participants.some((p) => {
    const pub = p.getTrackPublication(Track.Source.ScreenShare);
    return pub && !pub.isMuted;
  });
}

/**
 * Compute Tailwind grid-cols class for n participants.
 * Mirrors Google Meet's responsive tiling behaviour.
 */
function gridColsClass(count) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count <= 4) return "grid-cols-2";
  if (count <= 6) return "grid-cols-3";
  if (count <= 9) return "grid-cols-3";
  return "grid-cols-4";
}

/* ─── Animation variants ─── */

const tileVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 280, damping: 28 } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.12 } },
};

const spotlightVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 280, damping: 28 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
};

const stripItemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, type: "spring", stiffness: 300, damping: 28 },
  }),
};

/**
 * VideoGrid — responsive Google Meet–style layout.
 *
 * - When screen-sharing is active: spotlight + strip layout.
 * - When no screen-share: responsive equal-size grid (like Meet tiled view).
 */
export function VideoGrid({ room, participants, raisedHands = new Set(), className }) {
  const [activeSpeakers, setActiveSpeakers] = useState([]);
  const [pinnedIdentity, setPinnedIdentity] = useState(null);
  const [screenShareActive, setScreenShareActive] = useState(false);

  useEffect(() => {
    if (!room) return;

    const handleSpeakers = (speakers) => {
      setActiveSpeakers(speakers.map((s) => s.identity));
    };

    const updateScreenShare = () => {
      const allParticipants = [room.localParticipant, ...Array.from(room.remoteParticipants.values())];
      setScreenShareActive(anyoneScreenSharing(allParticipants));
    };

    handleSpeakers(room.activeSpeakers ?? []);
    updateScreenShare();

    room.on(RoomEvent.ActiveSpeakersChanged, handleSpeakers);
    room.on(RoomEvent.TrackSubscribed, updateScreenShare);
    room.on(RoomEvent.TrackUnsubscribed, updateScreenShare);
    room.on(RoomEvent.LocalTrackPublished, updateScreenShare);
    room.on(RoomEvent.LocalTrackUnpublished, updateScreenShare);
    room.on(RoomEvent.TrackMuted, updateScreenShare);
    room.on(RoomEvent.TrackUnmuted, updateScreenShare);

    return () => {
      room.off(RoomEvent.ActiveSpeakersChanged, handleSpeakers);
      room.off(RoomEvent.TrackSubscribed, updateScreenShare);
      room.off(RoomEvent.TrackUnsubscribed, updateScreenShare);
      room.off(RoomEvent.LocalTrackPublished, updateScreenShare);
      room.off(RoomEvent.LocalTrackUnpublished, updateScreenShare);
      room.off(RoomEvent.TrackMuted, updateScreenShare);
      room.off(RoomEvent.TrackUnmuted, updateScreenShare);
    };
  }, [room]);

  const activeSpeakerIdentity = activeSpeakers[0] ?? null;
  const activeIdentities = useMemo(() => new Set(activeSpeakers), [activeSpeakers]);

  const spotlightParticipant = useMemo(() => {
    if (!participants?.length) return null;
    return (
      participants.find((p) => p.identity === activeSpeakerIdentity) ??
      participants.find((p) => p.identity === pinnedIdentity) ??
      firstRemoteOrLocal(room, participants)
    );
  }, [activeSpeakerIdentity, participants, pinnedIdentity, room]);

  if (!participants || participants.length === 0) {
    return (
      <div className={cn("flex h-full items-center justify-center text-slate-400", className)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-14 w-14 animate-pulse rounded-full bg-white/5" />
          <p className="text-sm">Waiting for participants to join…</p>
        </div>
      </div>
    );
  }

  /* ── Spotlight + strip (screen-share mode) ── */
  if (screenShareActive) {
    const stripParticipants = participants.filter((p) => p.identity !== spotlightParticipant?.identity);
    const hasStrip = stripParticipants.length > 0;

    return (
      <div
        className={cn(
          "flex h-full min-h-0 flex-1 flex-col gap-2 p-2 sm:gap-2.5 sm:p-2.5 lg:flex-row",
          className,
        )}
      >
        {/* Spotlight */}
        <main className="relative min-h-0 min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={spotlightParticipant.identity}
              variants={spotlightVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0"
            >
              <ParticipantTile
                participant={spotlightParticipant}
                isLocal={spotlightParticipant === room?.localParticipant}
                isActiveSpeaker={activeIdentities.has(spotlightParticipant.identity)}
                hasRaisedHand={raisedHands.has(spotlightParticipant.identity)}
                featured
                selected={pinnedIdentity === spotlightParticipant.identity}
              />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Desktop side strip */}
        {hasStrip && (
          <aside className="hidden w-48 shrink-0 flex-col gap-2 overflow-y-auto lg:flex xl:w-56 2xl:w-60">
            {stripParticipants.map((participant, i) => (
              <motion.div key={participant.identity} variants={stripItemVariants} initial="initial" animate="animate" custom={i}>
                <ParticipantTile
                  participant={participant}
                  isLocal={participant === room?.localParticipant}
                  isActiveSpeaker={activeIdentities.has(participant.identity)}
                  hasRaisedHand={raisedHands.has(participant.identity)}
                  selected={pinnedIdentity === participant.identity}
                  onClick={() => setPinnedIdentity(participant.identity)}
                />
              </motion.div>
            ))}
          </aside>
        )}

        {/* Mobile bottom strip */}
        {hasStrip && (
          <div className="shrink-0 lg:hidden">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {stripParticipants.map((participant, i) => (
                <motion.div key={participant.identity} variants={stripItemVariants} initial="initial" animate="animate" custom={i} className="shrink-0">
                  <ParticipantTile
                    participant={participant}
                    isLocal={participant === room?.localParticipant}
                    isActiveSpeaker={activeIdentities.has(participant.identity)}
                    hasRaisedHand={raisedHands.has(participant.identity)}
                    selected={pinnedIdentity === participant.identity}
                    compact
                    onClick={() => setPinnedIdentity(participant.identity)}
                    className="h-20 w-32 sm:h-24 sm:w-40"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Responsive tile grid (no screen-share) ── */
  const count = participants.length;
  const cols = gridColsClass(count);
  // For 1 participant fill the whole space; for 2 use half-height rows, etc.
  const gridRows = count === 1 ? "grid-rows-1" : count === 2 ? "grid-rows-1" : "";

  return (
    <div
      className={cn(
        "grid h-full min-h-0 gap-2 p-2 sm:gap-2.5 sm:p-2.5",
        cols,
        gridRows,
        // Auto-fit rows to share available height evenly
        "auto-rows-fr",
        className,
      )}
    >
      <AnimatePresence>
        {participants.map((participant, i) => (
          <motion.div
            key={participant.identity}
            variants={tileVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={i}
            className="min-h-0 min-w-0"
          >
            <ParticipantTile
              participant={participant}
              isLocal={participant === room?.localParticipant}
              isActiveSpeaker={activeIdentities.has(participant.identity)}
              hasRaisedHand={raisedHands.has(participant.identity)}
              featured
              selected={pinnedIdentity === participant.identity}
              onClick={count > 1 ? () => setPinnedIdentity(
                pinnedIdentity === participant.identity ? null : participant.identity,
              ) : undefined}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
