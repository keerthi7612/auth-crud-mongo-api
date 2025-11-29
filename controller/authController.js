import User from "../model/authModel.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validation errors (400)
    const errors = [];

    if (!email) {
      errors.push({
        type: "field",
        msg: "Email is required",
        path: "email",
        location: "body",
      });
    }

    if (!phone) {
      errors.push({
        type: "field",
        msg: "Phone is required",
        path: "phone",
        location: "body",
      });
    }

    if (!password) {
      errors.push({
        type: "field",
        msg: "Password is required",
        path: "password",
        location: "body",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Check duplicate
    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Validation failed",
        errors: [
          existing.email === email && {
            type: "unique",
            msg: "Email already exists",
            path: "email",
            location: "body",
          },
          existing.phone === phone && {
            type: "unique",
            msg: "Phone already exists",
            path: "phone",
            location: "body",
          },
        ].filter(Boolean),
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      phone,
      password: hashedPassword,
    });

    // Response (201)
    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);

    // Response (500)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: [
        {
          type: "server",
          msg: "Unexpected error occurred",
          path: null,
          location: null,
        },
      ],
    });
  }
};
//login user--------------------------------

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 400 — Missing fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [
          {
            type: "field",
            msg: "Email and password are required",
            path: "email/password",
            location: "body",
          },
        ],
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errors: [
          {
            type: "auth",
            msg: "Invalid credentials",
            path: "email",
            location: "body",
          },
        ],
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errors: [
          {
            type: "auth",
            msg: "Invalid credentials",
            path: "password",
            location: "body",
          },
        ],
      });
    }

    // Token generation

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR →", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: [
        {
          type: "server",
          msg: error.message || "Unexpected error occurred",
          path: null,
          location: null,
        },
      ],
    });
  }
};
//getprofile-----------------------------------

export const getMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        errors: [
          {
            type: "field",
            msg: "cannot find email",
            path: "email",
            location: "body",
          },
        ],
      });
    }

    return res.status(200).json({
      id: req.user._id,
      email: req.user.email,
      phone: req.user.phone,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
      errors: [
        {
          type: "server",
          msg: error.message,
          path: null,
          location: null,
        },
      ],
    });
  }
};
