import Router from "express";
import {
  createItem,
  getAllItems,
  deleteItem,
  getItemById,
  updateItem,
} from "../controller/itemController.js";
import { itemMiddleware } from "../middleware/itemMiddleware.js";
import { validateCreateItem } from "../validation/itemValidator.js";

const itemRoutes = Router();

itemRoutes.get("/getItems", getAllItems);
itemRoutes.get("/getItem/:id", getItemById);
itemRoutes.post("/create", itemMiddleware, createItem, validateCreateItem);
itemRoutes.delete("/delete/:id", itemMiddleware, deleteItem);
itemRoutes.put("/update/:id", itemMiddleware, updateItem);

export default itemRoutes;
