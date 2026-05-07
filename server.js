import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import businessRoutes from "./routes/businessRoutes.js";
import errorHandler from "./middleware/errorMIddleware.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "https://vercel-frontend-five-ruby.vercel.app",
  "http://localhost:5173"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/business", businessRoutes);
app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }

  console.log(`Server running on port ${PORT}`);
});