import { google } from "googleapis";

const API_KEY = "AIzaSyAZRwFQPGPSUPK58JbFUzROQQ2ueJ1uCSc";
const DISCOVERY_URL =
  "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

// Cache the API client to avoid redundant discovery API calls
let client = null;

// Initialize the API client
async function getClient() {
  if (client) return client;

  try {
    client = await google.discoverAPI(DISCOVERY_URL);
    return client;
  } catch (error) {
    console.error("Error initializing Perspective API client:", error);
    throw error;
  }
}

// Analyze text for toxicity
export async function analyzeToxicity(text) {
  try {
    const client = await getClient();

    const analyzeRequest = {
      comment: {
        text: text,
      },
      requestedAttributes: {
        TOXICITY: {},
        INSULT: {},
        PROFANITY: {},
      },
      languages: ["de", "en", "es", "fr", "it", "pt", "ru"],
    };

    const response = await client.comments.analyze({
      key: API_KEY,
      resource: analyzeRequest,
    });

    return {
      toxicity: response.data.attributeScores.TOXICITY.summaryScore.value,
      insult: response.data.attributeScores.INSULT?.summaryScore.value,
      profanity: response.data.attributeScores.PROFANITY?.summaryScore.value,
    };
  } catch (error) {
    console.error("Error analyzing toxicity:", error);
    // Return default values in case of error
    return { toxicity: 0, insult: 0, profanity: 0 };
  }
}

// Batch analyze multiple messages (to avoid rate limiting)
export async function batchAnalyzeToxicity(messages, maxBatchSize = 5) {
  // Process in batches to avoid rate limiting
  const results = [];
  const batches = [];

  // Create batches of messages
  for (let i = 0; i < messages.length; i += maxBatchSize) {
    batches.push(messages.slice(i, i + maxBatchSize));
  }

  // Process each batch sequentially
  for (const batch of batches) {
    const batchPromises = batch.map((message) =>
      analyzeToxicity(message.content)
    );
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results.map((result, index) => ({
    ...messages[index],
    toxicity: result.toxicity,
    insult: result.insult,
    profanity: result.profanity,
  }));
}
