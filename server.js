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

/* CORS */
const allowedOrigins = [
  "https://vercel-frontend-rho-two.vercel.app",
  "https://vercel-frontend-three-ruby.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman / server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // IMPORTANT: don't crash server with error (prevents CORS failure)
    return callback(null, false);
  },
  credentials: true
}));

// Preflight support
app.options(/.*/, cors({
  origin: allowedOrigins,
  credentials: true
}));


/* Middleware */
app.use(express.json());
app.use(cookieParser());

/* Routes */
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/business", businessRoutes);
app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);

/* 404 Handler */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* Error Handler */
app.use(errorHandler);

/* Server */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});