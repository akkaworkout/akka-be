const db = require("../config/db");

const getByDate = async (userId, date) => {
  if (!userId || !date) {
    throw new Error("userId and date are required");
  }

  const [rows] = await db.query(
    `
    SELECT 
      record_id AS id,
      success,
      memo,
      cost,
      color,
      exercise_date AS date
    FROM exercise_record
    WHERE user_id = ? AND exercise_date = ?
    ORDER BY exercise_date ASC
    `,
    [userId, date]
  );

  const result = rows.map((row) => ({
    id: row.id,
    name: "운동",
    status: row.success ? "성공" : "실패",
    amount: row.cost,
    memo: row.memo,
    color: row.color,
  }));

  return result;
};

module.exports = {
  getByDate,
};