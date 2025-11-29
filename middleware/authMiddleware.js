import jwt from "jsonwebtoken";
import User from "../model/authModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 400 - Validation error (No token)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // 401 - Invalid token
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    // 401 - Token valid but user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // 500 - server error
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
};
