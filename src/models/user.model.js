const db = require("../config/db");

/** 이메일로 유저 조회 (로그인용: password 포함) */
const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id, password_hash FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

/** 닉네임으로 유저 조회 (중복확인용) */
const findByNickname = async (nickname) => {
  const [rows] = await db.query(
    "SELECT id FROM users WHERE nickname = ?",
    [nickname]
  );
  return rows[0];
};

/** 유저 생성 (회원가입: 목표예산/목표횟수 포함) */
const create = async ({
  email,
  password,
  nickname,
  profile = null,
  target_budget = 0,
  target_exercise_count = 0,
}) => {
  const sql = `
    INSERT INTO users (email, password_hash, nickname, profile_image_url, budget_goal, exercise_goal)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    email,
    password,
    nickname,
    profile,
    target_budget,
    target_exercise_count,
  ]);
  return result.insertId;
};

/** 마이페이지 조회 */
const findById = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT 
      id,
      email,
      nickname,
      profile_image_url,
      budget_goal,
      exercise_goal,
      points
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return rows[0];
};

/** 마이페이지 정보 수정 (필드 선택 업데이트) */
const updateById = async (userId, updates) => {
  const allowed = [
    "email",
    "nickname",
    "budget_goal",
    "exercise_goal",
    "password_hash",
    "profile_image_url",
  ];

  const keys = Object.keys(updates).filter(
    (k) => allowed.includes(k) && updates[k] !== undefined
  );

  if (keys.length === 0) return 0;

  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => updates[k]);

  const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
  const [result] = await db.query(sql, [...values, userId]);

  return result.affectedRows;
};

module.exports = {
  findByEmail,
  findByNickname,
  create,
  findById,
  updateById,
};