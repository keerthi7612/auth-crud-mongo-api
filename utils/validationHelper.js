import { errorResponse } from "./responseUtil.js";

export const sendFieldError = (res, message, field, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: [
      {
        type: "field",
        msg: message,
        path: field,
        location: "body",
      },
    ],
  });
};

export const sendDuplicateError = (res, message, field, statusCode = 409) => {
  return res.status(statusCode).json(
    errorResponse(message, [
      {
        type: "unique",
        msg: message,
        path: field,
        location: "body",
      },
    ])
  );
};

export const validationFieldError = (
  res,
  message,
  field,
  location = "body",
  statusCode = 400
) => {
  const errorDetails = [
    {
      type: "field",
      msg: message,
      path: field,
      location,
    },
  ];
  return res
    .status(statusCode)
    .json(errorResponse("validation failed", errorDetails));
};

export const sendNotFoundError = (res, message, field = "id") => {
  const errorDetails = [
    {
      type: "not_found",
      msg: message,
      path: field,
      location: "path",
    },
  ];

  return res.status(404).json(errorResponse(message, errorDetails));
};
