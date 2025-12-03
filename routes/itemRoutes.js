import Router from "express";
import {
  createItem,
  getAllItems,
  getItemById,
} from "../controller/itemController.js";
import { itemMiddleware } from "../middleware/itemMiddleware.js";
import { validateCreateItem } from "../validation/itemValidator.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const itemRoutes = Router();

itemRoutes.get("/getItems", getAllItems);
itemRoutes.get("/getItem/:id", authMiddleware, getItemById);
itemRoutes.post("/create", itemMiddleware, createItem, validateCreateItem);

export default itemRoutes;
