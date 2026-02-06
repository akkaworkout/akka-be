const db = require("../config/db");

const create = async ({
  user_id,
  year_month,
  target_budget,
  target_exercise_count,
}) => {
  const sql = `
    INSERT INTO monthly_goal
    (\`user_id\`, \`year_month\`, \`target_budget\`, \`target_exercise_count\`)
    VALUES (?, ?, ?, ?)
  `;

  await db.query(sql, [
    user_id,
    year_month,
    target_budget,
    target_exercise_count,
  ]);
};

module.exports = { create };