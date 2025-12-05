import Item from "../model/itemModel.js";
import {
  sendFieldError,
  sendDuplicateError,
  validationFieldError,
  sendNotFoundError,
} from "../utils/validationHelper.js";
import { transformItem, transformItems } from "../utils/itemTransformer.js";
import {
  sendCreated,
  sendSuccess,
  sendServerError,
} from "../utils/httpResponseHelper.js";
import {
  buildSearchFilter,
  calculatePagination,
  buildPaginationMeta,
} from "../utils/dbQueryHelper.js";

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
      return validationFieldError(res, "Invalid page value", "page", "query");
    }

    if (isNaN(limit) || limit <= 0) {
      return validationFieldError(res, "Invalid limit value", "limit", "query");
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

    if (!id || id.trim() === "") {
      return sendFieldError(res, "Item ID is required", "id");
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendFieldError(res, "Invalid Item ID format", "id");
    }

    const item = await Item.findById(id);
    if (!item) {
      return sendNotFoundError(res, "Item not found", "id");
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

    if (!id || id.trim() === "") {
      return sendFieldError(res, "Item ID is required", "id");
    }

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendFieldError(res, "Invalid Item ID format", "id");
    }
    const userId = req.user.id;
    const item = await Item.findOne({ _id: id, userId });

    if (!item) {
      return sendNotFoundError(res, "Item not found", "id");
    }
    await Item.findByIdAndDelete(id);

    return sendSuccess(res, "Item deleted successfully", {
      deletedItem: transformItem(item),
    });
  } catch (error) {
    console.log(error);
    return sendServerError(res, error, "DELETE_ITEM");
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim() === "") {
      return sendFieldError(res, "Item ID is required", "id");
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendFieldError(res, "Invalid Item ID format", "id", 400);
    }
    const item = await Item.findById(id);
    if (!item) {
      return sendNotFoundError(res, "Item not found", "id");
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return validationFieldError(res, "Request body is required", "body");
    }
    const { title, description } = req.body;
    if (title !== undefined && title.trim() === "") {
      return validationFieldError(res, "Title cannot be empty", "title");
    }
    const noChange =
      (title === undefined || title === item.title) &&
      (description === undefined || description === item.description);

    if (noChange) {
      return sendSuccess(res, "No changes detected", {
        item: {
          title: item.title,
          description: item.description,
        },
      });
    }
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    await item.save();
    return sendSuccess(res, "Item updated successfully", {
      item: {
        title: item.title,
        description: item.description,
      },
    });
  } catch (error) {
    return sendServerError(res, error, "UPDATE_ITEM");
  }
};
