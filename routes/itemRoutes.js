import Router from "express";
import {
  createItem,
  getAllItems,
  deleteItem,
  getItemById,
} from "../controller/itemController.js";
import { itemMiddleware } from "../middleware/itemMiddleware.js";
import { validateCreateItem } from "../validation/itemValidator.js";

const itemRoutes = Router();

itemRoutes.get("/getItems", getAllItems);
itemRoutes.get("/getItem/:id", getItemById);
itemRoutes.post("/create", itemMiddleware, createItem, validateCreateItem);
itemRoutes.delete("/:id", itemMiddleware, deleteItem);

export default itemRoutes;
