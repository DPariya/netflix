import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FiSearch } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { BiCaretDown } from "react-icons/bi";
import { useAuth } from "../context";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfileMenu && !e.target.closest(".nav__profile-container")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfileMenu]);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };
  return (
    <div className={`nav ${scroll && "nav_black"}`}>
      {/* LEFT */}
      <div className="nav__left">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Netflix-Logo.png"
          alt="NETFLIX"
        />
        <ul className="nav__menu">
          <li className="active">Home</li>
          <li>Shows</li>
          <li>Movies</li>
          <li>Games</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>
      {/* RIGHT */}
      {/* <div className="nav__right">
        <FiSearch className="nav__icon" />
        <span className="nav__kids">Children</span>
        <MdNotificationsNone className="nav__icon" />
        <img
          className="nav__avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="avatar"
        />
        <BiCaretDown className="nav__icon small" />
      </div> */}
      <div className="nav__right">
        <FiSearch className="nav__icon" />

        {isAuthenticated ? (
          <>
            <span className="nav__kids">Children</span>
            <MdNotificationsNone className="nav__icon" />

            <div
              className="nav__profile-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="nav__profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  className="nav__avatar"
                  src={
                    user?.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                  }
                  alt="avatar"
                />
                <BiCaretDown className="nav__icon small" />
              </div>

              {showProfileMenu && (
                <div className="nav__dropdown">
                  <div className="dropdown__header">
                    <img
                      src={
                        user?.avatar ||
                        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                      }
                      alt="Profile"
                    />
                    <div className="dropdown__info">
                      <p className="dropdown__name">{user?.name}</p>
                      <p className="dropdown__email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="dropdown__divider"></div>
                  <button className="dropdown__item">
                    <span className="dropdown__icon">👤</span>
                    Account
                  </button>
                  <button className="dropdown__item">
                    <span className="dropdown__icon">💾</span>
                    My List
                  </button>
                  <button className="dropdown__item">
                    <span className="dropdown__icon">⚙️</span>
                    Settings
                  </button>
                  <div className="dropdown__divider"></div>
                  <button
                    className="dropdown__item dropdown__logout"
                    onClick={handleLogout}
                  >
                    <span className="dropdown__icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="nav__auth-buttons">
            <button
              className="nav__button nav__button--secondary"
              onClick={() => openAuthModal("login")}
            >
              Sign In
            </button>
            <button
              className="nav__button nav__button--primary"
              onClick={() => openAuthModal("signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={() => navigate("/browse")}
      />
    </div>
  );
};

export default Navbar;
