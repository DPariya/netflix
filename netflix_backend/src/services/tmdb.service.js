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
};

export default tmdbService;
