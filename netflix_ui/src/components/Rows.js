import React, { useState, useEffect, useRef } from "react";
import axios from "../axios.js";
import "./Rows.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useInView } from "./UseInView.js";
import { useTrailerCache } from "../utility/context/TrailerCacheContext.js";
const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

const Rows = ({ title, fetchUrl }) => {
  const [rowRef, isVisible] = useInView();
  const { getTrailer, setTrailer } = useTrailerCache();
  const [movies, setMovies] = useState([]);
  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    slides: {
      perView: 8,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1400px)": {
        slides: { perView: 6 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 5 },
      },
      "(max-width: 768px)": {
        slides: { perView: 3 },
      },
    },
  });

  const [hoveredId, setHoveredId] = useState({ id: null, edge: "center" });
  const hoverTimeoutRef = useRef(null);
  const canHover = window.matchMedia("(hover: hover)").matches;

  //to fetch video on hover
  const [trailerKey, setTrailerKey] = useState(null);
  const hoverTimer = useRef(null);

  //to abort rapid hover api call
  const trailerAbortRef = useRef(null);

  //catch visible video in advance
  const trailerCache = useRef(new Map());

  //for video loading
  const [iframeLoaded, setIframeLoaded] = useState(false);

  //fetch video/images
  useEffect(() => {
    async function fetchMovies() {
      try {
        // console.log("fetchUrl", fetchUrl);
        const res = await axios.get(fetchUrl);
        // console.log("res", res.data.results);
        setMovies(res?.data?.results || []);
      } catch (error) {
        console.error(error);
      }
    }

    // return () => {

    // };
    fetchMovies();
  }, [fetchUrl]);

  //fetch advance video
  useEffect(() => {
    const preloadTrailers = async () => {
      const preloadCount = 4;
      const initialMovies = movies.slice(0, preloadCount);

      for (const movie of initialMovies) {
        if (trailerCache.current.has(movie.id)) continue;

        try {
          const res = await axios.get(
            `/movie/${movie.id}/videos?api_key=${API_KEY}`
          );

          const trailer = res.data.results.find(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          );

          if (trailer) {
            trailerCache.current.set(movie.id, trailer.key);
          }
        } catch {}
      }
    };

    if (movies.length) preloadTrailers();
  }, [movies]);

  const handleMouseEnter = (movieId, e) => {
    if (!canHover) return;
    const card = e.currentTarget; // capture immediately

    if (!card) return;

    const rect = card.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    let edge = "center";

    if (rect.left < 80) edge = "left";
    else if (rect.right > viewportWidth - 80) edge = "right";

    hoverTimeoutRef.current = setTimeout(async () => {
      setHoveredId({ id: movieId, edge });
    }, 350);

    hoverTimer.current = setTimeout(async () => {
      // 1. CHECK CACHE FIRST
      const cached = getTrailer(movieId);
      if (cached) {
        console.log(cached);
        setTrailerKey(cached);
        return;
      }
      // 2. cancel previous request
      if (trailerAbortRef.current) {
        trailerAbortRef.current.abort();
      }

      const controller = new AbortController();
      trailerAbortRef.current = controller;
      try {
        // 3. FETCH FROM API ONLY IF NOT CACHED
        const res = await axios.get(
          `/movie/${movieId}/videos?api_key=${API_KEY}`,
          { signal: controller.signal }
        );

        const trailer = res.data.results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );

        if (trailer) {
          trailerCache.current.set(movieId, trailer.key); // store in cache
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      }
    }, 700); // Netflix-like delay
  };
  //keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      document.querySelectorAll(".row__card")[index + 1]?.focus();
    }

    if (e.key === "ArrowLeft") {
      document.querySelectorAll(".row__card")[index - 1]?.focus();
    }

    if (e.key === "Enter") {
      // open modal / play
    }
  };

  //hover leave
  const handleMouseLeave = () => {
    if (!canHover) return;

    clearTimeout(hoverTimeoutRef.current);
    clearTimeout(hoverTimer.current);

    if (trailerAbortRef.current) {
      trailerAbortRef.current.abort();
    }

    setHoveredId({ id: null, edge: "center" });
    setTrailerKey(null);

    setIframeLoaded(false);
  };
  return (
    <>
      <div className="row" ref={rowRef}>
        <h2>{title}</h2>
        {isVisible ? (
          <div ref={sliderRef} className="keen-slider row__slider">
            {movies
              ?.filter((movie) => movie.poster_path || movie?.backdrop_path)
              .map((movie, index) => {
                return (
                  <div key={movie.id} className="keen-slider__slide row__slide">
                    <div
                      className={`row__card ${
                        hoveredId.id === movie.id ? "active" : ""
                      } edge-${hoveredId.edge}`}
                      onMouseEnter={(e) => handleMouseEnter(movie.id, e)}
                      onMouseLeave={handleMouseLeave}
                      tabIndex={0}
                      onFocus={() =>
                        setHoveredId({ id: movie.id, edge: "center" })
                      }
                      onBlur={handleMouseLeave}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    >
                      <div className="row__media">
                        {hoveredId.id === movie.id && trailerKey ? (
                          <iframe
                            className={`row__trailer ${
                              iframeLoaded ? "loaded" : ""
                            }`}
                            onLoad={() => setIframeLoaded(true)}
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&playsinline=1`}
                            allow="autoplay"
                            title="trailer"
                          />
                        ) : (
                          <img
                            src={
                              hoveredId.id === movie.id
                                ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                                : `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            }
                            loading="lazy"
                            className="row__poster hover"
                            alt={movie?.name || null}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                      <div className="row__overlay">
                        <div className="row__info">
                          {/* <div className="row__overlay"> */}
                          <div className="row__actions">
                            <button className="row__btn">▶</button>
                            <button className="row__btn secondary">ℹ</button>
                          </div>
                          <p className="row__title">
                            {movie.title || movie.name}
                          </p>
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="row__skeleton">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="row__skeleton-card" />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Rows;
