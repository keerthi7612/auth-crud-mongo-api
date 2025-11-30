import Router from "express";
import { createItem } from "../controller/itemController.js";
import { itemMiddleware } from "../middleware/itemMiddleware.js";
import { validateCreateItem } from "../validation/itemValidator.js";

const itemRoutes = Router();

itemRoutes.post("/create", itemMiddleware, createItem, validateCreateItem);

export default itemRoutes;
