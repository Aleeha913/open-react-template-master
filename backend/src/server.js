"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
mongoose_1.default
    .connect(process.env.MONGODB_URI || "")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("MongoDB connection error:", error));
app.get("/", (req, res) => {
    res.send("Backend is working!");
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
