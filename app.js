import dotenv from "dotenv";
dotenv.config({ path: "config.env" });
import express from "express";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
export default app;
