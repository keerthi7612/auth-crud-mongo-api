import jwt from "jsonwebtoken";
import User from "../model/authModel.js";
import { authErrorResponse } from "../utils/responseUtil.js";

export const itemMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(authErrorResponse());
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json(authErrorResponse());

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json(authErrorResponse());
  }
};
