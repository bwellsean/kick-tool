import { getMessages, addTestMessage } from "../message-store.js";

// API handler to fetch chat messages
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight CORS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      // Get broadcaster ID from query param
      const broadcasterId = req.query.broadcaster_id;

      // Get messages for this broadcaster
      const messages = getMessages(broadcasterId);

      // If testing is enabled and no messages, add a test message
      if (req.query.test === "true" && messages.length === 0 && broadcasterId) {
        addTestMessage(broadcasterId);
        const testMessages = getMessages(broadcasterId);
        return res.status(200).json({
          success: true,
          count: testMessages.length,
          messages: testMessages,
          is_test: true,
        });
      }

      // Return the messages
      return res.status(200).json({
        success: true,
        count: messages.length,
        messages: messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
