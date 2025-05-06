// Import your existing authentication functions
const { getAccessToken, makeApiRequest } = require("./app.js");

async function subscribeToEvents(broadcasterUserId) {
  try {
    const response = await makeApiRequest("events/subscriptions", "POST", {
      broadcaster_user_id: broadcasterUserId,
      events: [
        {
          name: "chat.message.sent",
          version: 1,
        },
      ],
      method: "webhook",
    });

    console.log("Subscription created:", response);
    return response;
  } catch (error) {
    console.error("Failed to subscribe to events:", error);
    throw error;
  }
}

// Example usage
async function init() {
  const broadcasterUserId = 123456; // Replace with the actual broadcaster user ID
  await subscribeToEvents(broadcasterUserId);
}

init();
