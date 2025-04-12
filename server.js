import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors()); // Enable frontend access

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Backend reads API key

app.post("/generate-text", async (req, res) => {
  try {
    const  { userMessage } = req.body;
    let actualMessage="Consider you are model Prepare for online Community application where users can share their skills and make community.answer this question : "
    if (!userMessage) {
      return res.status(400).json({ error: "User message is required." });
    }
    actualMessage+=userMessage
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      
      {
        contents: [{ parts: [{ text: actualMessage }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (
      !response.data ||
      !response.data.candidates ||
      response.data.candidates.length === 0
    ) {
      return res.status(500).json({ error: "Invalid response from Gemini API." });
    }

    res.json({ reply: response.data.candidates[0].content });
  } catch (error) {
    console.error("Error calling Gemini API:", error?.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
