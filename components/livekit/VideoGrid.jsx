"use client";

import { useEffect, useMemo, useState } from "react";
import { RoomEvent } from "livekit-client";
import { ParticipantTile } from "./ParticipantTile";
import { cn } from "@/lib/utils";

function firstRemoteOrLocal(room, participants) {
  return participants.find((participant) => participant !== room?.localParticipant) ?? participants[0] ?? null;
}

export function VideoGrid({ room, participants, className }) {
  const [activeSpeakers, setActiveSpeakers] = useState([]);
  const [pinnedIdentity, setPinnedIdentity] = useState(null);

  useEffect(() => {
    if (!room) return;

    const handleSpeakers = (speakers) => {
      setActiveSpeakers(speakers.map((speaker) => speaker.identity));
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
      participants.find((participant) => participant.identity === activeSpeakerIdentity) ??
      participants.find((participant) => participant.identity === pinnedIdentity) ??
      firstRemoteOrLocal(room, participants)
    );
  }, [activeSpeakerIdentity, participants, pinnedIdentity, room]);

  if (!participants || participants.length === 0) {
    return (
      <div className={cn("flex min-h-0 flex-1 items-center justify-center p-6 text-slate-400", className)}>
        <p className="text-sm">Waiting for participants to join...</p>
      </div>
    );
  }

  const stripParticipants = participants.filter((participant) => participant.identity !== spotlightParticipant?.identity);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3 p-3 pb-28 sm:p-4 sm:pb-28 lg:flex-row", className)}>
      <main className="flex min-h-0 flex-1 items-center justify-center">
        <div className="w-full max-w-6xl transition-all duration-300">
          <ParticipantTile
            key={spotlightParticipant.identity}
            participant={spotlightParticipant}
            isLocal={spotlightParticipant === room?.localParticipant}
            isActiveSpeaker={activeIdentities.has(spotlightParticipant.identity)}
            featured
            selected={pinnedIdentity === spotlightParticipant.identity}
            className="max-h-[calc(100vh-13rem)] min-h-[18rem] bg-slate-950 sm:min-h-[24rem] lg:max-h-[calc(100vh-10rem)]"
          />
        </div>
      </main>

      {stripParticipants.length > 0 && (
        <aside className="hidden min-h-0 w-72 shrink-0 overflow-y-auto pr-1 lg:block xl:w-80">
          <div className="grid grid-cols-1 gap-3">
            {stripParticipants.map((participant) => (
              <ParticipantTile
                key={participant.identity}
                participant={participant}
                isLocal={participant === room?.localParticipant}
                isActiveSpeaker={activeIdentities.has(participant.identity)}
                selected={pinnedIdentity === participant.identity}
                onClick={() => setPinnedIdentity(participant.identity)}
              />
            ))}
          </div>
        </aside>
      )}

      {stripParticipants.length > 0 && (
        <div className="lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {stripParticipants.map((participant) => (
              <ParticipantTile
                key={participant.identity}
                participant={participant}
                isLocal={participant === room?.localParticipant}
                isActiveSpeaker={activeIdentities.has(participant.identity)}
                selected={pinnedIdentity === participant.identity}
                compact
                onClick={() => setPinnedIdentity(participant.identity)}
                className="h-28 min-w-44"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
