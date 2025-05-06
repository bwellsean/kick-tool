import { makeApiRequest } from "./app.js";

async function subscribeToChatEvents(broadcasterId) {
  try {
    console.log(
      `Subscribing to chat events for broadcaster ID: ${broadcasterId}`
    );

    // Ensure we have a numeric broadcaster ID
    const numericBroadcasterId = Number(broadcasterId);
    if (isNaN(numericBroadcasterId)) {
      throw new Error(`Invalid broadcaster ID: ${broadcasterId}`);
    }

    // The webhook URL must be publicly accessible
    const webhookUrl = "https://kick-tool.vercel.app/api/webhook";

    // Make the subscription request
    const response = await makeApiRequest("events/subscriptions", "POST", {
      broadcaster_user_id: numericBroadcasterId,
      events: [
        {
          name: "chat.message.sent",
          version: 1,
        },
      ],
      method: "webhook",
      webhook_url: webhookUrl,
    });

    console.log("Subscription created:", JSON.stringify(response, null, 2));

    // Make a test webhook call for debugging
    try {
      const testMessage = {
        message_id: `test_${Date.now()}`,
        broadcaster: {
          user_id: numericBroadcasterId,
          username: "test_broadcaster",
        },
        sender: {
          user_id: 999999,
          username: "test_sender",
        },
        content: "This is a test webhook message",
      };

      // Call our own webhook for testing
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Kick-Event-Type": "chat.message.sent",
          "Kick-Event-Version": "1",
        },
        body: JSON.stringify(testMessage),
      });

      console.log("Test webhook response:", await webhookResponse.text());
    } catch (testError) {
      console.error("Test webhook failed:", testError);
    }

    return response;
  } catch (error) {
    console.error("Failed to subscribe to chat events:", error);
    console.error("Error details:", error.message);
    throw error;
  }
}

// Use this in browser
if (typeof window !== "undefined") {
  window.subscribeToChatEvents = subscribeToChatEvents;
}

export { subscribeToChatEvents };
