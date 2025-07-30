import express from "express";
const app = express();
app.use(express.json());
app.listen(3000, () => console.log("Server running on port 3000"));
app.get("/", (req, res) => { res.send("AIN Valuation Engine API is running!"); });
