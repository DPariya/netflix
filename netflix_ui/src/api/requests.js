/**
 * Backend API Request Endpoints
 *
 * All requests now go through YOUR backend at /api/movies/*
 * No direct TMDB calls, no API key needed in frontend!
 *
 */

const requests = {
  // Trending
  fetchTrending: "/movies/trending",
  fetchTrendingMovies: "/movies/trending/movies",
  fetchTrendingTV: "/movies/trending/tv",

  // Movies by category
  fetchTopRated: "/movies/top-rated",
  fetchPopular: "/movies/popular",
  fetchNowPlaying: "/movies/now-playing",
  fetchUpcoming: "/movies/upcoming",

  // TV Shows
  fetchNetflixOriginals: "/movies/originals",
  fetchPopularTV: "/movies/tv/popular",
  fetchTopRatedTV: "/movies/tv/top-rated",

  // Movies by genre (using genre IDs)
  fetchActionMovies: "/movies/genre/28",
  fetchAdventureMovies: "/movies/genre/12",
  fetchAnimationMovies: "/movies/genre/16",
  fetchComedyMovies: "/movies/genre/35",
  fetchCrimeMovies: "/movies/genre/80",
  fetchDocumentaries: "/movies/genre/99",
  fetchDramaMovies: "/movies/genre/18",
  fetchFamilyMovies: "/movies/genre/10751",
  fetchFantasyMovies: "/movies/genre/14",
  fetchHistoryMovies: "/movies/genre/36",
  fetchHorrorMovies: "/movies/genre/27",
  fetchMusicMovies: "/movies/genre/10402",
  fetchMysteryMovies: "/movies/genre/9648",
  fetchRomanceMovies: "/movies/genre/10749",
  fetchSciFiMovies: "/movies/genre/878",
  fetchThrillerMovies: "/movies/genre/53",
  fetchWarMovies: "/movies/genre/10752",
  fetchWesternMovies: "/movies/genre/37",
};

// Genre IDs for reference
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

// Helper function to build genre URLs
export const buildDiscoverUrl = (genreId) => {
  return `/movies/genre/${genreId}`;
};

// Helper for movie details
export const getMovieDetailsUrl = (movieId) => {
  return `/movies/${movieId}`;
};

// Helper for trailer
export const getTrailerUrl = (movieId) => {
  return `/movies/${movieId}/trailer`;
};

// Helper for search
export const getSearchUrl = (query, type = "multi") => {
  return `/movies/search?q=${encodeURIComponent(query)}&type=${type}`;
};

export default requests;
