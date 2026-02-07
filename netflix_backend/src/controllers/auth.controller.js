import User from "../models/User.model.js";
import crypto from "crypto";
import {
  sendTokenResponse,
  getRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  getUserSessions,
  generateAccessToken,
  verifyRefreshToken,
  saveRefreshToken,
} from "../utils/jwt.utils.js";
import {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
} from "../services/email.service.js";
import {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate,
  validateRequiredFields,
  validatePassword,
  validationError,
} from "../utils/validation.utils.js";

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    // Validate input
    const validation = validateRegistration(req.body);
    if (!validation.isValid) {
      return res.status(400).json(validationError(validation.message));
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(validationError("User already exists with this email"));
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Send tokens (access + refresh)
    await sendTokenResponse(user, req, res, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    // Validate input
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return res.status(400).json(validationError(validation.message));
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json(validationError("Invalid credentials"));
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json(validationError("Invalid credentials"));
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Send tokens (access + refresh)
    await sendTokenResponse(user, req, res, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
export const refreshToken = async (req, res, next) => {
  try {
    // Get refresh token from cookie or body
    const { refreshToken: tokenFromBody } = req.body;
    const tokenFromCookie = req.cookies?.refreshToken;

    const token = tokenFromCookie || tokenFromBody;

    if (!token) {
      return res
        .status(401)
        .json(validationError("Refresh token not provided"));
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Get token from database
    const refreshTokenDoc = await getRefreshToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json(validationError("User not found"));
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res
      .status(401)
      .json(validationError(error.message || "Invalid refresh token"));
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    // Get refresh token
    const { refreshToken: tokenFromBody } = req.body;
    const tokenFromCookie = req.cookies?.refreshToken;

    const token = tokenFromCookie || tokenFromBody;

    if (token) {
      await revokeRefreshToken(token);
    }

    // Clear cookie
    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // Even if revoking fails, clear the cookie
    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
};

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices (revoke all refresh tokens)
 * @access  Private
 */
export const logoutAll = async (req, res, next) => {
  try {
    await revokeAllUserTokens(req.user._id);

    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/sessions
 * @desc    Get all active sessions for user
 * @access  Private
 */
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await getUserSessions(req.user._id);

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/update
 * @desc    Update user details
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    // Validate input
    const validation = validateProfileUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json(validationError(validation.message));
    }

    const { name, email, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/password
 * @desc    Update password
 * @access  Private
 */
export const updatePassword = async (req, res, next) => {
  try {
    // Validate input
    const validation = validatePasswordChange(req.body);
    if (!validation.isValid) {
      return res.status(400).json(validationError(validation.message));
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json(validationError("Current password is incorrect"));
    }

    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens for security
    await revokeAllUserTokens(user._id);

    // Generate new tokens
    await sendTokenResponse(user, req, res, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    // Validate email
    const validation = validateRequiredFields(req.body, ["email"]);
    if (!validation.isValid) {
      return res.status(400).json(validationError(validation.message));
    }

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists (security)
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    try {
      // Send email
      await sendPasswordResetEmail(user, resetToken);

      res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (error) {
      // If email fails, clear reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res
        .status(500)
        .json(validationError("Email could not be sent. Please try again."));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    // Validate password
    const validation = validatePassword(req.body.password);
    if (!validation.isValid) {
      return res.status(400).json(validationError(validation.message));
    }

    const { password } = req.body;

    // Hash the token from URL
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return res
        .status(400)
        .json(validationError("Invalid or expired reset token"));
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Revoke all refresh tokens for security
    await revokeAllUserTokens(user._id);

    // Send confirmation email
    try {
      await sendPasswordResetConfirmation(user);
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
    }

    // Generate new tokens
    await sendTokenResponse(user, req, res, 200);
  } catch (error) {
    next(error);
  }
};
