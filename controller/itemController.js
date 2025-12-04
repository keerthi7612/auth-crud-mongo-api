import Item from "../model/itemModel.js";
import {
  sendFieldError,
  sendDuplicateError,
  validationFieldError,
} from "../utils/validationHelper.js";
import { transformItem, transformItems } from "../utils/itemTransformer.js";
import {
  sendCreated,
  sendSuccess,
  sendNotFound,
  sendServerError,
} from "../utils/httpResponseHelper.js";
import {
  buildSearchFilter,
  calculatePagination,
  buildPaginationMeta,
} from "../utils/dbQueryHelper.js";
import { serverError, successResponse } from "../utils/responseUtil.js";
import mongoose from "mongoose";

export const createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === "") {
      return sendFieldError(res, "title is required", "title");
    }

    const existing = await Item.findOne({ title, userId });
    if (existing) {
      return sendDuplicateError(res, "Item already exists", "title");
    }

    const item = await Item.create({ title, description, userId });

    return sendCreated(res, "Item created successfully", {
      id: item._id,
      item: transformItem(item),
    });
  } catch (error) {
    return sendServerError(res, error, "CREATE_ITEM");
  }
};

export const getAllItems = async (req, res) => {
  try {
    let { search = "", page = 1, limit = 5 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page <= 0) {
      return validationFieldError(res, "Invalid page value", "page");
    }

    if (isNaN(limit) || limit <= 0) {
      return validationFieldError(res, "Invalid limit value", "limit");
    }

    const searchFilter = buildSearchFilter(search);
    const { skip, limit: parsedLimit } = calculatePagination(page, limit);

    const items = await Item.find(searchFilter).skip(skip).limit(parsedLimit);

    const totalItems = await Item.countDocuments(searchFilter);

    return sendSuccess(res, "Items fetched successfully", {
      items: transformItems(items),
      pagination: buildPaginationMeta(page, limit, totalItems),
    });
  } catch (error) {
    return sendServerError(res, error, "GET_ITEMS");
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return validationFieldError(res, "Item ID is required", "id", "params");
    }
    const item = await Item.findById(id);

    if (!item) {
      return sendFieldError(res, "Item not found", "id", 404);
    }
    return sendCreated(res, "Item fetched successfully", {
      item: transformItem(item),
    });
  } catch (error) {
    return sendServerError(res, error, "DELETE_ITEM");
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id || id.trim() === "") {
      return sendFieldError(res, "Item ID is required", "id");
    }

    const item = await Item.findOne({ _id: id, userId });

    if (!item) {
      return sendNotFound(
        res,
        "Item not found or you don't have permission to delete this item",
        [
          {
            type: "resource",
            msg: "Item not found",
            path: "id",
            location: "params",
          },
        ]
      );
    }

    await Item.findByIdAndDelete(id);

    return sendSuccess(res, "Item deleted successfully", {
      deletedItem: transformItem(item),
    });
  } catch (error) {
    return sendServerError(res, error, "DELETE_ITEM");
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Validate ID
    if (!id) {
      return validationFieldError(res, "Item ID is required", "id", "params");
    }

    // Validate at least one field
    if (!title && !description) {
      return validationFieldError(
        res,
        "At least one field (title or description) must be provided",
        "body",
        "body"
      );
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;

    // Update the item
    const item = await Item.findByIdAndUpdate(id, updatedData, {
      new: true, // return updated item
      runValidators: true, // apply mongoose validations
    });

    if (!item) {
      return sendFieldError(res, "Item not found", "id", 404);
    }

    return sendCreated(res, "Item updated successfully", {
      item: transformItem(item),
    });
  } catch (error) {
    console.log(error);
    return sendServerError(res, error, "UPDATE_ITEM");
  }
};
