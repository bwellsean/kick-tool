// At the very top of server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  addMessage,
  getMessages,
  clearMessages,
  getToxicityStats,
  updateMessageToxicity,
} from "./message-store.js";
import { analyzeToxicity } from "./perspective-client.js";

// Add right after your imports
console.log("Sever starting...");
console.log("Loaded imports, checking functions:");
console.log({
  addMessage: typeof addMessage,
  getMessages: typeof getMessages,
  clearMessages: typeof clearMessages,
  getToxicityStats: typeof getToxicityStats,
  updateMessageToxicity: typeof updateMessageToxicity,
});

// For API_KEY in perspective-client.js
const API_KEY = process.env.PERSPECTIVE_API_KEY;

// For MAX_MESSAGES in message-store.js
const MAX_MESSAGES = parseInt(process.env.MAX_MESSAGES || 500);

// For your webhook URLs in chat-subscriber.js
const webhookUrl = process.env.RENDER_EXTERNAL_URL
  ? `${process.env.RENDER_EXTERNAL_URL}/webhook`
  : process.env.EXTERNAL_URL
  ? `${process.env.EXTERNAL_URL}/webhook`
  : "http://localhost:3000/webhook";

// Setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root directory

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes for UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Webhook endpoint for Kick
app.post("/webhook", async (req, res) => {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] 🔔 Webhook received:`, {
    method: req.method,
    headers: {
      "kick-event-type": req.headers["kick-event-type"],
      "kick-event-version": req.headers["kick-event-version"],
      "kick-event-message-id": req.headers["kick-event-message-id"],
      "content-type": req.headers["content-type"],
      "user-agent": req.headers["user-agent"],
    },
    body:
      typeof req.body === "object"
        ? JSON.stringify(req.body).substring(0, 200)
        : "not object",
  });

  // Process chat messages
  const eventType = req.headers["kick-event-type"];
  if (eventType === "chat.message.sent") {
    try {
      const { message_id, broadcaster, sender, content } = req.body;

      console.log(
        `💬 Chat message from ${sender?.username || "unknown"}: ${content}`
      );

      // Format and store the message
      const message = {
        id: message_id || `msg_${Date.now()}`,
        broadcaster_id: broadcaster?.user_id || broadcaster?.id || "unknown",
        broadcaster_name:
          broadcaster?.username || broadcaster?.slug || "unknown",
        sender_id: sender?.user_id || sender?.id || "anonymous",
        sender_name: sender?.username || "anonymous",
        sender_display_name:
          sender?.display_name || sender?.username || "anonymous",
        content: content || "",
        timestamp: new Date().toISOString(),
      };

      addMessage(message);

      // Log confirmation with more details
      console.log(
        `✅ Message stored for broadcaster ${
          message.broadcaster_id
        }. Total messages: ${getMessages().length}`
      );

      // Analyze toxicity (asynchronously)
      try {
        // Safe wrapper to handle potential undefined function
        const handleToxicity = async (messageId, content) => {
          try {
            if (typeof analyzeToxicity !== "function") {
              console.error("⚠️ analyzeToxicity is not a function");
              return;
            }

            if (typeof updateMessageToxicity !== "function") {
              console.error("⚠️ updateMessageToxicity is not a function");
              return;
            }
            if (content.startsWith("[") && content.endsWith("]")) {
              console.log(
                `skipping toxicity analysis for bracketed message:, ${messageId}`
              );
              const lowToxicityScore = {
                toxicity: 0.1,
                severe_toxicity: 0.01,
                identity_attack: 0.01,
                insult: 0.01,
                profanity: 0.01,
                threat: 0.01,
              };
              updateMessageToxicity(messageId, lowToxicityScore);
              return;
            }

            const toxicityScores = await analyzeToxicity(content);
            updateMessageToxicity(messageId, toxicityScores);
            console.log(
              `📊 Toxicity scores for message ${messageId}: ${JSON.stringify(
                toxicityScores
              )}`
            );
          } catch (err) {
            console.error("❌ Error in toxicity analysis:", err);
          }
        };

        // Execute without awaiting to avoid delaying webhook response
        handleToxicity(message.id, content);
      } catch (toxicityError) {
        console.error(
          "❌ Error initializing toxicity analysis:",
          toxicityError
        );
      }
    } catch (error) {
      console.error("❌ Error processing message:", error);
    }
  }

  // Always return success to acknowledge the webhook
  res.status(200).json({ success: true, received_at: timestamp });
});

// API endpoint to get messages
app.get("/api/messages", (req, res) => {
  try {
    const broadcasterId = req.query.broadcaster_id;
    const messages = getMessages(broadcasterId);

    console.log(
      `📤 Returning ${messages.length} messages for broadcaster ${
        broadcasterId || "all"
      }`
    );

    res.json({
      success: true,
      count: messages.length,
      messages: messages,
    });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching messages",
    });
  }
});

// Test endpoint to verify webhook connections
app.get("/test-webhook", (req, res) => {
  res.json({
    status: "Webhook endpoint is active and reachable",
    timestamp: new Date().toISOString(),
    message: "You can test sending webhooks to /webhook",
  });
});

// Add a test endpoint to manually add messages
app.post("/test-message", (req, res) => {
  try {
    const broadcasterId = req.query.broadcaster_id || "56391418";
    const testContent = req.query.bracketed
      ? "[This is a test bracketed message]"
      : `This is a test message sent at ${new Date().toLocaleTimeString()}`;

    // Create a test message
    const testMessage = {
      id: `test_${Date.now()}`,
      broadcaster_id: broadcasterId,
      broadcaster_name: "test_channel",
      sender_id: Math.floor(Math.random() * 10000),
      sender_name: "test_user",
      sender_display_name: "Test User",
      content: testContent,
      timestamp: new Date().toISOString(),
    };

    // Add the message to storage
    addMessage(testMessage);

    // Test toxicity handling directly
    handleToxicity(testMessage.id, testMessage.content);

    console.log(`Added test message for broadcaster ${broadcasterId}`);
    console.log(`Total messages: ${getMessages().length}`);

    res.json({
      success: true,
      message: "Test message added successfully",
      details: testMessage,
    });
  } catch (error) {
    console.error("Error adding test message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a new endpoint to get toxicity stats
app.get("/api/toxicity-stats", (req, res) => {
  try {
    const broadcasterId = req.query.broadcaster_id;
    const stats = getToxicityStats(broadcasterId);

    console.log(
      `📊 Returning toxicity stats for broadcaster ${broadcasterId || "all"}`
    );

    res.json({
      success: true,
      stats: {
        averageToxicity: stats.averageToxicity,
        mostToxicMessage: stats.mostToxicMessage
          ? {
              content: stats.mostToxicMessage.content,
              sender_name: stats.mostToxicMessage.sender_name,
              toxicity: stats.mostToxicMessage.toxicity,
            }
          : null,
        mostToxicUser: stats.mostToxicUser
          ? {
              username: stats.mostToxicUser.username,
              averageToxicity: stats.mostToxicUser.averageToxicity,
              messageCount: stats.mostToxicUser.messageCount,
              mostToxicMessage: {
                content: stats.mostToxicUser.mostToxicMessage.content,
                toxicity: stats.mostToxicUser.mostToxicMessage.toxicity,
              },
            }
          : null,
        mostPositiveUser: stats.mostPositiveUser
          ? {
              username: stats.mostPositiveUser.username,
              averageToxicity: stats.mostPositiveUser.averageToxicity,
              messageCount: stats.mostPositiveUser.messageCount,
              mostPositiveMessage: {
                content: stats.mostPositiveUser.mostPositiveMessage.content,
                toxicity: stats.mostPositiveUser.mostPositiveMessage.toxicity,
              },
            }
          : null,
      },
    });
  } catch (error) {
    console.error("❌ Error getting toxicity stats:", error);
    res.status(500).json({
      success: false,
      error: "Error getting toxicity stats",
    });
  }
});

// Add a new endpoint to check subscriptions
app.get("/check-subscriptions", async (req, res) => {
  try {
    const { makeApiRequest } = await import("./app.js");
    const subscriptions = await makeApiRequest("events/subscriptions", "GET");
    res.json({
      success: true,
      subscriptions: subscriptions,
    });
  } catch (error) {
    console.error("Error checking subscriptions:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 Server running at http://localhost:${PORT}

  Your Render URL: https://kick-tool-new.onrender.com

  Webhook URL for Kick: https://kick-tool-new.onrender.com/webhook

  To test your webhook endpoint:
  https://kick-tool-new.onrender.com/test-webhook
  `);
});
