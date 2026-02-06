import axios from "axios";

/**
 * Configured Axios instance for TMDB API
 *
 * Features:
 * - Point to backend
 * - Request timeout
 * - Response error handling
 * - Rate limit detection
 */

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add language parameter if not present
    if (!config.params?.language) {
      config.params = {
        ...config.params,
        language: "en-US",
      };
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          console.error("API Error: Unauthorized");
          break;
        case 404:
          console.error("API Error: Resource not found");
          break;
        case 429:
          console.error("API Error: Rate limit exceeded. Please wait.");
          // Could implement retry logic here
          break;
        case 500:
        case 502:
        case 503:
          console.error("API Error: Server error. Please try again later.");
          break;
        default:
          console.error(`API Error: ${status}`);
      }
    } else if (error.request) {
      console.error("Network error: No response received");
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default instance;
