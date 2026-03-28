"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";
import "@livekit/components-styles";
import { useParams } from "next/navigation";

export default function RoomPage() {
  const { roomId } = useParams();
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);

  useEffect(() => {
    // -------------------------------------------------------
    // API must return:
    //   - participant_token (string) — JWT access token
    //   - server_url (string)        — wss://your-project.livekit.cloud
    //
    // Your API should generate the token using livekit-server-sdk
    // encoding these into the JWT:
    //   - room_name        — which room to join
    //   - identity          — unique user ID
    //   - name              — display name
    //   - grants.roomJoin   — true
    //   - grants.canPublish — true/false
    //   - grants.canSubscribe — true/false
    //   - ttl               — token expiry (e.g. "10m")
    // -------------------------------------------------------

    async function fetchToken() {
      try {
        const res = await fetch("/api/livekit-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${your-auth-token}`,
          },
          body: JSON.stringify({
            room_name: roomId,
            // participant_identity and participant_name
            // should come from your auth session on the backend
          }),
        });

        if (!res.ok) throw new Error("Failed to get token");
        const data = await res.json();
        setToken(data.participant_token);
        setServerUrl(data.server_url);
      } catch (err) {
        console.error("Error fetching LiveKit token:", err);
      }
    }

    fetchToken();
  }, [roomId]);

  if (!token || !serverUrl) {
    return <div>Connecting to room...</div>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      style={{ height: "100vh" }}
      onDisconnected={() => {
        // handle disconnect — e.g. redirect back
        window.location.href = "/";
      }}
    >
      {/* Full video conference UI — camera, mic, screen share, chat */}
      <VideoConference />
    </LiveKitRoom>
  );
}
// ```

// // **Step 4 — API checklist** (what your backend needs to provide at `;
// // POST / api / livekit -
// //   token`):
// // ```;
// /*
//  * ============================================================
//  * API CHECKLIST — Things your backend must handle
//  * ============================================================
//  *
//  * ENVIRONMENT VARIABLES (on your API server):
//  *   - LIVEKIT_API_KEY      — from LiveKit Cloud dashboard
//  *   - LIVEKIT_API_SECRET   — from LiveKit Cloud dashboard
//  *   - LIVEKIT_URL          — wss://your-project.livekit.cloud
//  *
//  * REQUEST BODY (what the client sends):
//  *   - room_name            — room to join (required)
//  *   - participant_identity  — unique user ID (optional, API can derive from auth)
//  *   - participant_name      — display name (optional, API can derive from auth)
//  *
//  * RESPONSE BODY (what the API must return):
//  *   - server_url           — the LIVEKIT_URL value
//  *   - participant_token    — JWT generated with livekit-server-sdk
//  *
//  * TOKEN MUST ENCODE (inside the JWT):
//  *   - identity             — unique per user
//  *   - room                 — which room
//  *   - grants.roomJoin      — true
//  *   - grants.canPublish    — true (for video/audio)
//  *   - grants.canSubscribe  — true (to see others)
//  *   - ttl                  — "10m" or similar
//  *
//  * SDK TO USE ON BACKEND:
//  *   npm: livekit-server-sdk
//  *   pip: livekit-api
//  *
//  * ============================================================
//  */
