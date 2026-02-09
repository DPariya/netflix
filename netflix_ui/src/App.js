import "./App.css";
import { AuthProvider } from "./context";
import { Routes, Route, Navigate } from "react-router-dom";
import BrowsePage from "./pages/BrowsePage";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <BrowsePage />
              </ProtectedRoute>
            }
          />
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
