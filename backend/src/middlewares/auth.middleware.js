
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";


export const protect = asyncHandler(async (req, res, next) => {
  try {
    let token;
    
    
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
      console.log("Found token in cookies");
    } 
    
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Found token in Authorization header");
    }
    
    if (!token) {
      console.log("No token found");
      throw new ApiError(401, "Not authenticated");
    }
    
    
    console.log("Verifying token:", token.substring(0, 10) + "...");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded);
    
    
    const user = await User.findById(decoded._id || decoded.id).select("-password");
    if (!user) {
      console.log("User not found for ID:", decoded._id || decoded.id);
      throw new ApiError(404, "User not found");
    }
    
    console.log("User authenticated:", user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    throw new ApiError(401, "Authentication failed: " + error.message);
  }
});
export const hasRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, `Access Denied - Requires one of: ${roles.join(', ')}`);
  }
  next();
};


export const isAdmin = hasRole(['admin']);


export const isAdminOrModerator = hasRole(['admin', 'moderator']);