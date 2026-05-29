const jwt = require("jsonwebtoken");

/**
 * 리프레시 토큰 검증 미들웨어
 * - POST /auth/refresh 엔드포인트에서 사용
 * - 요청 본문에서 refreshToken 추출 및 검증
 */
const refreshTokenMiddleware = (req, res, next) => {
  const { refreshToken } = req.body; // body에서 refreshToken 추출

  // 리프레시 토큰 없음
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "리프레시 토큰이 없습니다",
    });
  }

  try {
    // refreshToken 검증 (JWT_REFRESH_SECRET 사용)
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // 요청 객체에 userId 저장 (다음 핸들러에서 사용 가능)
    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 리프레시 토큰입니다",
    });
  }
};

module.exports = refreshTokenMiddleware;