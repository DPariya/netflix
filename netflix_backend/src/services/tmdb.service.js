import axios from "axios";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is missing in environment variables");
}

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

const tmdbService = {
  async fetchTrending() {
    const res = await client.get("/trending/all/week");
    return res.data;
  },

  async fetchOriginals() {
    // Netflix originals ≈ discover + network filter
    const res = await client.get("/discover/tv", {
      params: {
        with_networks: 213,
      },
    });
    return res.data;
  },

  async fetchTrailer(movieId) {
    const res = await client.get(`/movie/${movieId}/videos`);
    return res.data;
  },

  async fetchTopRated() {
    const res = await client.get(`/movie/top_rated`);
    return res.data;
  },
  async fetchPopular() {
    const res = await client.get(`/movie/popular`);
    return res.data;
  },
  async fetchNowPlaying() {
    const res = await client.get("/movie/now_playing");
    return res.data;
  },

  async fetchUpcoming() {
    const res = await client.get("/movie/upcoming");
    return res.data;
  },

  async fetchPopularTV() {
    const res = await client.get("/tv/popular");
    return res.data;
  },

  async fetchTopRatedTV() {
    const res = await client.get("/tv/top_rated");
    return res.data;
  },

  async fetchByGenre(genreId) {
    const res = await client.get("/discover/movie", {
      params: {
        with_genres: genreId,
      },
    });
    return res.data;
  },

  async fetchTrendingMovies() {
    const res = await client.get("/trending/movie/week");
    return res.data;
  },

  async fetchTrendingTV() {
    const res = await client.get("/trending/tv/week");
    return res.data;
  },

  async search(query, type = "multi", page = 1) {
    const res = await client.get("/search" + type, {
      params: {
        query,
        page,
      },
    });
    return res.data;
  },

  async fetchMovieDetails(movieId) {
    const res = await client.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "video, credits, similar",
      },
    });
    return res.data;
  },
};

export default tmdbService;
