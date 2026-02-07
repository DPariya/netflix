import User from "../models/User.model";
import { verifyAccessToken } from "../utils/jwt.utils";

//protected routes - verify jwt
export const protect = async (req, res, next) => {
  let token;

  //check for token in header
  if (
    res.headers.authorization &&
    res.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, please login.",
    });
  }
  try {
    //verify access token
    const decoded = await verifyAccessToken(token);

    //get user from token
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token may be invalid.",
      });
    }
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({
        success: false,
        message: "Access token expired, Please send refresh token.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Token is invalid. Please login again.",
      code: "TOKEN_EXPIRED",
    });
  }
};

//Optional: Check if user owns the resource
export const authorize = (req, res, next) => {
  if (req.params.userId && req.params.userId !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this resource",
    });
  }
  next();
};
