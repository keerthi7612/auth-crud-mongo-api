import Item from "../model/itemModel.js";
import { errorResponse } from "../utils/responseUtil.js";

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
