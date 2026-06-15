const db = require("../config/db");

const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
};

const findByNickname = async (nickname) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE nickname = ? LIMIT 1",
    [nickname]
  );

  return rows[0] || null;
};

const createUser = async ({
  email,
  passwordHash,
  nickname,
  profile,
  target_budget,
  target_exercise_count,
}) => {
  const [result] = await db.query(
    `
    INSERT INTO users (
      email,
      password_hash,
      nickname,
      profile_image_url,
      budget_goal,
      exercise_goal
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      email,
      passwordHash,
      nickname,
      profile,
      target_budget,
      target_exercise_count,
    ]
  );

  return result.insertId;
};

module.exports = {
  findByEmail,
  findByNickname,
  createUser,
};