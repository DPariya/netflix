import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Context Providers
import { MovieProvider, TrailerCacheProvider } from "./context";

// Error Boundary
import { ErrorBoundary } from "./components";
import { BrowserRouter } from "react-router-dom";
//Toaster
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <MovieProvider>
          <TrailerCacheProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="dark"
            />
          </TrailerCacheProvider>
        </MovieProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
);

// Performance monitoring
// To log results: reportWebVitals(console.log)
// Or send to analytics: https://bit.ly/CRA-vitals
reportWebVitals();
