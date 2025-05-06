import { verify } from "crypto";
import { getAccessToken, makeApiRequest } from "../app.js";

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

    // In production, verify the signature
    // const isValid = verifySignature(messageId, timestamp, JSON.stringify(req.body), signature);
    // if (!isValid) {
    //   return res.status(401).json({ message: 'Invalid signature' });
    // }

    // Process event based on type
    if (eventType === "chat.message.sent") {
      const { message_id, broadcaster, sender, content } = req.body;
      console.log(
        `[${broadcaster.username}'s chat] ${sender.username}: ${content}`
      );

      // Store or process the message as needed
      // You might want to use a database or websocket to deliver these messages
    }

    // Always return 200 OK for webhook requests
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
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
