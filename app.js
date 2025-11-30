import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/item", itemRoutes);
export default app;
