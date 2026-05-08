import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import businessRoutes from "./routes/businessRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import errorHandler from "./middleware/errorMIddleware.js";

dotenv.config();
connectDB();

const app = express();

console.log("========== NEW BACKEND VERSION ==========");

/* ---------------- CORS ---------------- */
app.use(cors());

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------- TEST ROUTE ---------------- */
app.get("/harsha-test", (req, res) => {
  res.send("HARSHA TEST WORKING");
});

/* ---------------- ROOT ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ---------------- ROUTES ---------------- */
app.use("/api/business", businessRoutes);
app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------- ERROR HANDLER ---------------- */
app.use(errorHandler);

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});