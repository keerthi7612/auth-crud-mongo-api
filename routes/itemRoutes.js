import Router from "express";
import { createItem } from "../controller/itemController.js";
import { itemMiddleware } from "../middleware/itemMiddleware.js";

const itemRoutes = Router();

// GET /items (get logged-in user's items)

itemRoutes.post("/create", itemMiddleware, createItem);

export default itemRoutes;
