import { Router } from "express";
import moviesRoutes from "./movies.routes.js";
import authRoutes from "./auth.routes.js";
const router = Router();

router.use("/movies", moviesRoutes);
router.use("/auth", authRoutes);
export default router;
