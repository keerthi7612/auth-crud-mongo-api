import Router from "express";
import {
  registerUser,
  loginUser,
  getMyProfile,
} from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/register", registerUser).post("/login", loginUser);

authRoutes.get("/profile", authMiddleware, getMyProfile);

export default authRoutes;
