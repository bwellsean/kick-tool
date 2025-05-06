const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const app = express();
const port = 5500;

// Middleware to parse raw body for verification
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Kick's public key (fetch from API in production)
const kickPublicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/+l1WnlRrGSolDMA+A8
6rAhMbQGmQ2SapVcGM3zq8ANXjnhDWocMqfWcTd95btDydITa10kDvHzw9WQOqp2
MZI7ZyrfzJuz5nhTPCiJwTwnEtWft7nV14BYRDHvlfqPUaZ+1KR4OCaO/wWIk/rQ
L/TjY0M70gse8rlBkbo2a8rKhu69RQTRsoaf4DVhDPEeSeI5jVrRDGAMGL3cGuyY
6CLKGdjVEM78g3JfYOvDU/RvfqD7L89TZ3iN94jrmWdGz34JNlEI5hqK8dd7C5EF
BEbZ5jgB8s8ReQV8H+MkuffjdAj3ajDDX3DOJMIut1lBrUVD1AaSrGCKHooWoL2e
twIDAQAB`;

// Verify webhook signature
function verifySignature(messageId, timestamp, rawBody, signature) {
  try {
    const data = `${messageId}.${timestamp}.${rawBody}`;
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(data);
    return verifier.verify(kickPublicKey, signature, "base64");
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

// Endpoint to receive chat messages
app.post("/webhook", (req, res) => {
  // Get headers
  const messageId = req.headers["kick-event-message-id"];
  const timestamp = req.headers["kick-event-message-timestamp"];
  const signature = req.headers["kick-event-signature"];
  const eventType = req.headers["kick-event-type"];

  // Verify the signature
  const isValid = verifySignature(
    messageId,
    timestamp,
    req.rawBody.toString(),
    signature
  );

  if (!isValid) {
    return res.status(401).send("Invalid signature");
  }

  // Process based on event type
  if (eventType === "chat.message.sent") {
    console.log("Chat message received:", req.body);
    // Handle chat message
    const { broadcaster, sender, content, emotes } = req.body;
    console.log(`${sender.username}: ${content}`);
  }

  // Respond with 200 OK to acknowledge receipt
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Webhook server listening at http://localhost:${port}`);
});
