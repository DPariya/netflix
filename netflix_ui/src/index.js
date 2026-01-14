import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Context Providers
import { MovieProvider, TrailerCacheProvider } from "./context";

// Error Boundary
import { ErrorBoundary } from "./components";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <MovieProvider>
        <TrailerCacheProvider>
          <App />
        </TrailerCacheProvider>
      </MovieProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Performance monitoring
// To log results: reportWebVitals(console.log)
// Or send to analytics: https://bit.ly/CRA-vitals
reportWebVitals();
