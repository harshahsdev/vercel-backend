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

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / mobile apps / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* Handle preflight requests */
app.options("*", cors());

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/business", businessRoutes);
app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);

/* ---------------- 404 HANDLER (IMPORTANT FIX) ---------------- */
// ❌ DO NOT use "*"
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