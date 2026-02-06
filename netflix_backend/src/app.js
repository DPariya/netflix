import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/**
 * Global middlewares
 */
app.use(cors());
app.use(express.json());
connectDB(); // connect Database

/**
 * Health check
 * Useful for load balancers & monitoring
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/**
 * API routes
 */
app.use("/api", routes);

/**
 * Global error handler (must be last)
 */
app.use(errorMiddleware);

export default app;
