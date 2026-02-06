import tmdbService from "../services/tmdb.service.js";

export const getTrending = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchTrending();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getOriginals = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchOriginals();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getTrailer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await tmdbService.fetchTrailer(id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getTopRated = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchTopRated();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getPopular = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchPopular();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getNowPlaying = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchNowPlaying();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getUpcoming = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchUpcoming();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getPopularTV = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchPopularTV();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getTopRatedTV = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchTopRatedTV();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getByGenre = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const data = await tmdbService.fetchByGenre(genre);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getTrendingMovies = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchTrendingMovies();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getTrendingTV = async (req, res, next) => {
  try {
    const data = await tmdbService.fetchTrendingTV();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  try {
    const { q, type, page } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    const data = await tmdbService.search(q, type, page);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await tmdbService.fetchMovieDetails(id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
