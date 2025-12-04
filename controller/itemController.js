import Item from "../model/itemModel.js";
import { successResponse, serverError } from "../utils/responseUtil.js";
import {
  sendFieldError,
  sendDuplicateError,
  validationFieldError,
} from "../utils/validationHelper.js";
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
    return res.status(500).json(serverError());
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

    const searchFilter =
      search.trim() !== "" ? { title: { $regex: search, $options: "i" } } : {};

    const skip = (page - 1) * limit;

    const items = await Item.find({
      ...searchFilter,
    })

      .skip(skip)
      .limit(limit);

    const totalItems = await Item.countDocuments({ ...searchFilter });
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json(
      successResponse("Items fetched successfully", {
        items: items.map((item) => ({
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
    return res.status(500).json(serverError());
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

    return res.status(200).json(
      successResponse("Item fetched successfully", {
        item: {
          id: item._id,
          title: item.title,
          description: item.description,
        },
      })
    );
  } catch (error) {
    return res.status(500).json(serverError());
  }
};
