import Router from "express";
import {
  registerUser,
  loginUser,
  getMyProfile,
} from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser).post("/login", loginUser);

router.get("/profile", authMiddleware, getMyProfile);

export default router;
