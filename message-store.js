// Simple in-memory message store
let chatMessages = [];
const MAX_MESSAGES = 200;

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
  if (broadcasterId) {
    return chatMessages.filter((msg) => msg.broadcaster_id === broadcasterId);
  }
  return [...chatMessages];
}

// Clear all messages
export function clearMessages() {
  chatMessages = [];
  return true;
}

// Add some test messages so we can see something before the webhook is working
addMessage({
  id: "test_msg_1",
  broadcaster_id: "123456",
  broadcaster_name: "test_broadcaster",
  sender_id: "789012",
  sender_name: "test_user1",
  sender_display_name: "TestUser1",
  content: "Hello! This is a test message.",
  timestamp: new Date().toISOString(),
});

addMessage({
  id: "test_msg_2",
  broadcaster_id: "123456",
  broadcaster_name: "test_broadcaster",
  sender_id: "345678",
  sender_name: "test_user2",
  sender_display_name: "TestUser2",
  content: "Welcome to the chat! 👋",
  timestamp: new Date().toISOString(),
});
