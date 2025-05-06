// This is an API endpoint that uses Server-Sent Events to push messages to clients

// Store messages temporarily in memory (use a database in production)
let chatMessages = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send current messages
    const data = `data: ${JSON.stringify(chatMessages)}\n\n`;
    res.write(data);

    // Keep the connection open
    const interval = setInterval(() => {
      res.write(": ping\n\n");
    }, 30000);

    // Handle client disconnect
    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  } else if (req.method === "POST") {
    // This allows other endpoints to add messages
    const { message } = req.body;
    if (message) {
      chatMessages.push(message);
      // Limit stored messages to 100
      if (chatMessages.length > 100) {
        chatMessages.shift();
      }
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "No message provided" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
