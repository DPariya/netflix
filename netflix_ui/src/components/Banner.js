import React, { useEffect, useState } from "react";
import "./Banner.css";
import { axios } from "../api";
import { requests } from "../api";
const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

const Banner = () => {
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Get trending / netflix originals (from YOUR backend)
        const res = await axios.get(requests.fetchNetflixOriginals);
        const bannerCandidates = res.data.results.filter(
          (item) => item.backdrop_path || item.poster_path
        );

        const randomMovieId =
          bannerCandidates[Math.floor(Math.random() * bannerCandidates.length)];
        setMovie(randomMovieId || null);

        // 2. Fetch trailer
        const endpoint =
          randomMovieId.media_type === "tv"
            ? `/tv/${randomMovieId.id}/videos?api_key=${API_KEY}`
            : `/movie/${randomMovieId.id}/videos?api_key=${API_KEY}`;

        const videoRes = await axios.get(endpoint);
        if (!Array.isArray(res.data.results)) return null;
        // Correct array access
        const trailer = videoRes?.data?.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );

        setVideoKey(trailer?.key || null);
        return res;
      } catch (error) {
        console.error("Banner load failed", error);
      }
    }
    fetchData();
  }, []);

  return (
    <header className="banner">
      {videoKey ? (
        <iframe
          className="banner__video"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}`}
          title="Banner Trailer"
          allow="autoplay; fullscreen"
        />
      ) : (
        <div
          className="banner__image"
          style={{
            backgroundImage: `url(
              https://image.tmdb.org/t/p/original${
                movie?.backdrop_path || movie?.poster_path || null
              }
            )`,
          }}
        />
      )}

      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <p className="banner__description">
          {movie?.overview?.length > 150
            ? movie?.overview.slice(0, 150) + "..."
            : movie?.overview}
        </p>

        <div className="banner__buttons">
          <button className="banner__button">▶ Play</button>
          <button className="banner__button banner__button--secondary">
            More Info
          </button>
        </div>
      </div>

      {/* <div className="banner--fadeBottom" /> */}
    </header>
  );
};

export default Banner;
