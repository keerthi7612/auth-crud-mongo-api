import { errorResponse } from "./responseUtil.js";

export const sendFieldError = (res, message, field, statusCode = 400) => {
  const errorDetails = [
    {
      type: "field",
      msg: message,
      path: field,
      location: "body",
    },
  ];
  return res.status(statusCode).json(errorResponse(message, errorDetails));
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
  return res.status(statusCode).json(errorResponse(message, errorDetails));
};
