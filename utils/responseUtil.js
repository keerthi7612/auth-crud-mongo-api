export const errorResponse = (message, errors = []) => {
  return {
    success: false,
    message,
    errors: errors.map((err) => ({
      type: err.type,
      msg: err.msg,
      path: err.path || null,
      location: err.location || null,
    })),
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

export const serverError = () => {
  return errorResponse("Internal server error", [
    {
      type: "server",
      msg: "Unexpected server error",
      path: null,
      location: null,
    },
  ]);
};
