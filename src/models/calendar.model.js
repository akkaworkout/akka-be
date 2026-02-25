const db = require("../config/db");

const findByDate = async (userId, start, end) => {
  const [rows] = await db.query(
    `
    SELECT 
      record_id AS id,
      success,
      memo,
      cost,
      color,
      created_at
    FROM exercise_record
    WHERE user_id = ?
      AND created_at >= ?
      AND created_at < ?
    ORDER BY created_at ASC
    `,
    [userId, start, end]
  );

  return rows;
};

module.exports = {
  findByDate,
};