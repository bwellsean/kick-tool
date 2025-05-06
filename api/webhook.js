import { verify } from "crypto";
import { addMessage } from "../message-store.js";

// In-memory store for chat messages (use a database in production)
let chatMessages = [];

// Log webhook payloads to help debug
export default async function handler(req, res) {
  // Log all request info to help debug
  console.log("[WEBHOOK] Request received:", {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  if (req.method !== "POST") {
    console.log("[WEBHOOK] Non-POST request rejected");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const eventType = req.headers["kick-event-type"];
    console.log(`[WEBHOOK] Event type: ${eventType}`);

    // Create a debug log file
    if (eventType === "chat.message.sent") {
      const { message_id, broadcaster, sender, content } = req.body;

      // Create a more detailed log
      const messageDetails = {
        id: message_id || `msg_${Date.now()}`,
        broadcaster_id: broadcaster?.user_id || broadcaster?.id || "unknown",
        broadcaster_name:
          broadcaster?.username || broadcaster?.slug || "unknown",
        sender_id: sender?.user_id || sender?.id || "anonymous",
        sender_name: sender?.username || "anonymous",
        sender_display_name: sender?.username || "anonymous",
        content: content || "",
        timestamp: new Date().toISOString(),
        received_at: new Date().toISOString(),
      };

      console.log(
        "[WEBHOOK] Chat message received:",
        JSON.stringify(messageDetails, null, 2)
      );

      // For testing - return message details in response
      return res.status(200).json({
        success: true,
        message_processed: true,
        message_details: messageDetails,
      });
    }

    // Return success for other events
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[WEBHOOK] Error:", error);
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
