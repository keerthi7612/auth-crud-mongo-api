import Item from "../model/itemModel.js";
import { successResponse, serverError } from "../utils/responseUtil.js";

import {
  sendFieldError,
  sendDuplicateError,
  validationFieldError,
} from "../utils/validationHelper.js";

export const createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === "") {
      return sendFieldError(res, "title is required", "title");
    }

    console.log("Checking if item exists...");
    const existing = await Item.findOne({ title, userId });
    if (existing) {
      return sendDuplicateError(res, "Item already exists", "title");
    }
    console.log("Existing item:", existing);
    const item = await Item.create({ title, description, userId });

    return res.status(201).json(
      successResponse("Item created successfully", {
        item: {
          id: item._id,
          title: item.title,
          description: item.description,
        },
      })
    );
  } catch (error) {
    console.log("Create item error:", error);
    return res.status(500).json(serverError());
  }
};

export const getAllItems = async (req, res) => {
  try {
    const userId = req.user.id;

    let { sort = "asc", search = "", page = 1, limit = 5 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (!["asc", "desc"].includes(sort.toLowerCase())) {
      return validationFieldError(res, "Invalid sort value", "sort"); // use sendFieldError
    }

    if (isNaN(page) || page <= 0) {
      return validationFieldError(res, "Invalid page value", "page"); // use sendFieldError
    }

    if (isNaN(limit) || limit <= 0) {
      return validationFieldError(res, "Invalid limit value", "limit");
    }

    const searchFilter =
      search.trim() !== "" ? { title: { $regex: search, $options: "i" } } : {};

    const skip = (page - 1) * limit;

    const items = await Item.find({
      userId,
      ...searchFilter,
    })
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const totalItems = await Item.countDocuments({ userId, ...searchFilter });
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json(
      successResponse("Items fetched successfully", {
        items: items.map((item) => ({
          id: item._id,
          title: item.title,
          description: item.description,
        })),
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems,
        },
      })
    );
  } catch (error) {
    console.log("GET ITEMS ERROR:", error);
    return res.status(500).json(serverError());
  }
};
