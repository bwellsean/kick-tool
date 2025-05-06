import { getMessages } from "./webhook.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    const messages = getMessages();
    res.status(200).json({ messages });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
