import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../api/axios";

/**
 * Custom hook for fetching movies from TMDB API
 *
 * @param {string} fetchUrl - The API endpoint to fetch from
 * @param {object} options - Optional configuration
 * @param {boolean} options.enabled - Whether to fetch immediately (default: true)
 * @param {number} options.staleTime - Time in ms before data is considered stale (default: 5 minutes)
 *
 * @returns {object} { movies, loading, error, refetch, isStale }
 *
 * @example
 * const { movies, loading, error } = useMovies(request.fetchTrending);
 */
const useMovies = (fetchUrl, options = {}) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Abort controller for cleanup
  const abortControllerRef = useRef(null);

  // Check if data is stale
  const isStale = lastFetched ? Date.now() - lastFetched > staleTime : true;

  const fetchMovies = useCallback(
    async (force = false) => {
      // Skip if disabled or data is fresh (unless forced)
      if (!enabled) return;
      if (!force && !isStale && movies.length > 0) return;

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(fetchUrl, {
          signal: abortControllerRef.current.signal,
        });

        const results = response?.data?.results || [];

        // Filter out movies without images
        const validMovies = results.filter(
          (movie) => movie.poster_path || movie.backdrop_path
        );

        setMovies(validMovies);
        setLastFetched(Date.now());
      } catch (err) {
        // Don't set error if request was cancelled
        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }

        console.error("Error fetching movies:", err);
        setError(err.message || "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl, enabled, isStale, movies.length]
  );

  // Initial fetch
  useEffect(() => {
    fetchMovies();

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMovies, fetchUrl]); // Only re-fetch when URL changes

  // Manual refetch function
  const refetch = useCallback(() => {
    return fetchMovies(true); // Force refetch
  }, [fetchMovies]);

  return {
    movies,
    loading,
    error,
    refetch,
    isStale,
    isEmpty: !loading && movies.length === 0,
  };
};

export default useMovies;
