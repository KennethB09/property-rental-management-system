import type { conversation } from "@/types/interface";
import { supabase } from "@/supabaseClient";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

type TenantChatProps = {
  conversation: conversation;
};

export default function TenantChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const newChannel = supabase.channel("test-channel", {
      config: {
        broadcast: { self: true },
      },
    });

    newChannel
      .on("broadcast", { event: "message" }, (payload) => {
        console.log("Received payload:", payload);
        // Use functional update to avoid stale state
        setMessages((prevMessages) => [
          ...prevMessages,
          payload.payload.message,
        ]);
      })
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, []); // Remove supabase from dependencies

  async function sendMessage() {
    if (!channel) {
      console.error("Channel not ready");
      return;
    }

    const resp = await channel.send({
      type: "broadcast",
      event: "message",
      payload: { message: message },
    });

    console.log("Send response:", resp);

    // Clear input after sending
    if (resp === "ok") {
      setMessage("");
    }
  }
  return (
    <div>
      <div>
        <div>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
