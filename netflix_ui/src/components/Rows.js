import React, { useState, useRef, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./Rows.css";

// Hooks
import { useMovies, useInView } from "../hooks";
import { useTrailerCache } from "../context";
import { useMovie } from "../context";

// Components
import OptimizedImage from "./OptimizedImage";

const Rows = ({ title, fetchUrl }) => {
  // Lazy load row when visible
  const [rowRef, isVisible] = useInView({
    threshold: 0.1,
    rootMargin: "200px",
  });

  // Fetch movies using custom hook
  const { movies, loading, error } = useMovies(fetchUrl, {
    enabled: isVisible,
  });

  // Global state
  const { actions, selectors } = useMovie();
  const { getTrailer, setTrailer } = useTrailerCache();

  // Local state
  const [hoveredId, setHoveredId] = useState({ id: null, edge: "center" });
  const [trailerKey, setTrailerKey] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const hoverTimeoutRef = useRef(null);
  const trailerTimeoutRef = useRef(null);
  const trailerAbortRef = useRef(null);

  // Check if device supports hover
  const canHover =
    typeof window !== "undefined"
      ? window.matchMedia("(hover: hover)").matches
      : true;

  // Keen Slider setup
  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    slides: {
      perView: 8,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1400px)": {
        slides: { perView: 6, spacing: 12 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 5, spacing: 10 },
      },
      "(max-width: 768px)": {
        slides: { perView: 3, spacing: 8 },
      },
    },
    dragStarted: () => setIsDragging(true),
    dragEnded: () => setTimeout(() => setIsDragging(false), 100),
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current);
      clearTimeout(trailerTimeoutRef.current);
      trailerAbortRef.current?.abort();
    };
  }, []);

  // Handle mouse enter
  const handleMouseEnter = async (movie, e) => {
    if (!canHover || isDragging) return;

    const card = e.currentTarget;
    if (!card) return;

    // Calculate edge position for transform origin
    const rect = card.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    let edge = "center";
    if (rect.left < 80) edge = "left";
    else if (rect.right > viewportWidth - 80) edge = "right";

    // Add active class to slide for z-index
    card.closest(".row__slide")?.classList.add("slide-active");

    // Delayed hover activation
    hoverTimeoutRef.current = setTimeout(() => {
      if (isDragging) return;
      setHoveredId({ id: movie.id, edge });
    }, 200);

    // Delayed trailer fetch
    trailerTimeoutRef.current = setTimeout(async () => {
      if (isDragging) return;

      // Check cache first
      const cached = getTrailer(movie.id);
      if (cached) {
        setTrailerKey(cached);
        return;
      }

      // Cancel previous request
      trailerAbortRef.current?.abort();
      trailerAbortRef.current = new AbortController();

      try {
        const { default: axios } = await import("../api/axios");
        const res = await axios.get(`/movie/${movie.id}/videos`, {
          signal: trailerAbortRef.current.signal,
        });

        const trailer = res.data.results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );

        if (trailer) {
          setTrailer(movie.id, trailer.key);
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Error fetching trailer:", err);
        }
      }
    }, 500);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!canHover) return;

    // Clear active classes
    document.querySelectorAll(".row__slide.slide-active").forEach((el) => {
      el.classList.remove("slide-active");
    });

    // Clear timeouts
    clearTimeout(hoverTimeoutRef.current);
    clearTimeout(trailerTimeoutRef.current);
    trailerAbortRef.current?.abort();

    // Reset state
    setHoveredId({ id: null, edge: "center" });
    setTrailerKey(null);
    setIframeLoaded(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    const cards = document.querySelectorAll(`[data-row="${title}"] .row__card`);

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        cards[Math.min(index + 1, cards.length - 1)]?.focus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        cards[Math.max(index - 1, 0)]?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        const movie = movies[index];
        if (movie) actions.selectMovie(movie);
        break;
      case "Escape":
        handleMouseLeave();
        break;
      default:
        break;
    }
  };

  // Handle card click
  const handleCardClick = (movie) => {
    actions.selectMovie(movie);
  };

  // Handle favorite toggle
  const handleFavoriteClick = (e, movieId) => {
    e.stopPropagation();
    actions.toggleFavorite(movieId);
  };

  // Render loading skeleton
  if (!isVisible || loading) {
    return (
      <div className="row" ref={rowRef}>
        <h2>{title}</h2>
        <div className="row__skeleton">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="row__skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="row" ref={rowRef}>
        <h2>{title}</h2>
        <div className="row__error">
          <p>Failed to load movies. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row" ref={rowRef} data-row={title}>
      <h2>{title}</h2>

      <div ref={sliderRef} className="keen-slider row__slider">
        {movies.map((movie, index) => {
          const isActive = hoveredId.id === movie.id;
          const isFavorite = selectors.isFavorite(movie.id);

          return (
            <div
              key={movie.id}
              className={`keen-slider__slide row__slide ${
                isActive ? "slide-active" : ""
              }`}
            >
              <div
                className={`row__card ${isActive ? "active" : ""} edge-${
                  hoveredId.edge
                }`}
                onMouseEnter={(e) => handleMouseEnter(movie, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleCardClick(movie)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                tabIndex={0}
                role="button"
                aria-label={`${
                  movie.title || movie.name
                }. Press Enter for details.`}
                aria-expanded={isActive}
              >
                {/* Media container */}
                <div className="row__media">
                  {/* Trailer iframe */}
                  {isActive && trailerKey && (
                    <iframe
                      className={`row__trailer ${iframeLoaded ? "loaded" : ""}`}
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&playsinline=1&modestbranding=1`}
                      allow="autoplay"
                      title={`${movie.title || movie.name} trailer`}
                      onLoad={() => setIframeLoaded(true)}
                    />
                  )}

                  {/* Poster/Backdrop image */}
                  <OptimizedImage
                    path={isActive ? movie.backdrop_path : movie.poster_path}
                    alt={movie.title || movie.name}
                    size={isActive ? "backdrop" : "poster"}
                    className={`row__poster ${
                      isActive && trailerKey && iframeLoaded ? "hidden" : ""
                    }`}
                  />
                </div>

                {/* Info overlay */}
                <div className="row__overlay">
                  <div className="row__info">
                    <div className="row__actions">
                      <button
                        className="row__btn primary"
                        aria-label="Play"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.selectMovie(movie);
                        }}
                      >
                        ▶
                      </button>

                      <button
                        className={`row__btn ${
                          isFavorite ? "active" : "secondary"
                        }`}
                        aria-label={
                          isFavorite ? "Remove from My List" : "Add to My List"
                        }
                        onClick={(e) => handleFavoriteClick(e, movie.id)}
                      >
                        {isFavorite ? "✓" : "+"}
                      </button>

                      <button
                        className="row__btn secondary"
                        aria-label="More info"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.selectMovie(movie);
                        }}
                      >
                        ℹ
                      </button>
                    </div>

                    <p className="row__title">{movie.title || movie.name}</p>

                    {movie.vote_average > 0 && (
                      <p className="row__meta">
                        <span className="row__rating">
                          {Math.round(movie.vote_average * 10)}% Match
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rows;
