"use client";

import { useEffect, useMemo, useState } from "react";
import { RoomEvent } from "livekit-client";
import { AnimatePresence, motion } from "framer-motion";
import { ParticipantTile } from "./ParticipantTile";
import { cn } from "@/lib/utils";

function firstRemoteOrLocal(room, participants) {
  return participants.find((p) => p !== room?.localParticipant) ?? participants[0] ?? null;
}

/* ─── Animation variants ─── */

const spotlightVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 28 },
  },
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
 * VideoGrid — Google Meet layout
 *
 * The spotlight tile fills 100% of the available vertical space.
 * The control bar is absolutely positioned over it (handled by LiveRoom).
 * Strip tiles are small thumbnails on the right (desktop) or bottom (mobile).
 */
export function VideoGrid({ room, participants, raisedHands = new Set(), className }) {
  const [activeSpeakers, setActiveSpeakers] = useState([]);
  const [pinnedIdentity, setPinnedIdentity] = useState(null);

  useEffect(() => {
    if (!room) return;

    const handleSpeakers = (speakers) => {
      setActiveSpeakers(speakers.map((s) => s.identity));
    };

    handleSpeakers(room.activeSpeakers ?? []);
    room.on(RoomEvent.ActiveSpeakersChanged, handleSpeakers);
    return () => room.off(RoomEvent.ActiveSpeakersChanged, handleSpeakers);
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

  const stripParticipants = participants.filter(
    (p) => p.identity !== spotlightParticipant?.identity,
  );
  const hasStrip = stripParticipants.length > 0;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-1",
        /* Desktop: horizontal layout (video + side strip) */
        "flex-col lg:flex-row",
        /* Padding: small gutter from edges, Google Meet uses ~8px */
        "gap-2 p-2 sm:gap-2.5 sm:p-2.5",
        className,
      )}
    >
      {/* ── Spotlight tile ── */}
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

      {/* ── Desktop: Side strip (right column) ── */}
      {hasStrip && (
        <aside className="hidden w-48 shrink-0 flex-col gap-2 overflow-y-auto lg:flex xl:w-56 2xl:w-60">
          {stripParticipants.map((participant, i) => (
            <motion.div
              key={participant.identity}
              variants={stripItemVariants}
              initial="initial"
              animate="animate"
              custom={i}
            >
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

      {/* ── Mobile / Tablet: Bottom strip ── */}
      {hasStrip && (
        <div className="shrink-0 lg:hidden">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {stripParticipants.map((participant, i) => (
              <motion.div
                key={participant.identity}
                variants={stripItemVariants}
                initial="initial"
                animate="animate"
                custom={i}
                className="shrink-0"
              >
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
