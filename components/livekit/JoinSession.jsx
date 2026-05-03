"use client";

import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLiveKit } from "@/hooks/useLiveKit";
import { LIVEKIT_DEFAULT_TTL_MINUTES, validateLivekitTokenRequest } from "@/lib/api/livekit";
import { LiveRoom } from "./LiveRoom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ChevronDown, ChevronUp, Loader2, Mic, MicOff, Users, Video, VideoOff } from "lucide-react";

/* ─── Constants ─── */

const TTL_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "240", label: "4 hours" },
  { value: "480", label: "8 hours" },
  { value: "720", label: "12 hours" },
];

const FIELD_ERROR_KEYS = {
  roomName: "room_name",
  identity: "identity",
  ttlMinutes: "ttl_minutes",
};

/* ─── Helpers ─── */

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "?"
  );
}

/* ─── Camera Preview Tile ─── */

/** Maps a MediaDevices error name to a user-friendly message. */
function getMediaErrorMessage(errorName) {
  switch (errorName) {
    case "NotReadableError":
    case "TrackStartError":
      return "Camera is in use by another app or tab. Close it and try again.";
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "Camera access was denied. Allow camera access in your browser settings.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "No camera found. Connect a camera and try again.";
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return "Your camera doesn't meet the required constraints.";
    default:
      return "Could not access camera. Check your device settings.";
  }
}

function CameraPreview({ name, micOn, camOn, onToggleMic, onToggleCam }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [camError, setCamError] = useState(null); // null = no error | string = error message

  useEffect(() => {
    let active = true;

    if (camOn) {
      setCamError(null);
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((s) => {
          if (!active) {
            s.getTracks().forEach((t) => t.stop());
            return;
          }
          setStream(s);
          setCamError(null);
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch((err) => {
          if (!active) return;
          setCamError(getMediaErrorMessage(err?.name));
        });
    } else {
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
      setCamError(null);
      if (videoRef.current) videoRef.current.srcObject = null;
    }

    return () => {
      active = false;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camOn]);

  const showVideo = camOn && !camError;

  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-muted">
      {/* Live video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          showVideo ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Avatar / error fallback */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center gap-3 px-4 text-center transition-opacity duration-300",
          showVideo ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary ring-4 ring-primary/20">
          {getInitials(name)}
        </div>

        {camError ? (
          /* Device-in-use / permission error banner */
          <div className="flex max-w-[240px] flex-col items-center gap-1.5">
            <span className="rounded-lg bg-destructive/15 border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive leading-snug">
              {camError}
            </span>
            <button
              type="button"
              onClick={onToggleCam}
              className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
            >
              Turn off camera
            </button>
          </div>
        ) : !camOn ? (
          <span className="rounded-full bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            Camera is off
          </span>
        ) : null}
      </div>

      {/* Name pill — bottom left */}
      {name && (
        <div className="absolute bottom-3 left-3 z-20 max-w-[calc(100%-5rem)] truncate rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {name} (You)
        </div>
      )}

      {/* Mic / Cam toggles — bottom right */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMic}
          aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
          title={micOn ? "Mute microphone" : "Unmute microphone"}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            micOn
              ? "border-border bg-background/80 text-foreground hover:bg-background"
              : "border-destructive/40 bg-destructive/90 text-destructive-foreground hover:bg-destructive",
          )}
        >
          {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onToggleCam}
          aria-label={camOn ? "Turn off camera" : "Turn on camera"}
          title={camOn ? "Turn off camera" : "Turn on camera"}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            camOn && !camError
              ? "border-border bg-background/80 text-foreground hover:bg-background"
              : "border-destructive/40 bg-destructive/90 text-destructive-foreground hover:bg-destructive",
          )}
        >
          {camOn && !camError ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

/* ─── JoinSession ─── */

export function JoinSession({
  sessionId,
  userId,
  userName,
  sessionDuration,
  role = "agent",
  onClose,
  className,
}) {
  const initialValues = useMemo(
    () => ({
      roomName: sessionId ? String(sessionId) : "",
      identity: userId ? String(userId) : "",
      participantName: userName ? String(userName) : "",
      ttlMinutes: sessionDuration ? String(sessionDuration) : String(LIVEKIT_DEFAULT_TTL_MINUTES),
    }),
    [sessionId, userId, userName, sessionDuration],
  );

  const [form, setForm] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Pre-join audio/video state — persisted across join so call screen is consistent
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);

  const { room, phase, connectionState, participants, error, validationErrors, joinedAt, join, retry, leave } =
    useLiveKit();

  const pending = phase === "fetching" || phase === "connecting";
  const errors = Object.keys(validationErrors).length > 0 ? validationErrors : formErrors;
  const hasErrors = Object.keys(errors).length > 0;

  const updateField = useCallback((field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => {
      const errorKey = FIELD_ERROR_KEYS[field];
      if (!errorKey || !current[errorKey]) return current;
      const next = { ...current };
      delete next[errorKey];
      return next;
    });
  }, []);

  const validateForm = useCallback(() => {
    try {
      validateLivekitTokenRequest({
        room_name: form.roomName,
        identity: form.identity,
        participant_name: form.participantName,
        ttl_minutes: Number(form.ttlMinutes),
      });
      setFormErrors({});
      return true;
    } catch (validationError) {
      setFormErrors(validationError.validationErrors ?? {});
      return false;
    }
  }, [form]);

  const handleJoin = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validateForm()) return;
      await join({
        roomName: form.roomName,
        identity: form.identity,
        participantName: form.participantName,
        ttlMinutes: Number(form.ttlMinutes),
        // Pass the user's pre-join media choices into the hook
        initialMicEnabled: micOn,
        initialCamEnabled: camOn,
      });
    },
    [form, join, validateForm, micOn, camOn],
  );

  const handleRetry = useCallback(async () => {
    await retry();
  }, [retry]);

  const handleLeave = useCallback(async () => {
    await leave();
    // Navigate away immediately — phase is now "leaving" so no pre-join flicker
    onClose?.();
  }, [leave, onClose]);

  // ── Render: actively leaving — show nothing (prevents pre-join flash) ──
  if (phase === "leaving") {
    return (
      <div className={cn("flex h-screen w-full items-center justify-center bg-slate-950", className)}>
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Leaving session…</span>
        </div>
      </div>
    );
  }

  // ── Render: in-call ──
  if (phase === "connected" && room) {
    return (
      <LiveRoom
        room={room}
        roomName={form.roomName || "Live Session"}
        participants={participants}
        connectionState={connectionState}
        error={error}
        joinedAt={joinedAt}
        initialMicEnabled={micOn}
        initialCamEnabled={camOn}
        onLeave={handleLeave}
        className={className}
      />
    );
  }

  const durationLabel =
    TTL_OPTIONS.find((o) => o.value === form.ttlMinutes)?.label ?? `${form.ttlMinutes} min`;

  // Count of remote participants already in the room (from any pre-fetch)
  // This is 0 until we've connected, but the UI note keeps it friendly.
  const remoteCount = participants.filter((p) => p?.identity !== form.identity).length;

  return (
    <div
      className={cn(
        "flex min-h-screen w-full items-center justify-center px-4 py-10",
        className,
      )}
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-14">

        {/* ── Left: Camera preview ── */}
        <div className="w-full max-w-md flex-1 space-y-3 lg:sticky lg:top-10">
          <CameraPreview
            name={form.participantName || userName}
            micOn={micOn}
            camOn={camOn}
            onToggleMic={() => setMicOn((v) => !v)}
            onToggleCam={() => setCamOn((v) => !v)}
          />

          {/* Status chips */}
          <div className="flex items-center justify-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                micOn
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {micOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
              {micOn ? "Mic on" : "Mic off"}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                camOn
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {camOn ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />}
              {camOn ? "Camera on" : "Camera off"}
            </span>
          </div>

          {/* Joining indicator (shown while fetching/connecting) */}
          {pending && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{phase === "fetching" ? "Requesting access token…" : "Connecting to session…"}</span>
            </div>
          )}

          {/* Participant hint */}
          {!pending && remoteCount === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              You&apos;ll be the first to join this session.
            </p>
          )}
          {!pending && remoteCount > 0 && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>
                {remoteCount} participant{remoteCount !== 1 ? "s" : ""} already in the call
              </span>
            </div>
          )}
        </div>

        {/* ── Right: Join panel ── */}
        <form
          onSubmit={handleJoin}
          className="flex w-full max-w-sm flex-col"
          noValidate
        >
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {phase === "error" ? "Couldn't connect" : "Ready to join?"}
            </h1>
            {sessionId && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5 shrink-0" />
                Session · {durationLabel}
              </p>
            )}
          </div>

          {/* Error alert */}
          {phase === "error" && error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Display name (primary visible field) */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="livekit-participant-name" className="text-sm font-medium text-foreground">
              Your name
            </Label>
            <Input
              id="livekit-participant-name"
              value={form.participantName}
              onChange={(e) => updateField("participantName", e.target.value)}
              placeholder="Enter your name"
              disabled={pending}
              autoComplete="name"
              className="h-12 rounded-xl text-base"
            />
          </div>

          {/* Primary CTA */}
          {phase === "error" ? (
            <Button
              type="button"
              onClick={handleRetry}
              disabled={pending}
              className="mb-3 h-12 w-full rounded-full text-sm font-semibold"
            >
              Try again
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={pending}
              className="mb-3 h-12 w-full rounded-full text-sm font-semibold"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {phase === "fetching" ? "Getting token…" : "Connecting…"}
                </>
              ) : (
                "Join now"
              )}
            </Button>
          )}

          {/* Cancel */}
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={pending}
              className="mb-6 h-10 w-full rounded-full text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          )}

          {/* Advanced options (collapsed by default) */}
          <Separator className="mb-4" />

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>Advanced options</span>
            {showAdvanced ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              {/* Room Name */}
              <div className="space-y-1.5">
                <Label htmlFor="livekit-room-name" className="text-xs text-muted-foreground">
                  Room ID
                </Label>
                <Input
                  id="livekit-room-name"
                  value={form.roomName}
                  onChange={(e) => updateField("roomName", e.target.value)}
                  placeholder="room-id"
                  aria-invalid={Boolean(errors.room_name)}
                  disabled={pending}
                  className={cn(
                    "h-10 rounded-lg text-sm",
                    errors.room_name && "border-destructive focus-visible:ring-destructive/30",
                  )}
                />
                {errors.room_name && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.room_name}
                  </p>
                )}
              </div>

              {/* Identity */}
              <div className="space-y-1.5">
                <Label htmlFor="livekit-identity" className="text-xs text-muted-foreground">
                  Participant ID
                </Label>
                <Input
                  id="livekit-identity"
                  value={form.identity}
                  onChange={(e) => updateField("identity", e.target.value)}
                  placeholder={`${role}-id`}
                  aria-invalid={Boolean(errors.identity)}
                  disabled={pending}
                  className={cn(
                    "h-10 rounded-lg text-sm",
                    errors.identity && "border-destructive focus-visible:ring-destructive/30",
                  )}
                />
                {errors.identity && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.identity}
                  </p>
                )}
              </div>

              {/* Duration — only when not pre-set by the parent */}
              {!sessionDuration && (
                <div className="space-y-1.5">
                  <Label htmlFor="livekit-duration" className="text-xs text-muted-foreground">
                    Session duration
                  </Label>
                  <Select
                    value={form.ttlMinutes}
                    onValueChange={(value) => updateField("ttlMinutes", value)}
                    disabled={pending}
                  >
                    <SelectTrigger
                      id="livekit-duration"
                      aria-invalid={Boolean(errors.ttl_minutes)}
                      className={cn(
                        "h-10 w-full rounded-lg text-sm",
                        errors.ttl_minutes && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {TTL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ttl_minutes && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {errors.ttl_minutes}
                    </p>
                  )}
                </div>
              )}

              {hasErrors && (
                <p className="text-xs text-destructive">
                  Please fix the errors above before joining.
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
