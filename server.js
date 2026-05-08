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

/* Middleware */
app.use(cors({
  origin: "https://vercel-frontend-vsjq.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

/* Routes */
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/business", businessRoutes);
app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);

/* Error Handlers */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

/* Server */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});