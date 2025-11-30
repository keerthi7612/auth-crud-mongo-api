import jwt from "jsonwebtoken";
import User from "../model/authModel.js";

export const itemMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Validate header format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: [
          {
            type: "auth",
            msg: "Token missing or invalid",
            path: "authorization",
            location: "header",
          },
        ],
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: [
          {
            type: "auth",
            msg: "Token missing or invalid",
            path: "authorization",
            location: "header",
          },
        ],
      });
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      errors: [
        {
          type: "auth",
          msg: "Token missing or invalid",
          path: "authorization",
          location: "header",
        },
      ],
    });
  }
};
