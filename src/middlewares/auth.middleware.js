const jwt = require("jsonwebtoken");

/**
 * 액세스 토큰 검증 미들웨어
 * - Authorization: Bearer <accessToken> 형식으로 요청
 * - 모든 보호된 리소스에 적용
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization 헤더 없음
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "토큰이 없습니다",
    });
  }

  // Bearer 형식 체크
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "토큰 형식이 올바르지 않습니다",
    });
  }

  const accessToken = parts[1]; //변수명 명확하게

  try {
    // accessToken만 검증 (JWT_SECRET 사용)
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    
    // payload 구조 통일
    req.user = {
      id: decoded.userId,
    };
    
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다",
    });
  }
};

module.exports = authMiddleware;