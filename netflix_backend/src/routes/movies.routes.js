import { Router } from "express";
import {
  getTrending,
  getOriginals,
  getTrailer,
  getTopRated,
  getPopular,
  getNowPlaying,
  getUpcoming,
  getPopularTV,
  getTopRatedTV,
  getByGenre,
  getTrendingMovies,
  getTrendingTV,
  search,
  getMovieDetails,
} from "../controllers/movies.controller.js";

const router = Router();

// Trending
router.get("/trending", getTrending);
router.get("/trending/movies", getTrendingMovies);
router.get("/trending/tv", getTrendingTV);

// Netflix Originals
router.get("/originals", getOriginals);

// Movies
router.get("/top-rated", getTopRated);
router.get("/popular", getPopular);
router.get("/now-playing", getNowPlaying);
router.get("/upcoming", getUpcoming);

// TV Shows
router.get("/tv/popular", getPopularTV);
router.get("/tv/top-rated", getTopRatedTV);

// By Genre
router.get("/genre/:genre", getByGenre);

// Individual Movie
router.get("/:id", getMovieDetails);
router.get("/:id/trailer", getTrailer);

// Search
router.get("/search", search); // Note: This should be in a separate search route file ideally

export default router;
