import { makeApiRequest } from "./app.js";

async function subscribeToChatEvents(broadcasterId) {
  try {
    const response = await makeApiRequest("events/subscriptions", "POST", {
      broadcaster_user_id: broadcasterId,
      events: [
        {
          name: "chat.message.sent",
          version: 1,
        },
      ],
      method: "webhook",
      webhook_url: "https://kick-tool.vercel.app/api/webhook",
    });

    console.log("Subscription created:", response);
    return response;
  } catch (error) {
    console.error("Failed to subscribe to chat events:", error);
    throw error;
  }
}

// Use this in browser
if (typeof window !== "undefined") {
  window.subscribeToChatEvents = subscribeToChatEvents;
}

export { subscribeToChatEvents };
