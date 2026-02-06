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

/** 유저 생성 */
const create = async ({ email, password, nickname }) => {
  const sql = `
    INSERT INTO users (email, password, nickname)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.query(sql, [email, password, nickname]);
  return result.insertId;
};

module.exports = {
  findByEmail,
  findByNickname,
  create,
};