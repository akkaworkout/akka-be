const jwt = require("jsonwebtoken");

/**
 * 액세스 토큰 생성
 * - 유효기간: 1시간
 * - 보호된 리소스 접근에 사용
 */
const createAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

/**
 * 리프레시 토큰 생성
 * - 유효기간: 7일 (필요시 조정 가능: 14d, 30d, 1y 등)
 * - 액세스 토큰 갱신에 사용
 */
const createRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, // 다른 시크릿 권장, 없으면 같은 시크릿 사용
    { expiresIn: "7d" }
  );
};

module.exports = { createAccessToken, createRefreshToken };