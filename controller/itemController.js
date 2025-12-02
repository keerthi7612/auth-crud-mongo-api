import Item from "../model/itemModel.js";
import { errorResponse } from "../utils/responseUtil.js";

//####################post####################################

export const createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === "") {
      return res.status(400).json(
        errorResponse("title is required", {
          type: "field",
          msg: "title is required",
          path: "title",
          location: "body",
        })
      );
    }

    const existing = await Item.findOne({ title, userId });

    if (existing) {
      return res.status(409).json(
        errorResponse("Item already exists", {
          type: "unique",
          msg: "Item already exists",
          path: "title",
          location: "body",
        })
      );
    }

    const item = await Item.create({ title, description, userId });

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      item: {
        id: item._id,
        title: item.title,
        description: item.description,
      },
    });
  } catch (error) {
    console.log("Create item error:", error);

    return res.status(500).json(
      errorResponse("Internal server error", {
        type: "server",
        msg: "Unexpected error occurred",
        path: null,
        location: null,
      })
    );
  }
};

//###################GET##############################

export const getAllItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const { sort = "asc", search = "", page = 1, limit = 5 } = req.query;

    if (!["asc", "desc"].includes(sort.toLowerCase())) {
      return res.status(400).json(
        errorResponse("Validation failed", {
          type: "query",
          msg: "Invalid sort value",
          path: "sort",
          location: "query",
        })
      );
    }

    if (isNaN(page) || page <= 0) {
      return res.status(400).json(
        errorResponse("Validation failed", {
          type: "query",
          msg: "Invalid page value",
          path: "page",
          location: "query",
        })
      );
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

    if (items.length === 0) {
      return res.status(404).json(
        errorResponse("Item not found", {
          type: "not_found",
          msg: "No items found for this user",
          path: "items",
          location: "database",
        })
      );
    }

    const totalItems = await Item.countDocuments({ userId, ...searchFilter });
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      success: true,
      message: "Items fetched successfully",
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
    });
  } catch (error) {
    console.log("GET ITEMS ERROR:", error);

    return res.status(500).json(
      errorResponse("Internal server error", {
        type: "server",
        msg: "Unexpected server error",
        path: null,
        location: null,
      })
    );
  }
};
