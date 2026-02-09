import React, { useState, useEffect } from "react";
import { useAuth } from "../context";
import "./AuthModal.css";
import { showSuccess, showError } from "../utils/toast";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register, forgotPassword } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setError("");
      setSuccess("");
    }
  }, [isOpen, mode]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!formData.name || !formData.email || !formData.password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const result = await register(
          formData.name,
          formData.email,
          formData.password,
        );

        if (result.success) {
          onClose();
        } else {
          setError(result.message);
          showError(result.message);
        }
      } else if (mode === "login") {
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
          onClose();
        } else {
          setError(result.message);
          showError(result.message);
        }
      } else if (mode === "forgot") {
        if (!formData.email) {
          setError("Please enter your email");
          showError("Please enter your email");
          setLoading(false);
          return;
        }

        const result = await forgotPassword(formData.email);

        if (result.success) {
          setSuccess("Password reset link sent! Check your email.");
          setTimeout(() => {
            setMode("login");
          }, 3000);
        } else {
          setError(result.message);
          showError(result.message);
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-modal__content">
          <div className="auth-modal__header">
            <h2 className="auth-modal__title">
              {mode === "login" && "Sign In"}
              {mode === "signup" && "Sign Up"}
              {mode === "forgot" && "Reset Password"}
            </h2>
          </div>

          <form className="auth-modal__form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-modal__error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            {success && (
              <div className="auth-modal__success">
                <span className="success-icon">✓</span>
                {success}
              </div>
            )}

            {mode === "signup" && (
              <div className="auth-modal__field">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="auth-modal__input"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="auth-modal__field">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="auth-modal__input"
                autoComplete="email"
              />
            </div>

            {mode !== "forgot" && (
              <div className="auth-modal__field">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-modal__input"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </div>
            )}

            {mode === "signup" && (
              <div className="auth-modal__field">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="auth-modal__input"
                  autoComplete="new-password"
                />
              </div>
            )}

            <button
              type="submit"
              className="auth-modal__submit"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  {mode === "login" && "Sign In"}
                  {mode === "signup" && "Sign Up"}
                  {mode === "forgot" && "Send Reset Link"}
                </>
              )}
            </button>

            {mode === "login" && (
              <button
                type="button"
                className="auth-modal__link"
                onClick={() => setMode("forgot")}
              >
                Forgot Password?
              </button>
            )}

            <div className="auth-modal__divider">
              <span>
                {mode === "login" && "New to Netflix Clone?"}
                {mode === "signup" && "Already have an account?"}
                {mode === "forgot" && "Remember your password?"}
              </span>
            </div>

            <button
              type="button"
              className="auth-modal__switch"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" && "Sign up now"}
              {mode === "signup" && "Sign in instead"}
              {mode === "forgot" && "Back to Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
