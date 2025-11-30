export const errorResponse = (message, { type, msg, path, location }) => {
  return {
    success: false,
    message,
    errors: [
      {
        type,
        msg,
        path: path || null,
        location: location || null,
      },
    ],
  };
};

export const authErrorResponse = () => {
  return {
    success: false,
    message: "Unauthorized",
    errors: [
      {
        type: "auth",
        msg: "Token missing or invalid",
        path: "authorization",
        location: "header",
      },
    ],
  };
};

export const successResponse = (message, data = null) => {
  return {
    success: true,
    message,
    ...(data && { data }),
  };
};
