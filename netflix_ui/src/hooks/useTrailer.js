import { useState, useRef, useCallback } from "react";
import axios from "../api/axios";

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

/**
 * Custom hook for fetching and managing movie trailers
 *
 * @param {object} options - Configuration options
 * @param {number} options.delay - Delay before fetching trailer (default: 500ms)
 *
 * @returns {object} { trailerKey, iframeLoaded, fetchTrailer, clearTrailer, setIframeLoaded }
 *
 * @example
 * const { trailerKey, fetchTrailer, clearTrailer } = useTrailer();
 *
 * onMouseEnter={() => fetchTrailer(movie.id)}
 * onMouseLeave={clearTrailer}
 */
const useTrailer = (options = {}) => {
  const { delay = 500 } = options;

  const [trailerKey, setTrailerKey] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for cleanup
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  // Local cache for this hook instance
  const cacheRef = useRef(new Map());

  const fetchTrailer = useCallback(
    (movieId, immediate = false) => {
      // Clear any pending fetch
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const doFetch = async () => {
        // Check cache first
        if (cacheRef.current.has(movieId)) {
          setTrailerKey(cacheRef.current.get(movieId));
          return;
        }

        // Cancel previous request
        if (abortRef.current) {
          abortRef.current.abort();
        }

        abortRef.current = new AbortController();
        setIsLoading(true);

        try {
          const res = await axios.get(
            `/movie/${movieId}/videos?api_key=${API_KEY}`,
            { signal: abortRef.current.signal }
          );

          const trailer = res.data.results.find(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          );

          if (trailer) {
            cacheRef.current.set(movieId, trailer.key);
            setTrailerKey(trailer.key);
          } else {
            // Cache null result to avoid re-fetching
            cacheRef.current.set(movieId, null);
          }
        } catch (err) {
          if (err.name !== "CanceledError" && err.name !== "AbortError") {
            console.error("Error fetching trailer:", err);
          }
        } finally {
          setIsLoading(false);
        }
      };

      if (immediate) {
        doFetch();
      } else {
        timerRef.current = setTimeout(doFetch, delay);
      }
    },
    [delay]
  );

  const clearTrailer = useCallback(() => {
    // Clear pending fetch
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Abort ongoing request
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    setTrailerKey(null);
    setIframeLoaded(false);
    setIsLoading(false);
  }, []);

  // Preload trailers for a list of movies
  const preloadTrailers = useCallback(async (movies, count = 4) => {
    const moviesToPreload = movies.slice(0, count);

    for (const movie of moviesToPreload) {
      if (cacheRef.current.has(movie.id)) continue;

      try {
        const res = await axios.get(
          `/movie/${movie.id}/videos?api_key=${API_KEY}`
        );

        const trailer = res.data.results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );

        if (trailer) {
          cacheRef.current.set(movie.id, trailer.key);
        }
      } catch {
        // Silently fail preloading
      }
    }
  }, []);

  return {
    trailerKey,
    iframeLoaded,
    isLoading,
    fetchTrailer,
    clearTrailer,
    preloadTrailers,
    setIframeLoaded,
  };
};

export default useTrailer;
