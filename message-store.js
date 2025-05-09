// Simple in-memory message store
let chatMessages = [];
const MAX_MESSAGES = parseInt(process.env.MAX_MESSAGES || 1000);
// Add a new message to the store
export function addMessage(message) {
  chatMessages.unshift(message); // Add to the beginning

  // Keep only the most recent messages
  if (chatMessages.length > MAX_MESSAGES) {
    chatMessages = chatMessages.slice(0, MAX_MESSAGES);
  }

  return message;
}

// Add toxicity score to a message
export function updateMessageToxicity(messageId, toxicityScores) {
  const messageIndex = chatMessages.findIndex((msg) => msg.id === messageId);

  if (messageIndex !== -1) {
    chatMessages[messageIndex] = {
      ...chatMessages[messageIndex],
      toxicity: toxicityScores.toxicity,
      insult: toxicityScores.insult,
      profanity: toxicityScores.profanity,
    };
  }

  return messageIndex !== -1;
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

// Get toxicity stats for a broadcaster
export function getToxicityStats(broadcasterId = null) {
  const messages = getMessages(broadcasterId).filter(
    (msg) => msg.toxicity !== undefined
  );

  if (messages.length === 0) {
    return {
      averageToxicity: 0,
      mostToxicMessage: null,
      mostToxicUser: null,
      mostPositiveUser: null,
    };
  }

  // Calculate average toxicity
  const totalToxicity = messages.reduce(
    (sum, msg) => sum + (msg.toxicity || 0),
    0
  );
  const averageToxicity = totalToxicity / messages.length;

  // Find most toxic message
  const mostToxicMessage = messages.reduce(
    (most, current) => (current.toxicity > most.toxicity ? current : most),
    messages[0]
  );

  // Count toxicity by user
  const userToxicity = {};
  messages.forEach((msg) => {
    if (!userToxicity[msg.sender_name]) {
      userToxicity[msg.sender_name] = {
        totalToxicity: 0,
        messageCount: 0,
        maxToxicity: 0,
        mostToxicMessage: null,
        minToxicity: 1, // Track least toxic (most positive) message
        mostPositiveMessage: null,
      };
    }

    userToxicity[msg.sender_name].totalToxicity += msg.toxicity || 0;
    userToxicity[msg.sender_name].messageCount++;

    // Track most toxic message for this user
    if ((msg.toxicity || 0) > userToxicity[msg.sender_name].maxToxicity) {
      userToxicity[msg.sender_name].maxToxicity = msg.toxicity || 0;
      userToxicity[msg.sender_name].mostToxicMessage = msg;
    }

    // Track least toxic (most positive) message for this user
    if ((msg.toxicity || 0) < userToxicity[msg.sender_name].minToxicity) {
      userToxicity[msg.sender_name].minToxicity = msg.toxicity || 0;
      userToxicity[msg.sender_name].mostPositiveMessage = msg;
    }
  });

  // Find most toxic user
  let mostToxicUser = null;
  let highestAvgToxicity = 0;

  // Find most positive user (lowest toxicity score)
  let mostPositiveUser = null;
  let lowestAvgToxicity = 1;

  Object.entries(userToxicity).forEach(([username, data]) => {
    const avgToxicity = data.totalToxicity / data.messageCount;

    // Update most toxic user if needed
    if (avgToxicity > highestAvgToxicity && data.messageCount >= 1) {
      highestAvgToxicity = avgToxicity;
      mostToxicUser = {
        username,
        averageToxicity: avgToxicity,
        messageCount: data.messageCount,
        mostToxicMessage: data.mostToxicMessage,
      };
    }

    // Update most positive user if needed
    if (avgToxicity < lowestAvgToxicity && data.messageCount >= 1) {
      lowestAvgToxicity = avgToxicity;
      mostPositiveUser = {
        username,
        averageToxicity: avgToxicity,
        messageCount: data.messageCount,
        mostPositiveMessage: data.mostPositiveMessage,
      };
    }
  });

  return {
    averageToxicity,
    mostToxicMessage,
    mostToxicUser,
    mostPositiveUser,
  };
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
