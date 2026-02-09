import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.model.js";
import crypto from "crypto";

//generate access token
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m",
  });
};
//generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });
};
//verify Access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

//verify Refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

//save refresh token to database
export const saveRefreshToken = async (userId, token, req) => {
  const userAgent = req.headers["user-agent"] || "unknown";
  const ipAddress = req.ip || req.connection?.remoteAddress;
  //calculate expiry date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  //create refresh token
  const refreshToken = await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
    createdByIp: ipAddress || req.connection.remoteAddress,
    userAgent,
  });
  return refreshToken;
};

//get refresh token
export const getRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate(
    "user",
    "-password",
  );
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }
  if (!refreshToken.isActive()) {
    throw new Error("Refresh token is expired or revoked");
  }

  return refreshToken;
};

//revoke refresh token
export const revokeRefreshToken = async (token, replacedByToken = null) => {
  const refreshToken = await RefreshToken.findOne({ token });
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }
  refreshToken.isRevoked = true;
  refreshToken.revokedAt = Date.now();
  if (replacedByToken) {
    refreshToken.replacedByToken = replacedByToken;
  }
  await refreshToken.save();
  return refreshToken;
};

//revoke all refresh token when log out from all devices
export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { user: userId, isRevoked: false },
    {
      $set: {
        isRevoked: true,
        revokedAt: Date.now(),
      },
    },
  );
};

//delete expired token(for cleanup)
export const deleteExpiredToken = async () => {
  const result = await RefreshToken.deleteMany({
    expiresAt: { $lt: Date.now() },
  });
  return result;
};

//get all active session fo user
export const getUserSessions = async (userId) => {
  const sessions = await RefreshToken.find({
    user: userId,
    isRevoked: false,
    expiresAt: { $gt: Date.now() },
  })
    .sort({ createdAt: -1 })
    .select("createdAt createdByIp userAgent");
  return sessions;
};

//send token response (both access & refresh tokens)
export const sendTokenResponse = async (user, req, res, statusCode = 200) => {
  //generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  //save refresh token in db
  await saveRefreshToken(user._id, refreshToken, req);

  //set refresh token in http request
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
};
