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
    return chatMessages.filter(
      (msg) => String(msg.broadcaster_id) === String(broadcasterId)
    );
  }
  return [...chatMessages];
}

// Clear all messages
export function clearMessages() {
  chatMessages = [];
  return true;
}

// No test messages - only real data will be stored
