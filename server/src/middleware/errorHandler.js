const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    return res.status(409).json({
      success: false,
      message: field ? `${field} already exists` : "Resource already exists",
      code: "DUPLICATE_RESOURCE",
      ...(field && { errors: { [field]: `${field} already exists` } }),
    });
  }

  if (error?.name === "ValidationError") {
    const errors = Object.fromEntries(
      Object.entries(error.errors).map(([field, value]) => [
        field,
        value.message,
      ]),
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors,
    });
  }

  const isOperational = error?.isOperational === true;
  const statusCode = isOperational ? error.statusCode : 500;

  if (!isOperational) {
    console.error(`${req.method} ${req.originalUrl}`, error);
  }

  return res.status(statusCode).json({
    success: false,
    message: isOperational ? error.message : "Internal Server Error",
    code: isOperational ? error.code : "INTERNAL_ERROR",
    ...(error.errors && { errors: error.errors }),
  });
};

export default errorHandler;
