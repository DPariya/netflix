import React, { createContext, useContext, useRef, useCallback } from "react";

/**
 * TrailerCacheContext - Global cache for trailer keys
 *
 * Prevents re-fetching trailers that have already been loaded.
 * Persists across component unmounts/remounts.
 *
 * @example
 * const { getTrailer, setTrailer, hasTrailer } = useTrailerCache();
 *
 * // Check cache before API call
 * const cached = getTrailer(movieId);
 * if (cached) {
 *   setTrailerKey(cached);
 * } else {
 *   // fetch from API...
 *   setTrailer(movieId, trailerKey);
 * }
 */

const TrailerCacheContext = createContext(null);

export function TrailerCacheProvider({ children }) {
  // Use ref to persist cache without causing re-renders
  const cacheRef = useRef(new Map());

  const getTrailer = useCallback((movieId) => {
    return cacheRef.current.get(movieId) || null;
  }, []);

  const setTrailer = useCallback((movieId, trailerKey) => {
    cacheRef.current.set(movieId, trailerKey);
  }, []);

  const hasTrailer = useCallback((movieId) => {
    return cacheRef.current.has(movieId);
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const getCacheSize = useCallback(() => {
    return cacheRef.current.size;
  }, []);

  // Preload multiple trailers
  const preloadTrailers = useCallback((trailers) => {
    trailers.forEach(({ movieId, trailerKey }) => {
      if (!cacheRef.current.has(movieId)) {
        cacheRef.current.set(movieId, trailerKey);
      }
    });
  }, []);

  const value = {
    getTrailer,
    setTrailer,
    hasTrailer,
    clearCache,
    getCacheSize,
    preloadTrailers,
  };

  return (
    <TrailerCacheContext.Provider value={value}>
      {children}
    </TrailerCacheContext.Provider>
  );
}

export function useTrailerCache() {
  const context = useContext(TrailerCacheContext);

  if (!context) {
    throw new Error(
      "useTrailerCache must be used within a TrailerCacheProvider"
    );
  }

  return context;
}

export default TrailerCacheContext;
