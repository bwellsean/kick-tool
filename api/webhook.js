import { verify } from "crypto";
import { addMessage } from "../message-store.js";

// In-memory store for chat messages (use a database in production)
let chatMessages = [];

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get headers from the request
    const messageId = req.headers["kick-event-message-id"];
    const timestamp = req.headers["kick-event-message-timestamp"];
    const signature = req.headers["kick-event-signature"];
    const eventType = req.headers["kick-event-type"];

    console.log(`Received ${eventType} event`);

    // Process event based on type
    if (eventType === "chat.message.sent") {
      const { message_id, broadcaster, sender, content } = req.body;

      // Log to console - use safe property access
      const broadcasterId = broadcaster?.id || "unknown";
      const broadcasterName =
        broadcaster?.username || broadcaster?.slug || "unknown";
      const senderName = sender?.username || "unknown";
      const senderDisplayName = sender?.username || "unknown";

      console.log(
        `[${broadcasterName}'s chat] ${senderDisplayName}: ${content}`
      );

      // Store the message in our message store
      addMessage({
        id: message_id,
        broadcaster_id: broadcasterId,
        broadcaster_name: broadcasterName,
        sender_id: sender?.id || "anonymous",
        sender_name: senderName,
        sender_display_name: senderDisplayName,
        content: content,
        timestamp: new Date().toISOString(),
        received_at: new Date().toISOString(),
      });
    }

    // Always return 200 OK for webhook requests
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Expose an endpoint to get messages
export function getMessages() {
  return [...chatMessages];
}

// Helper function to verify signature
async function verifySignature(messageId, timestamp, rawBody, signature) {
  try {
    // Fetch Kick's public key (consider caching this)
    const publicKeyResponse = await fetch(
      "https://api.kick.com/public/v1/public-key"
    );
    const publicKeyData = await publicKeyResponse.json();
    const publicKey = publicKeyData.data.public_key;

    const dataToVerify = `${messageId}.${timestamp}.${rawBody}`;
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(dataToVerify);
    return verifier.verify(publicKey, signature, "base64");
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}
