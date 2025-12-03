import jwt from "jsonwebtoken";
import User from "../model/authModel.js";

import { authErrorResponse, serverError } from "../utils/responseUtil.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(authErrorResponse());
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json(authErrorResponse());
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json(authErrorResponse());
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
