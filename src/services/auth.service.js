const db = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/password");
const { createToken } = require("../utils/jwt");

const checkEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT 1 FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows.length === 0;
};

const checkNickname = async (nickname) => {
  const [rows] = await db.query(
    "SELECT 1 FROM users WHERE nickname = ? LIMIT 1",
    [nickname]
  );
  return rows.length === 0;
};

const register = async ({
  email,
  password,
  nickname,
  target_budget = null,
  target_exercise_count = null,
  profile = null, // ✅ 추가 (컨트롤러에서 넘어옴)
}) => {
  if (!email || !password || !nickname) {
    throw new Error("email, password, nickname are required");
  }

  // ✅ 중복 체크
  const [emailRows] = await db.query(
    "SELECT 1 FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  if (emailRows.length > 0) throw new Error("이미 존재하는 이메일");

  const [nickRows] = await db.query(
    "SELECT 1 FROM users WHERE nickname = ? LIMIT 1",
    [nickname]
  );
  if (nickRows.length > 0) throw new Error("이미 존재하는 닉네임");

  const hashed = await hashPassword(password);

  // ✅ profile 컬럼이 있으니 같이 저장
  const [result] = await db.query(
    "INSERT INTO users (email, password, nickname, profile) VALUES (?, ?, ?, ?)",
    [email, hashed, nickname, profile]
  );

  const userId = result.insertId;

  // 목표값 관련은 지금 정책대로 일단 미사용
  // if (target_budget !== null || target_exercise_count !== null) { ... }

  return createToken(userId);
};

const login = async (email, password) => {
  const [rows] = await db.query(
    "SELECT user_id, password FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (rows.length === 0) throw new Error("유저 없음");

  const user = rows[0];
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("비밀번호 틀림");

  return createToken(user.user_id);
};

module.exports = {
  checkEmail,
  checkNickname,
  register,
  login,
};