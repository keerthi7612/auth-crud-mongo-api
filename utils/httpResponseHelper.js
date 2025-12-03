import { successResponse, serverError } from "./responseUtil.js";

export const sendCreated = (res, message, data) => {
  return res.status(201).json(successResponse(message, data));
};

export const sendSuccess = (res, message, data) => {
  return res.status(200).json(successResponse(message, data));
};

export const sendNotFound = (res, message, errors) => {
  return res.status(404).json({
    success: false,
    message,
    errors
  });
};

export const sendServerError = (res, error, context = "") => {
  return res.status(500).json(serverError());
};