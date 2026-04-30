"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RoomEvent } from "livekit-client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageSquare, Send, X } from "lucide-react";

const CHAT_TOPIC = "lk-chat-topic";

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * @param {Object} props
 * @param {boolean} [props.embedded] – When true, renders without its own header/close button (parent handles that).
 */
export function ChatPanel({ room, localIdentity, onClose, embedded = false, className }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!room) return;

    const handleData = (payload, participant) => {
      try {
        const text = new TextDecoder().decode(payload);
        const parsed = JSON.parse(text);
        if (parsed.topic !== CHAT_TOPIC) return;

        setMessages((current) => [
          ...current,
          {
            id: `${Date.now()}-${Math.random()}`,
            sender: participant?.name || participant?.identity || "Unknown",
            text: parsed.text,
            ts: Date.now(),
            isLocal: false,
          },
        ]);
      } catch {
        // Ignore malformed data packets.
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => room.off(RoomEvent.DataReceived, handleData);
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    const text = draft.trim();
    if (!text || !room) return;

    const payload = JSON.stringify({ topic: CHAT_TOPIC, text });
    const encoded = new TextEncoder().encode(payload);
    room.localParticipant.publishData(encoded, { reliable: true });

    setMessages((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        sender: localIdentity ?? "You",
        text,
        ts: Date.now(),
        isLocal: true,
      },
    ]);
    setDraft("");
  }, [draft, localIdentity, room]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col",
        !embedded && "border-l border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl",
        className,
      )}
    >
      {/* Header — only shown in non-embedded mode */}
      {!embedded && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-cyan-200">
              <MessageSquare className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-white">In-call messages</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close chat"
            className="h-9 w-9 rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1 px-4 py-4">
        {messages.length === 0 ? (
          <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-6 text-center">
            <p className="text-sm font-medium text-white">No messages yet</p>
            <p className="mt-1 text-xs text-slate-400">Messages are visible only during this call.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("flex flex-col gap-1", message.isLocal ? "items-end" : "items-start")}
              >
                <span className="px-1 text-xs text-slate-500">
                  {message.isLocal ? "You" : message.sender} | {formatTime(message.ts)}
                </span>
                <div
                  className={cn(
                    "max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm shadow-sm",
                    message.isLocal
                      ? "rounded-br-md bg-cyan-500 text-slate-950"
                      : "rounded-bl-md bg-white/10 text-slate-100",
                  )}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message"
          className="h-10 flex-1 rounded-full border-white/10 bg-white/8 px-4 text-sm text-white placeholder:text-slate-500 focus-visible:ring-cyan-300/40"
        />
        <Button
          size="icon"
          onClick={sendMessage}
          disabled={!draft.trim()}
          aria-label="Send message"
          className="h-10 w-10 rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
