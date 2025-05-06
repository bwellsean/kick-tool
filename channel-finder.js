import { makeApiRequest } from "./app.js";

async function findChannelByName(channelName) {
  try {
    // Use the channels endpoint with slug parameter
    const response = await makeApiRequest(`channels?slug[]=${channelName}`);

    if (response.data && response.data.length > 0) {
      console.log("Channel found:", response.data[0]);
      return response.data[0];
    } else {
      console.log(`No channel found with name: ${channelName}`);
      return null;
    }
  } catch (error) {
    console.error("Error finding channel:", error);
    throw error;
  }
}

// Use this in browser
if (typeof window !== "undefined") {
  window.findChannelByName = findChannelByName;
}

export { findChannelByName };
