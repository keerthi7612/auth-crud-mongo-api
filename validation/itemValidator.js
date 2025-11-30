import Joi from "joi";
import { errorResponse } from "../utils/responseUtil.js";

export const validateCreateItem = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).required().messages({
      "string.empty": "title is required",
      "any.required": "title is required",
    }),

    description: Joi.string().allow("").optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const details = error.details.map((err) => ({
      type: "validation",
      msg: err.message,
      path: err.path[0],
      location: "body",
    }));

    return res
      .status(400)
      .json(errorResponse(400, "Validation error", "validation", details));
  }

  next();
};
