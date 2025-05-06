// Authentication details
const CLIENT_ID = "01JTJZZ3S45DZVTTND2Y1XXF07"; // Replace with your actual client ID
const CLIENT_SECRET =
  "a40d288be912b23eccf4912422ce0cd797ea57bffaf31d99b13764b95b970ee6"; // Replace with your actual client secret

// Step 1: Get access token
async function getAccessToken() {
  try {
    const response = await fetch("https://id.kick.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Changed to x-www-form-urlencoded as specified in docs
        Accept: "*/*",
      },
      // Using URLSearchParams to format the request body as x-www-form-urlencoded
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
    return tokenData.access_token; // Extract the access token from the response
  } catch (error) {
    console.error("Error obtaining access token:", error);
    throw error;
  }
}

// Step 2: Use the token to make API requests
async function makeApiRequest(endpoint, method = "GET") {
  try {
    // First get the access token
    const accessToken = await getAccessToken();

    // Then make the actual API request
    const response = await fetch(`https://api.kick.com/public/v1/${endpoint}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error making API request to ${endpoint}:`, error);
    throw error;
  }
}

// Example usage
async function init() {
  try {
    const livestreams = await makeApiRequest("livestreams");
    console.log("Livestreams:", livestreams);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the init function to start the app
init();
