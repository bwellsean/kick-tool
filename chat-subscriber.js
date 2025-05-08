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

    // Use the Render production URL for webhooks
    const webhookUrl = "https://kick-tool-new.onrender.com//webhook";
    console.log(`Using webhook URL: ${webhookUrl}`);

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
