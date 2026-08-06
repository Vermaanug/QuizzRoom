const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational === true;

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
