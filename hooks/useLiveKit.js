"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Room, RoomEvent, ConnectionState, Track, ParticipantEvent } from "livekit-client";
import { fetchLivekitToken, getLivekitErrorMessage, getTokenExpiryMs } from "@/lib/api/livekit";

const TOKEN_REFRESH_BUFFER_MS = 60_000;

function toApiParams({ roomName, identity, participantName, ttlMinutes }) {
  return {
    room_name: roomName,
    identity,
    participant_name: participantName,
    ttl_minutes: ttlMinutes,
  };
}

export function useLiveKit() {
  const roomRef = useRef(null);
  const lastParamsRef = useRef(null);
  const refreshTimerRef = useRef(null);
  const refreshTokenRef = useRef(null);

  const [phase, setPhase] = useState("idle");
  const [connectionState, setConnectionState] = useState(ConnectionState.Disconnected);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [room, setRoom] = useState(null);

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

  const connectWithToken = useCallback(
    async (activeRoom, tokenData) => {
      setPhase("connecting");
      setConnectionState(ConnectionState.Connecting);
      await activeRoom.connect(tokenData.url, tokenData.token);
      await activeRoom.localParticipant.enableCameraAndMicrophone();
      syncParticipants(activeRoom);
      scheduleTokenRefresh(tokenData.token);
      setConnectionState(ConnectionState.Connected);
      setPhase("connected");
    },
    [scheduleTokenRefresh, syncParticipants],
  );

  const wireRoomEvents = useCallback(
    (activeRoom) => {
      activeRoom.removeAllListeners();

      const onConnectionState = (state) => setConnectionState(state);
      const onParticipantChange = () => syncParticipants(activeRoom);
      const onDisconnected = () => {
        clearRefreshTimer();
        setPhase("idle");
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
    },
    [clearRefreshTimer, syncParticipants],
  );

  const join = useCallback(
    async ({ roomName, identity, participantName, ttlMinutes }) => {
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
        await connectWithToken(activeRoom, tokenData);
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
    clearRefreshTimer();

    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current.removeAllListeners();
      roomRef.current = null;
      setRoom(null);
    }

    lastParamsRef.current = null;
    setError(null);
    setValidationErrors({});
    setPhase("idle");
    setParticipants([]);
    setConnectionState(ConnectionState.Disconnected);
  }, [clearRefreshTimer]);

  useEffect(() => {
    return () => {
      clearRefreshTimer();
      if (roomRef.current) {
        roomRef.current.disconnect();
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
