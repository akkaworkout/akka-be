const errorHandler = (err, req, res, next) => {
  console.error(err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "서버 오류",
  });
};

module.exports = errorHandler;