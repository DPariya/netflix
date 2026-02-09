import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import AuthModal from "../components/AuthModal";
import "./LandingPage.css";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to browse
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/browse");
    }
  }, [isAuthenticated, navigate]);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing__nav">
        <img
          className="landing__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix"
        />
        <button
          className="landing__signin-btn"
          onClick={() => openAuthModal("login")}
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <div className="landing__hero">
        <div className="landing__overlay"></div>
        <div className="landing__content">
          <h1 className="landing__title">
            Unlimited movies, TV shows, and more
          </h1>
          <h2 className="landing__subtitle">Watch anywhere. Cancel anytime.</h2>
          <p className="landing__cta-text">
            Ready to watch? Enter your email to create or restart your
            membership.
          </p>
          <button
            className="landing__cta-btn"
            onClick={() => openAuthModal("signup")}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Feature 1 */}
      <div className="landing__feature">
        <div className="landing__feature-content">
          <h2 className="landing__feature-title">Enjoy on your TV</h2>
          <p className="landing__feature-text">
            Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray
            players, and more.
          </p>
        </div>
        <div className="landing__feature-image">
          <img
            src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
            alt="TV"
          />
        </div>
      </div>

      {/* Feature 2 */}
      <div className="landing__feature landing__feature--reverse">
        <div className="landing__feature-image">
          <img
            src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
            alt="Mobile"
          />
        </div>
        <div className="landing__feature-content">
          <h2 className="landing__feature-title">
            Download your shows to watch offline
          </h2>
          <p className="landing__feature-text">
            Save your favorites easily and always have something to watch.
          </p>
        </div>
      </div>

      {/* Feature 3 */}
      <div className="landing__feature">
        <div className="landing__feature-content">
          <h2 className="landing__feature-title">Watch everywhere</h2>
          <p className="landing__feature-text">
            Stream unlimited movies and TV shows on your phone, tablet, laptop,
            and TV.
          </p>
        </div>
        <div className="landing__feature-image">
          <img
            src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"
            alt="Devices"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="landing__faq">
        <h2 className="landing__faq-title">Frequently Asked Questions</h2>
        <div className="landing__faq-list">
          <details className="landing__faq-item">
            <summary>What is Netflix Clone?</summary>
            <p>
              Netflix Clone is a streaming service that offers a wide variety of
              award-winning TV shows, movies, anime, documentaries, and more on
              thousands of internet-connected devices.
            </p>
          </details>
          <details className="landing__faq-item">
            <summary>How much does Netflix Clone cost?</summary>
            <p>
              Watch Netflix Clone on your smartphone, tablet, Smart TV, laptop,
              or streaming device, all for one fixed monthly fee. Plans range
              from ₹149 to ₹649 a month.
            </p>
          </details>
          <details className="landing__faq-item">
            <summary>Where can I watch?</summary>
            <p>
              Watch anywhere, anytime. Sign in with your Netflix Clone account
              to watch instantly on the web at netflix-clone.com from your
              personal computer or on any internet-connected device.
            </p>
          </details>
        </div>

        <div className="landing__final-cta">
          <p className="landing__cta-text">
            Ready to watch? Click below to get started.
          </p>
          <button
            className="landing__cta-btn"
            onClick={() => openAuthModal("signup")}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing__footer">
        <p>&copy; 2026 Netflix Clone. Built for learning purposes.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={() => navigate("/browse")}
      />
    </div>
  );
};

export default LandingPage;
