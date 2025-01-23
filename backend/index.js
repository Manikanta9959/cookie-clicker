import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import { incrementCounter } from "./jobs/incrementCounter.js";
import { registerUser, loginUser, authenticateToken } from "./jobs/auth.js";

const app = express();
const PORT = 8001;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect("mongodb+srv://sivachallano1:oQuAukv1MM09pkdS@cookie-clicker.1wssm.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Authentication Routes
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const result = await registerUser(username, password);
  res.json(result);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  res.json(result);
});

// Game Route (Requires Authentication)
app.post("/click", authenticateToken, async (req, res) => {
  const result = await incrementCounter(req.userId);
  res.json(result);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
