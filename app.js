// Authentication details

// Support both Node.js and browser environments for CLIENT_ID and CLIENT_SECRET
const CLIENT_ID =
  (typeof process !== "undefined" && process.env && process.env.KICK_API_KEY) ||
  (typeof window !== "undefined" && window.KICK_API_KEY) ||
  "";
const CLIENT_SECRET =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.KICK_API_SECRET) ||
  (typeof window !== "undefined" && window.KICK_API_SECRET) ||
  "";

// Step 1: Get access token
async function getAccessToken() {
  try {
    const response = await fetch("https://id.kick.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(
        `Token request failed: ${response.status} ${response.statusText}`
      );
    }

    const tokenData = await response.json();
    return tokenData.access_token;
  } catch (error) {
    console.error("Error obtaining access token:", error);
    throw error;
  }
}

async function makeApiRequest(endpoint, method = "GET", body = null) {
  try {
    const accessToken = await getAccessToken();

    console.log(`Making ${method} request to: ${endpoint}`);

    const options = {
      method: method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
      console.log("Request body:", JSON.stringify(body));
    }

    const response = await fetch(
      `https://api.kick.com/public/v1/${endpoint}`,
      options
    );

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.log("Response is not JSON:", responseText);
      responseData = { text: responseText };
    }

    if (!response.ok) {
      console.error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      console.error("Response data:", responseData);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return responseData;
  } catch (error) {
    console.error(`Error making API request to ${endpoint}:`, error);
    throw error;
  }
}

// Export as ES modules only
export { getAccessToken, makeApiRequest };

// If you need to run this in a browser environment
if (typeof window !== "undefined") {
  // This code runs only in browser, not in Node.js
  async function init() {
    try {
      const livestreams = await makeApiRequest("livestreams");
      console.log("Livestreams:", livestreams);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Only run init if this script is loaded directly
  if (document.currentScript && document.currentScript.src.includes("app.js")) {
    init();
  }
}
