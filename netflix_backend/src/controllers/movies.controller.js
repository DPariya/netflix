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
