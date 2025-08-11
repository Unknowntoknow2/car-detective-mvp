import express from "express";
import logger from "../utils/logger.js";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

async function fetchJoke(): Promise<string> {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    return `${response.data.setup} ${response.data.punchline}`;
  } catch (error) {
    logger.error("Error fetching joke:", error);
    return "No joke available.";
  }
}

// Root route to fix 'Cannot GET /'
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/joke", async (req, res) => {
  const joke = await fetchJoke();
  res.send({ joke });
});

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});