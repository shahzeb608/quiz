import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// middlewares/auth.middleware.js
export const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new ApiError(401, "Not authenticated");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id)
      .select("username email role"); // Include username and other necessary fields

    if (!user) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    next(error);
  }
});

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Access Denied - Admins Only");
  }
  next();
};