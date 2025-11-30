import Item from "../model/itemModel.js";

//create -----------------------------------------------------

export const createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // from authMiddleware

    // 400 - Validation Error
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "title is required",
        errors: [
          {
            type: "field",
            msg: "title is required",
            path: "title",
            location: "body",
          },
        ],
      });
    }

    // 409 - Duplicate item for same user
    const existingItem = await Item.findOne({ title, userId });
    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: "Item already exists",
        errors: [
          {
            type: "unique",
            msg: "Item already exists",
            path: "title",
            location: "body",
          },
        ],
      });
    }

    // Create new item
    const item = await Item.create({
      title,
      description,
      userId,
    });

    // 201 - Created
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
    console.error("Create item error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: [
        {
          type: "server",
          msg: "Unexpected error occurred",
          path: null,
          location: null,
        },
        console.log(error),
      ],
    });
  }
};
