/**
 * TMDB API Request Endpoints
 *
 * Note: API key is now automatically added by axios interceptor,
 * so we don't need to include it in every URL.
 *
 * @see https://developers.themoviedb.org/3
 */

const requests = {
  // Trending
  fetchTrending: "/trending/all/week",
  fetchTrendingMovies: "/trending/movie/week",
  fetchTrendingTV: "/trending/tv/week",

  // Movies by category
  fetchTopRated: "/movie/top_rated",
  fetchPopular: "/movie/popular",
  fetchNowPlaying: "/movie/now_playing",
  fetchUpcoming: "/movie/upcoming",

  // TV Shows
  fetchNetflixOriginals: "/discover/tv?with_networks=213",
  fetchPopularTV: "/tv/popular",
  fetchTopRatedTV: "/tv/top_rated",

  // Movies by genre
  fetchActionMovies: "/discover/movie?with_genres=28",
  fetchAdventureMovies: "/discover/movie?with_genres=12",
  fetchAnimationMovies: "/discover/movie?with_genres=16",
  fetchComedyMovies: "/discover/movie?with_genres=35",
  fetchCrimeMovies: "/discover/movie?with_genres=80",
  fetchDocumentaries: "/discover/movie?with_genres=99",
  fetchDramaMovies: "/discover/movie?with_genres=18",
  fetchFamilyMovies: "/discover/movie?with_genres=10751",
  fetchFantasyMovies: "/discover/movie?with_genres=14",
  fetchHistoryMovies: "/discover/movie?with_genres=36",
  fetchHorrorMovies: "/discover/movie?with_genres=27",
  fetchMusicMovies: "/discover/movie?with_genres=10402",
  fetchMysteryMovies: "/discover/movie?with_genres=9648",
  fetchRomanceMovies: "/discover/movie?with_genres=10749",
  fetchSciFiMovies: "/discover/movie?with_genres=878",
  fetchThrillerMovies: "/discover/movie?with_genres=53",
  fetchWarMovies: "/discover/movie?with_genres=10752",
  fetchWesternMovies: "/discover/movie?with_genres=37",
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

// Helper function to build custom discover URLs
export const buildDiscoverUrl = (options = {}) => {
  const params = new URLSearchParams();

  if (options.genres) {
    params.set("with_genres", options.genres.join(","));
  }
  if (options.year) {
    params.set("primary_release_year", options.year);
  }
  if (options.sortBy) {
    params.set("sort_by", options.sortBy);
  }
  if (options.voteAverage) {
    params.set("vote_average.gte", options.voteAverage);
  }

  return `/discover/movie?${params.toString()}`;
};

export default requests;
