// Simple in-memory message store
let chatMessages = [];
const MAX_MESSAGES = 500;

// Add a new message to the store
export function addMessage(message) {
  chatMessages.unshift(message); // Add to the beginning

  // Keep only the most recent messages
  if (chatMessages.length > MAX_MESSAGES) {
    chatMessages = chatMessages.slice(0, MAX_MESSAGES);
  }

  return message;
}

// Get all messages, optionally filtered by broadcaster
export function getMessages(broadcasterId = null) {
  try {
    // If we need to filter by broadcaster ID
    if (broadcasterId) {
      // Convert both to strings for comparison since IDs might be numbers or strings
      const stringBroadcasterId = String(broadcasterId);

      // Filter messages
      const filteredMessages = chatMessages.filter((msg) => {
        // Handle potential undefined broadcaster_id
        if (!msg.broadcaster_id) return false;

        return String(msg.broadcaster_id) === stringBroadcasterId;
      });

      console.log(
        `Filtered messages for broadcaster ${broadcasterId}: ${filteredMessages.length} of ${chatMessages.length} total`
      );
      return filteredMessages;
    }

    // Return all messages
    return [...chatMessages];
  } catch (error) {
    console.error("Error in getMessages:", error);
    return [];
  }
}

// Clear all messages
export function clearMessages() {
  chatMessages = [];
  return true;
}

// Add a test message function for debugging
export function addTestMessage(broadcasterId) {
  const testMsg = {
    id: `test_${Date.now()}`,
    broadcaster_id: broadcasterId,
    broadcaster_name: "test_broadcaster",
    sender_id: Math.floor(Math.random() * 10000),
    sender_name: "test_user",
    sender_display_name: "Test User",
    content: `Test message at ${new Date().toLocaleTimeString()}`,
    timestamp: new Date().toISOString(),
  };
  return addMessage(testMsg);
}
