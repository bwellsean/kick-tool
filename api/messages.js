import { getMessages } from "../message-store.js";

// For now, store messages in memory just for testing
let testMessages = [];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request (for CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // Log the request for debugging
    console.log("GET /api/messages", {
      query: req.query,
      headers: req.headers,
    });

    // For testing, return some demo messages if empty
    const broadcasterId = req.query.broadcaster_id;

    if (testMessages.length === 0) {
      // Add a test message to show the endpoint is working
      const now = new Date();
      testMessages.push({
        id: `test_${Date.now()}`,
        broadcaster_id: broadcasterId || "12345",
        broadcaster_name: "test_broadcaster",
        sender_name: "webhook_tester",
        sender_display_name: "Webhook Tester",
        content:
          "This is a test message to check if the messages API is working.",
        timestamp: now.toISOString(),
      });
    }

    // Filter by broadcaster ID if provided
    let messages = testMessages;
    if (broadcasterId) {
      messages = testMessages.filter(
        (msg) => String(msg.broadcaster_id) === String(broadcasterId)
      );
    }

    // Return the messages
    return res.status(200).json({
      success: true,
      count: messages.length,
      messages: messages,
    });
  } else if (req.method === "POST") {
    // Allow adding a message for testing
    try {
      const message = req.body;
      if (message) {
        console.log("POST /api/messages", { message });
        testMessages.unshift(message);
        if (testMessages.length > 100) {
          testMessages = testMessages.slice(0, 100);
        }
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ error: "No message provided" });
      }
    } catch (error) {
      console.error("Error adding message:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
