import { getMessages } from "../message-store.js";

// This is an API endpoint that uses Server-Sent Events to push messages to clients

// Store messages temporarily in memory (use a database in production)
let chatMessages = [];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request (for CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      // Get broadcaster_id from query if available
      const broadcasterId = req.query.broadcaster_id || null;

      // Get messages from the store
      const messages = getMessages(broadcasterId);

      // Return JSON response
      return res.status(200).json({
        success: true,
        count: messages.length,
        messages: messages,
      });
    } catch (error) {
      console.error("Error retrieving messages:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve messages",
      });
    }
  } else if (req.method === "POST") {
    // This allows other endpoints to add messages
    const { message } = req.body;
    if (message) {
      chatMessages.push(message);
      // Limit stored messages to 100
      if (chatMessages.length > 100) {
        chatMessages.shift();
      }
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "No message provided" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
