const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization 헤더 없음
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "토큰이 없습니다",
    });
  }

  // Bearer 토큰 형식 체크
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "토큰 형식이 올바르지 않습니다",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다",
    });
  }
};

module.exports = authMiddleware;