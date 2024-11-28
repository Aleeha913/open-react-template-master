import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
