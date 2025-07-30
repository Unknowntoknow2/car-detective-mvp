import express from "express";
import dotenv from "dotenv";
import conversationApi from "./conversationApi";

dotenv.config();

const app = express();
app.use(express.json());

// Mount the conversation API at /api/conversation
app.use("/api/conversation", conversationApi);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AIN Valuation Engine backend listening on port ${PORT}`);
});
