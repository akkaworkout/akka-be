const db = require("../config/db");

/** 이메일로 유저 조회 (로그인용: password 포함) */
const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT user_id, password FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

/** 닉네임으로 유저 조회 (중복확인용) */
const findByNickname = async (nickname) => {
  const [rows] = await db.query(
    "SELECT user_id FROM users WHERE nickname = ?",
    [nickname]
  );
  return rows[0];
};

/** 유저 생성 (회원가입: 목표예산/목표횟수 포함) */
const create = async ({
  email,
  password,
  nickname,
  profile_image = null,
  target_budget = 0,
  target_exercise_count = 0,
}) => {
  const sql = `
    INSERT INTO users (email, password, nickname, profile_image, target_budget, target_exercise_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    email,
    password,
    nickname,
    profile_image,
    target_budget,
    target_exercise_count,
  ]);
  return result.insertId;
};

/** 🔥 마이페이지 조회 */
const findById = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT 
      user_id,
      email,
      nickname,
      profile_image,
      target_budget,
      target_exercise_count,
      point
    FROM users
    WHERE user_id = ?
    `,
    [userId]
  );

  return rows[0];
};

module.exports = {
  findByEmail,
  findByNickname,
  create,
  findById,
};