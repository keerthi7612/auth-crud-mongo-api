import User from "../model/authModel.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

import { successResponse, serverError } from "../utils/responseUtil.js";
import {
  sendFieldError,
  validationFieldError,
  sendDuplicateError,
} from "../utils/validationHelper.js";

export const registerUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email) {
      return validationFieldError(res, "Email is required", "email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in)$/i;

    if (!emailRegex.test(email)) {
      return validationFieldError(res, "Invalid email format", "email");
    }

    if (!phone) {
      return validationFieldError(res, "Phone is required", "phone");
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return validationFieldError(
        res,
        "Phone must be a valid 10-digit",
        "phone"
      );
    }

    if (!password) {
      return validationFieldError(res, "Password is required", "password");
    }
    if (password.length < 6) {
      return validationFieldError(
        res,
        "Password must be at least 6 characters long",
        "password"
      );
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return sendDuplicateError(res, "Email already exists", "email");
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return sendDuplicateError(res, "Phone already exists", "phone");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json(
      successResponse("Item created successfully", {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
        },
      })
    );
  } catch (err) {
    return res.status(500).json(serverError());
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return sendFieldError(res, "Email is required", "email");
    }
    if (!password) {
      return sendFieldError(res, "Password is required", "password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return validationFieldError(res, "Invalid email", "email", "body", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return validationFieldError(
        res,
        "Invalid password",
        "password",
        "body",
        401
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json(
      successResponse("Login successful", {
        token,
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
        },
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(serverError());
  }
};

export const getMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return validationFieldError(
        res,
        "User not found",
        "authorization",
        "header"
      );
    }

    return res.status(200).json(
      successResponse("User registered profile", {
        user: {
          id: req.user._id,
          email: req.user.email,
          phone: req.user.phone,
        },
      })
    );
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
