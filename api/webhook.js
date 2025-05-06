import { verify } from "crypto";
import { addMessage } from "../message-store.js";

// In-memory store for chat messages (use a database in production)
let chatMessages = [];

// Webhook handler - receives events from Kick
export default async function handler(req, res) {
  // Log all requests for debugging
  console.log("Webhook request received:", {
    method: req.method,
    headers: req.headers && {
      event: req.headers["kick-event-type"],
      version: req.headers["kick-event-version"],
    },
  });

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the event type from headers
    const eventType = req.headers["kick-event-type"];

    // Process chat messages
    if (eventType === "chat.message.sent") {
      const { message_id, broadcaster, sender, content } = req.body;

      console.log("Chat message received:", {
        from: sender?.username || "unknown",
        content: content,
      });

      // Format the message for storage
      const message = {
        id: message_id || `msg_${Date.now()}`,
        broadcaster_id: broadcaster?.user_id || broadcaster?.id,
        broadcaster_name:
          broadcaster?.username || broadcaster?.slug || "unknown",
        sender_id: sender?.user_id || sender?.id,
        sender_name: sender?.username || "anonymous",
        sender_display_name:
          sender?.display_name || sender?.username || "anonymous",
        content: content || "",
        timestamp: new Date().toISOString(),
      };

      // Store the message
      addMessage(message);

      console.log(`Stored message from ${message.sender_name}`);
    }

    // Always return success to acknowledge the webhook
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
