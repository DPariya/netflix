import React, { useState, useRef, useEffect } from "react";
import "./OptimizedImage.css";

/**
 * Optimized image component with:
 * - Responsive srcSet for different screen sizes
 * - Lazy loading with IntersectionObserver
 * - Blur-up placeholder effect
 * - Error fallback
 * - Loading skeleton
 *
 * @param {object} props
 * @param {string} props.path - TMDB image path (e.g., "/abc123.jpg")
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Preferred size: "poster" | "backdrop" | "profile"
 * @param {string} props.fallbackSrc - Fallback image URL on error
 * @param {boolean} props.priority - Load immediately without lazy loading
 * @param {function} props.onLoad - Callback when image loads
 * @param {function} props.onError - Callback when image fails to load
 *
 * @example
 * <OptimizedImage
 *   path={movie.poster_path}
 *   alt={movie.title}
 *   size="poster"
 * />
 */

const TMDB_BASE_URL = "https://image.tmdb.org/t/p";

// TMDB available sizes
const SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    xlarge: "w780",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    xlarge: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
  },
};

const OptimizedImage = ({
  path,
  alt = "",
  className = "",
  size = "poster",
  fallbackSrc = null,
  priority = false,
  onLoad,
  onError,
  ...props
}) => {
  const [status, setStatus] = useState("loading"); // loading | loaded | error
  const [currentSrc, setCurrentSrc] = useState(null);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Get size configuration
  const sizeConfig = SIZES[size] || SIZES.poster;

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!path) return "";

    return Object.entries(sizeConfig)
      .map(([key, tmdbSize]) => {
        const width = tmdbSize.replace(/\D/g, "") || "1280";
        return `${TMDB_BASE_URL}/${tmdbSize}${path} ${width}w`;
      })
      .join(", ");
  };

  // Generate sizes attribute
  const generateSizes = () => {
    if (size === "backdrop") {
      return "(max-width: 768px) 300px, (max-width: 1200px) 780px, 1280px";
    }
    return "(max-width: 768px) 185px, (max-width: 1200px) 342px, 500px";
  };

  // Default source (medium size)
  const defaultSrc = path
    ? `${TMDB_BASE_URL}/${sizeConfig.medium}${path}`
    : fallbackSrc;

  // Placeholder (tiny blurred image)
  const placeholderSrc = path ? `${TMDB_BASE_URL}/w92${path}` : null;

  useEffect(() => {
    if (!path && !fallbackSrc) {
      setStatus("error");
      return;
    }

    if (priority) {
      setCurrentSrc(defaultSrc);
      return;
    }

    // Lazy load with IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      setCurrentSrc(defaultSrc);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSrc(defaultSrc);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [path, defaultSrc, fallbackSrc, priority]);

  const handleLoad = (e) => {
    setStatus("loaded");
    onLoad?.(e);
  };

  const handleError = (e) => {
    setStatus("error");

    // Try fallback if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setStatus("loading");
    }

    onError?.(e);
  };

  // Default fallback placeholder
  const defaultFallback = (
    <div className="optimized-image__fallback">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
      </svg>
    </div>
  );

  if (status === "error" && !fallbackSrc) {
    return (
      <div
        ref={imgRef}
        className={`optimized-image optimized-image--error ${className}`}
        {...props}
      >
        {defaultFallback}
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`optimized-image ${
        status === "loaded" ? "optimized-image--loaded" : ""
      } ${className}`}
      {...props}
    >
      {/* Blur placeholder */}
      {status === "loading" && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className="optimized-image__placeholder"
          aria-hidden="true"
        />
      )}

      {/* Skeleton loader */}
      {status === "loading" && !placeholderSrc && (
        <div className="optimized-image__skeleton" />
      )}

      {/* Main image */}
      {currentSrc && (
        <img
          src={currentSrc}
          srcSet={generateSrcSet()}
          sizes={generateSizes()}
          alt={alt}
          className={`optimized-image__img ${
            status === "loaded" ? "optimized-image__img--visible" : ""
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage;
