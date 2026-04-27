"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLiveKit } from "@/hooks/useLiveKit";
import {
  getLivekitErrorMessage,
  LIVEKIT_DEFAULT_TTL_MINUTES,
  validateLivekitTokenRequest,
} from "@/lib/api/livekit";
import { LiveRoom } from "./LiveRoom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, RefreshCw, Video } from "lucide-react";

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

export function JoinSession({ sessionId, userId, userName, role = "agent", onClose, className }) {
  const initialValues = useMemo(
    () => ({
      roomName: sessionId ? String(sessionId) : "",
      identity: userId ? String(userId) : "",
      participantName: userName ? String(userName) : "",
      ttlMinutes: String(LIVEKIT_DEFAULT_TTL_MINUTES),
    }),
    [sessionId, userId, userName],
  );

  const [form, setForm] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const { room, phase, connectionState, participants, error, validationErrors, join, retry, leave } = useLiveKit();

  const pending = phase === "fetching" || phase === "connecting";
  const errors = Object.keys(validationErrors).length > 0 ? validationErrors : formErrors;

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
      toast.error(validationError.message);
      return false;
    }
  }, [form]);

  const handleJoin = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validateForm()) return;

      const result = await join({
        roomName: form.roomName,
        identity: form.identity,
        participantName: form.participantName,
        ttlMinutes: Number(form.ttlMinutes),
      });

      if (!result?.ok) {
        toast.error(getLivekitErrorMessage(result?.error));
      }
    },
    [form, join, validateForm],
  );

  const handleRetry = useCallback(async () => {
    const result = await retry();
    if (!result?.ok) {
      toast.error(getLivekitErrorMessage(result?.error));
    }
  }, [retry]);

  const handleLeave = useCallback(async () => {
    await leave();
    onClose?.();
  }, [leave, onClose]);

  if (phase === "connected" && room) {
    return (
      <LiveRoom
        room={room}
        roomName={form.roomName || "Live Session"}
        participants={participants}
        connectionState={connectionState}
        error={error}
        onLeave={handleLeave}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-slate-950 p-4 text-white sm:p-6",
        className,
      )}
    >
      <Card className="w-full max-w-md border-white/10 bg-slate-900/95 text-white shadow-2xl shadow-black/30">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white">
            {pending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Video className="h-6 w-6" />}
          </div>
          <CardTitle>Join Call</CardTitle>
          <CardDescription className="text-slate-400">
            Enter the LiveKit session details for this call.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleJoin}>
          <CardContent className="space-y-4">
            {phase === "error" && (
              <div className="flex gap-3 rounded-md border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="livekit-room-name" className="text-slate-200">
                Room Name
              </Label>
              <Input
                id="livekit-room-name"
                value={form.roomName}
                onChange={(event) => updateField("roomName", event.target.value)}
                placeholder="room-id"
                aria-invalid={Boolean(errors.room_name)}
                disabled={pending}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
              {errors.room_name && <p className="text-xs text-red-300">{errors.room_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="livekit-identity" className="text-slate-200">
                Identity
              </Label>
              <Input
                id="livekit-identity"
                value={form.identity}
                onChange={(event) => updateField("identity", event.target.value)}
                placeholder={`${role}-id`}
                aria-invalid={Boolean(errors.identity)}
                disabled={pending}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
              {errors.identity && <p className="text-xs text-red-300">{errors.identity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="livekit-participant-name" className="text-slate-200">
                Participant Name
              </Label>
              <Input
                id="livekit-participant-name"
                value={form.participantName}
                onChange={(event) => updateField("participantName", event.target.value)}
                placeholder="Display name"
                disabled={pending}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="livekit-duration" className="text-slate-200">
                Session Duration
              </Label>
              <Select
                value={form.ttlMinutes}
                onValueChange={(value) => updateField("ttlMinutes", value)}
                disabled={pending}
              >
                <SelectTrigger
                  id="livekit-duration"
                  aria-invalid={Boolean(errors.ttl_minutes)}
                  className="w-full border-white/10 bg-white/5 text-white"
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
              {errors.ttl_minutes && <p className="text-xs text-red-300">{errors.ttl_minutes}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            {phase === "error" ? (
              <Button
                type="button"
                onClick={handleRetry}
                disabled={pending}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                {phase === "fetching" ? "Getting Token" : phase === "connecting" ? "Connecting" : "Join Call"}
              </Button>
            )}
            {onClose && (
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={pending}
                className="w-full text-slate-300 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Cancel
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
