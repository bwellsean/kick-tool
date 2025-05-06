import { makeApiRequest } from "./app.js";

async function subscribeToChatEvents(broadcasterId) {
  try {
    console.log(
      `Subscribing to chat events for broadcaster ID: ${broadcasterId}`
    );

    // The webhook URL must be publicly accessible
    const webhookUrl = "https://kick-tool.vercel.app/api/webhook";

    const response = await makeApiRequest("events/subscriptions", "POST", {
      broadcaster_user_id: broadcasterId,
      events: [
        {
          name: "chat.message.sent",
          version: 1,
        },
      ],
      method: "webhook",
      webhook_url: webhookUrl,
    });

    console.log("Subscription created:", response);
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
