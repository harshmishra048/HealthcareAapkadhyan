const errorMiddleware = (err, req, res, next) => {
  console.error("========================================");
  console.error("BACKEND ERROR");
  console.error("========================================");
  console.error("Message:", err.message);
  console.error("Name:", err.name);
  console.error("Stack:", err.stack);
  console.error("========================================");

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",

    // TEMPORARY DEBUG INFORMATION
    debug: {
      name: err.name,
      message: err.message,
      path: req.originalUrl,
      method: req.method,
    },
  });
};

module.exports = errorMiddleware;
