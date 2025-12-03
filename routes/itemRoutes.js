import Router from "express";
import { createItem, getAllItems } from "../controller/itemController.js";
import { itemMiddleware } from "../middleware/itemMiddleware.js";
import { validateCreateItem } from "../validation/itemValidator.js";

const itemRoutes = Router();

itemRoutes.get("/getItems", getAllItems);
itemRoutes.post("/create", itemMiddleware, createItem, validateCreateItem);

export default itemRoutes;
