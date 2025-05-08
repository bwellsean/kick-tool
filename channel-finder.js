import { makeApiRequest } from "./app.js";

// Alternative channel finding method
async function findChannelByName(channelName) {
  try {
    // Clean up the input
    let cleanChannelName = channelName.trim().replace(/\/$/, "").toLowerCase();
    // Remove "kick.com/" if present
    if (cleanChannelName.includes("kick.com/")) {
      const urlParts = cleanChannelName.split("/");
      cleanChannelName = urlParts[urlParts.length - 1];
    }

    // Try multiple endpoint formats
    console.log(`Searching for channel: ${cleanChannelName}`);

    // Method 1: Using the slug parameter
    try {
      const response1 = await makeApiRequest(
        `channels?slug=${cleanChannelName}`
      );
      console.log("Method 1 response:", response1);
      if (response1.data && response1.data.length > 0) {
        return response1.data[0];
      }
    } catch (e) {
      console.log("Method 1 failed:", e.message);
    }

    // Method 2: Using slug[] parameter
    try {
      const response2 = await makeApiRequest(
        `channels?slug[]=${cleanChannelName}`
      );
      console.log("Method 2 response:", response2);
      if (response2.data && response2.data.length > 0) {
        return response2.data[0];
      }
    } catch (e) {
      console.log("Method 2 failed:", e.message);
    }

    // Method 3: Direct path parameter
    try {
      const response3 = await makeApiRequest(`channels/${cleanChannelName}`);
      console.log("Method 3 response:", response3);
      if (response3.data) {
        return response3.data;
      }
    } catch (e) {
      console.log("Method 3 failed:", e.message);
    }

    console.log("No channel found with any method");
    return null;
  } catch (error) {
    console.error("Error in findChannelByName:", error);
    throw error;
  }
}

// Use this in browser
if (typeof window !== "undefined") {
  window.findChannelByName = findChannelByName;
}

export { findChannelByName };
