import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

/**
 * MovieContext - Global state management for movie-related data
 *
 * Features:
 * - Selected movie for detail modal
 * - Modal open/close state
 * - Favorites list (My List)
 * - Watch history
 * - Mute state for trailers
 *
 * @example
 * // In App.js
 * <MovieProvider>
 *   <App />
 * </MovieProvider>
 *
 * // In component
 * const { state, actions } = useMovie();
 * actions.selectMovie(movie);
 * actions.addToFavorites(movie.id);
 */

// Initial state
const initialState = {
  // Modal state
  selectedMovie: null,
  isModalOpen: false,

  // User preferences
  isMuted: true,

  // User lists
  favorites: [], // Array of movie IDs
  watchHistory: [], // Array of { movieId, timestamp, progress }

  // UI state
  isSearchOpen: false,
  searchQuery: "",
};

// Action types
const ActionTypes = {
  SELECT_MOVIE: "SELECT_MOVIE",
  CLOSE_MODAL: "CLOSE_MODAL",
  TOGGLE_MUTE: "TOGGLE_MUTE",
  ADD_TO_FAVORITES: "ADD_TO_FAVORITES",
  REMOVE_FROM_FAVORITES: "REMOVE_FROM_FAVORITES",
  ADD_TO_HISTORY: "ADD_TO_HISTORY",
  CLEAR_HISTORY: "CLEAR_HISTORY",
  TOGGLE_SEARCH: "TOGGLE_SEARCH",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  RESET_STATE: "RESET_STATE",
};

// Reducer
function movieReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SELECT_MOVIE:
      return {
        ...state,
        selectedMovie: action.payload,
        isModalOpen: true,
      };

    case ActionTypes.CLOSE_MODAL:
      return {
        ...state,
        selectedMovie: null,
        isModalOpen: false,
      };

    case ActionTypes.TOGGLE_MUTE:
      return {
        ...state,
        isMuted: action.payload !== undefined ? action.payload : !state.isMuted,
      };

    case ActionTypes.ADD_TO_FAVORITES:
      // Prevent duplicates
      if (state.favorites.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case ActionTypes.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };

    case ActionTypes.ADD_TO_HISTORY:
      // Remove existing entry for same movie, add new one at start
      const filteredHistory = state.watchHistory.filter(
        (item) => item.movieId !== action.payload.movieId
      );
      return {
        ...state,
        watchHistory: [action.payload, ...filteredHistory].slice(0, 50), // Keep last 50
      };

    case ActionTypes.CLEAR_HISTORY:
      return {
        ...state,
        watchHistory: [],
      };

    case ActionTypes.TOGGLE_SEARCH:
      return {
        ...state,
        isSearchOpen:
          action.payload !== undefined ? action.payload : !state.isSearchOpen,
        searchQuery: action.payload === false ? "" : state.searchQuery,
      };

    case ActionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case ActionTypes.RESET_STATE:
      return initialState;

    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
}

// Create context
const MovieContext = createContext(null);

// Provider component
export function MovieProvider({ children }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Memoized action creators
  const actions = {
    selectMovie: useCallback((movie) => {
      dispatch({ type: ActionTypes.SELECT_MOVIE, payload: movie });
    }, []),

    closeModal: useCallback(() => {
      dispatch({ type: ActionTypes.CLOSE_MODAL });
    }, []),

    toggleMute: useCallback((muted) => {
      dispatch({ type: ActionTypes.TOGGLE_MUTE, payload: muted });
    }, []),

    addToFavorites: useCallback((movieId) => {
      dispatch({ type: ActionTypes.ADD_TO_FAVORITES, payload: movieId });
    }, []),

    removeFromFavorites: useCallback((movieId) => {
      dispatch({ type: ActionTypes.REMOVE_FROM_FAVORITES, payload: movieId });
    }, []),

    toggleFavorite: useCallback(
      (movieId) => {
        if (state.favorites.includes(movieId)) {
          dispatch({
            type: ActionTypes.REMOVE_FROM_FAVORITES,
            payload: movieId,
          });
        } else {
          dispatch({ type: ActionTypes.ADD_TO_FAVORITES, payload: movieId });
        }
      },
      [state.favorites]
    ),

    addToHistory: useCallback((movieId, progress = 0) => {
      dispatch({
        type: ActionTypes.ADD_TO_HISTORY,
        payload: { movieId, timestamp: Date.now(), progress },
      });
    }, []),

    clearHistory: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_HISTORY });
    }, []),

    toggleSearch: useCallback((isOpen) => {
      dispatch({ type: ActionTypes.TOGGLE_SEARCH, payload: isOpen });
    }, []),

    setSearchQuery: useCallback((query) => {
      dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query });
    }, []),

    resetState: useCallback(() => {
      dispatch({ type: ActionTypes.RESET_STATE });
    }, []),
  };

  // Helper selectors
  const selectors = {
    isFavorite: useCallback(
      (movieId) => state.favorites.includes(movieId),
      [state.favorites]
    ),

    getWatchProgress: useCallback(
      (movieId) => {
        const item = state.watchHistory.find((h) => h.movieId === movieId);
        return item?.progress || 0;
      },
      [state.watchHistory]
    ),
  };

  const value = {
    state,
    actions,
    selectors,
    dispatch, // Expose dispatch for advanced use cases
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}

// Custom hook to use the context
export function useMovie() {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider");
  }

  return context;
}

// Export action types for testing
export { ActionTypes };

export default MovieContext;
