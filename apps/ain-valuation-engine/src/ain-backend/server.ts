import express from "express";
import logger from "./logger";
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

app.get("/api/joke", async (req, res) => {
  const joke = await fetchJoke();
  res.send({ joke });
});

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});