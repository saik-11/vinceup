"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Room, RoomEvent, ConnectionState, Track, ParticipantEvent } from "livekit-client";
import { fetchLivekitToken, getLivekitErrorMessage, getTokenExpiryMs } from "@/lib/api/livekit";

const TOKEN_REFRESH_BUFFER_MS = 60_000;
const PUBLISH_RETRY_DELAY_MS = 1500;
const PUBLISH_MAX_RETRIES = 3;

function toApiParams({ roomName, identity, participantName, ttlMinutes }) {
  return {
    room_name: roomName,
    identity,
    participant_name: participantName,
    ttl_minutes: ttlMinutes,
  };
}

/**
 * Wait until the room engine is fully ready to publish tracks.
 * The "engine not connected within timeout" error happens when
 * enableCameraAndMicrophone() fires before the internal engine
 * is fully established. We wait for the engine signal.
 */
async function waitForEngineConnected(activeRoom, timeoutMs = 8000) {
  // If already connected via engine, resolve immediately
  if (activeRoom.state === ConnectionState.Connected && activeRoom.engine?.client?.isConnected) {
    return;
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      // Still resolve — we'll try to publish anyway
      resolve();
    }, timeoutMs);

    const onConnected = () => {
      cleanup();
      // Small additional buffer for engine readiness
      setTimeout(resolve, 500);
    };

    const cleanup = () => {
      clearTimeout(timer);
      activeRoom.off(RoomEvent.Connected, onConnected);
    };

    activeRoom.on(RoomEvent.Connected, onConnected);

    // If already connected, resolve with buffer
    if (activeRoom.state === ConnectionState.Connected) {
      cleanup();
      setTimeout(resolve, 500);
    }
  });
}

export function useLiveKit() {
  const roomRef = useRef(null);
  const lastParamsRef = useRef(null);
  const refreshTimerRef = useRef(null);
  const refreshTokenRef = useRef(null);

  // "idle" | "fetching" | "connecting" | "connected" | "leaving" | "error"
  const [phase, setPhase] = useState("idle");
  const [connectionState, setConnectionState] = useState(ConnectionState.Disconnected);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [room, setRoom] = useState(null);
  /** ISO timestamp set when the room reaches "connected" phase */
  const [joinedAt, setJoinedAt] = useState(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const scheduleTokenRefresh = useCallback(
    (token) => {
      clearRefreshTimer();

      const expiresAt = getTokenExpiryMs(token);
      if (!expiresAt) return;

      const delay = Math.max(expiresAt - Date.now() - TOKEN_REFRESH_BUFFER_MS, 10_000);
      refreshTimerRef.current = window.setTimeout(() => {
        refreshTokenRef.current?.();
      }, delay);
    },
    [clearRefreshTimer],
  );

  const ensureRoom = useCallback(() => {
    if (roomRef.current) return roomRef.current;

    const nextRoom = new Room({
      adaptiveStream: true,
      dynacast: true,
      audioCaptureDefaults: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      videoCaptureDefaults: {
        resolution: { width: 1280, height: 720, frameRate: 30 },
      },
    });

    roomRef.current = nextRoom;
    setRoom(nextRoom);
    return nextRoom;
  }, []);

  const syncParticipants = useCallback((activeRoom) => {
    setParticipants([activeRoom.localParticipant, ...Array.from(activeRoom.remoteParticipants.values())]);
  }, []);

  /**
   * Enable media respecting the user's pre-join choices.
   * If the user turned off mic or cam on the pre-join screen, we honour that.
   */
  const enableMediaWithRetry = useCallback(
    async (activeRoom, { initialMicEnabled = true, initialCamEnabled = false } = {}, retries = PUBLISH_MAX_RETRIES) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          if (initialMicEnabled && initialCamEnabled) {
            await activeRoom.localParticipant.enableCameraAndMicrophone();
          } else if (initialMicEnabled) {
            await activeRoom.localParticipant.setMicrophoneEnabled(true);
          } else if (initialCamEnabled) {
            await activeRoom.localParticipant.setCameraEnabled(true);
          }
          // If both are off, we publish nothing — user will toggle manually
          return;
        } catch (err) {
          const isEngineError = String(err?.message ?? "").includes("engine not connected");
          if (!isEngineError || attempt === retries) {
            console.warn(`Media publish attempt ${attempt}/${retries} failed:`, err?.message);

            if (err?.name === "NotReadableError" || String(err?.message).includes("Device in use")) {
              import("sonner").then(({ toast }) => {
                toast.error("Camera or microphone is in use by another application. Please close it and try again.", { duration: 6000 });
              });
            } else if (err?.name === "NotAllowedError" || String(err?.message).includes("Permission denied")) {
              import("sonner").then(({ toast }) => {
                toast.error("Camera/microphone permissions are required to be heard or seen.", { duration: 6000 });
              });
            }

            // Don't throw — allow joining without media. User can toggle manually.
            return;
          }
          // Wait before retrying
          await new Promise((r) => setTimeout(r, PUBLISH_RETRY_DELAY_MS));
        }
      }
    },
    [],
  );

  const connectWithToken = useCallback(
    async (activeRoom, tokenData, mediaOptions) => {
      setPhase("connecting");
      setConnectionState(ConnectionState.Connecting);

      await activeRoom.connect(tokenData.url, tokenData.token);

      // Wait for engine to be truly ready before publishing
      await waitForEngineConnected(activeRoom);

      // Enable camera/mic with retry — don't let failures block join
      await enableMediaWithRetry(activeRoom, mediaOptions);

      syncParticipants(activeRoom);
      scheduleTokenRefresh(tokenData.token);
      setConnectionState(ConnectionState.Connected);
      setJoinedAt(new Date().toISOString());
      setPhase("connected");
    },
    [enableMediaWithRetry, scheduleTokenRefresh, syncParticipants],
  );

  const wireRoomEvents = useCallback(
    (activeRoom) => {
      activeRoom.removeAllListeners();

      const onConnectionState = (state) => setConnectionState(state);
      const onParticipantChange = () => syncParticipants(activeRoom);
      const onDisconnected = () => {
        clearRefreshTimer();
        // Keep phase as "leaving" here — JoinSession will call onClose()
        // which navigates away. Setting "idle" here causes the flicker.
        setParticipants([]);
        setConnectionState(ConnectionState.Disconnected);
      };
      const onReconnecting = () => setConnectionState(ConnectionState.Reconnecting);
      const onReconnected = () => setConnectionState(ConnectionState.Connected);

      activeRoom.on(RoomEvent.ConnectionStateChanged, onConnectionState);
      activeRoom.on(RoomEvent.ParticipantConnected, onParticipantChange);
      activeRoom.on(RoomEvent.ParticipantDisconnected, onParticipantChange);
      activeRoom.on(RoomEvent.TrackSubscribed, onParticipantChange);
      activeRoom.on(RoomEvent.TrackUnsubscribed, onParticipantChange);
      activeRoom.on(RoomEvent.LocalTrackPublished, onParticipantChange);
      activeRoom.on(RoomEvent.LocalTrackUnpublished, onParticipantChange);
      activeRoom.on(RoomEvent.TrackMuted, onParticipantChange);
      activeRoom.on(RoomEvent.TrackUnmuted, onParticipantChange);
      activeRoom.on(RoomEvent.ActiveSpeakersChanged, onParticipantChange);
      activeRoom.on(RoomEvent.Disconnected, onDisconnected);
      activeRoom.on(RoomEvent.Reconnecting, onReconnecting);
      activeRoom.on(RoomEvent.Reconnected, onReconnected);
      activeRoom.on(RoomEvent.DataReceived, onParticipantChange);
    },
    [clearRefreshTimer, syncParticipants],
  );

  const join = useCallback(
    async ({ roomName, identity, participantName, ttlMinutes, initialMicEnabled = true, initialCamEnabled = false }) => {
      setPhase("fetching");
      setError(null);
      setValidationErrors({});

      const params = { roomName, identity, participantName, ttlMinutes };
      lastParamsRef.current = params;

      let tokenData;
      try {
        tokenData = await fetchLivekitToken(toApiParams(params));
      } catch (joinError) {
        setValidationErrors(joinError.validationErrors ?? {});
        setError(getLivekitErrorMessage(joinError));
        setPhase("error");
        return { ok: false, error: joinError };
      }

      const activeRoom = ensureRoom();
      wireRoomEvents(activeRoom);

      try {
        await connectWithToken(activeRoom, tokenData, { initialMicEnabled, initialCamEnabled });
        return { ok: true };
      } catch (connectError) {
        activeRoom.removeAllListeners();
        clearRefreshTimer();
        setError(getLivekitErrorMessage(connectError));
        setPhase("error");
        return { ok: false, error: connectError };
      }
    },
    [clearRefreshTimer, connectWithToken, ensureRoom, wireRoomEvents],
  );

  const retry = useCallback(async () => {
    if (!lastParamsRef.current) return { ok: false };
    return join(lastParamsRef.current);
  }, [join]);

  const refreshToken = useCallback(async () => {
    if (!lastParamsRef.current || !roomRef.current) return;

    try {
      const tokenData = await fetchLivekitToken(toApiParams(lastParamsRef.current));
      if (typeof roomRef.current.refreshToken === "function") {
        await roomRef.current.refreshToken(tokenData.token);
      }
      scheduleTokenRefresh(tokenData.token);
    } catch (refreshError) {
      setError(getLivekitErrorMessage(refreshError));
    }
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  const leave = useCallback(async () => {
    // Set "leaving" immediately so JoinSession renders nothing (no flicker)
    setPhase("leaving");
    clearRefreshTimer();

    if (roomRef.current) {
      try {
        await roomRef.current.disconnect();
      } catch (err) {
        console.error("Failed to disconnect from room:", err);
      }
      roomRef.current.removeAllListeners();
      roomRef.current = null;
      setRoom(null);
    }

    lastParamsRef.current = null;
    setError(null);
    setValidationErrors({});
    setParticipants([]);
    setJoinedAt(null);
    setConnectionState(ConnectionState.Disconnected);
    // Keep phase as "leaving" — the caller (JoinSession → onClose) will navigate
    // away immediately after this resolves, so we never flip back to "idle".
  }, [clearRefreshTimer]);

  useEffect(() => {
    return () => {
      clearRefreshTimer();
      if (roomRef.current) {
        roomRef.current.disconnect().catch(console.error);
        roomRef.current.removeAllListeners();
      }
    };
  }, [clearRefreshTimer]);

  return {
    room,
    phase,
    connectionState,
    participants,
    error,
    validationErrors,
    joinedAt,
    join,
    retry,
    leave,
    refreshToken,
  };
}

export function useParticipantTracks(participant) {
  const [tracks, setTracks] = useState({
    camera: null,
    cameraEnabled: false,
    microphone: null,
    micEnabled: false,
    screenShare: null,
  });

  useEffect(() => {
    if (!participant) return;

    const update = () => {
      const camPub = participant.getTrackPublication(Track.Source.Camera);
      const micPub = participant.getTrackPublication(Track.Source.Microphone);
      const screenPub = participant.getTrackPublication(Track.Source.ScreenShare);

      setTracks({
        camera: camPub?.track ?? null,
        cameraEnabled: !camPub?.isMuted && Boolean(camPub?.track),
        microphone: micPub?.track ?? null,
        micEnabled: !micPub?.isMuted && Boolean(micPub?.track),
        screenShare: screenPub?.track ?? null,
      });
    };

    update();

    participant.on(ParticipantEvent.TrackPublished, update);
    participant.on(ParticipantEvent.TrackUnpublished, update);
    participant.on(ParticipantEvent.TrackSubscribed, update);
    participant.on(ParticipantEvent.TrackUnsubscribed, update);
    participant.on(ParticipantEvent.TrackMuted, update);
    participant.on(ParticipantEvent.TrackUnmuted, update);

    return () => {
      participant.off(ParticipantEvent.TrackPublished, update);
      participant.off(ParticipantEvent.TrackUnpublished, update);
      participant.off(ParticipantEvent.TrackSubscribed, update);
      participant.off(ParticipantEvent.TrackUnsubscribed, update);
      participant.off(ParticipantEvent.TrackMuted, update);
      participant.off(ParticipantEvent.TrackUnmuted, update);
    };
  }, [participant]);

  return tracks;
}
