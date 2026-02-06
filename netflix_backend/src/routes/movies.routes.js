import { Router } from "express";
import {
  getTrending,
  getOriginals,
  getTrailer,
} from "../controllers/movies.controller.js";

const router = Router();

/**
 * GET /api/movies/trending
 */
router.get("/trending", getTrending);

/**
 * GET /api/movies/originals
 */
router.get("/originals", getOriginals);

/**
 * GET /api/movies/:id/trailer
 */
router.get("/:id/trailer", getTrailer);

export default router;
