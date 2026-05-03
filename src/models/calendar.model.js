const db = require("../config/db");

// 월 전체 기록 조회 (운동 + 지출)
const findMonthlyRecords = async (userId, year, month) => {
  const [rows] = await db.query(
    `
    SELECT * FROM (

      SELECT 
        DATE(er.exercise_date) AS date,
        t.exercise_type AS name,
        er.color_code,
        'exercise' AS type
      FROM exercise_records er
      LEFT JOIN tickets t
        ON er.ticket_id = t.id
      WHERE er.user_id = ?
        AND YEAR(er.exercise_date) = ?
        AND MONTH(er.exercise_date) = ?

      UNION ALL

      SELECT
        DATE(e.expense_date) AS date,
        e.item_name AS name,
        e.color_code,
        'expenses' AS type
      FROM expenses e
      WHERE e.user_id = ?
        AND YEAR(e.expense_date) = ?
        AND MONTH(e.expense_date) = ?

    ) AS calendar_records
    ORDER BY date ASC
    `,
    [
      userId, year, month,
      userId, year, month
    ]
  );

  return rows;
};

// 특정 날짜 운동 기록 조회
const findExerciseByDate = async (userId, start, end) => {
  const [rows] = await db.query(
    `
    SELECT 
      er.id,
      er.is_success,
      er.memo,
      er.exercise_amount,
      er.color_code,
      er.image_url,
      er.created_at,
      t.exercise_type
    FROM exercise_records er
    LEFT JOIN tickets t
      ON er.ticket_id = t.id
    WHERE er.user_id = ?
      AND er.exercise_date >= ?
      AND er.exercise_date < ?
    ORDER BY er.created_at ASC
    `,
    [userId, start, end]
  );

  return rows;
};

// 특정 날짜 지출 조회 (expense)
const findExpenseByDate = async (userId, start, end) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      category,
      item_name,
      amount,
      color_code,
      expense_date
    FROM expenses
    WHERE user_id = ?
      AND expense_date >= ?
      AND expense_date < ?
    ORDER BY expense_date ASC
    `,
    [userId, start, end]
  );

  return rows;
};

// 특정 날짜 이용권 조회
const findTicketByDate = async (userId, date) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      exercise_type,
      color_code,
      created_at
    FROM tickets
    WHERE user_id = ?
    AND DATE(CONVERT_TZ(created_at,'+00:00','+09:00')) = ?
    ORDER BY created_at ASC
    `,
    [userId, date]
  );

  return rows;
};

/* 월 요약(summary) */
const findMonthlyTotalAmount = async (userId, year, month) => {
  const [[exercise]] = await db.query(
    `
    SELECT IFNULL(SUM(exercise_amount), 0) AS total
    FROM exercise_records
    WHERE user_id = ?
      AND YEAR(exercise_date) = ?
      AND MONTH(exercise_date) = ?
    `,
    [userId, year, month]
  );

  const [[expense]] = await db.query(
    `
    SELECT IFNULL(SUM(amount), 0) AS total
    FROM expenses
    WHERE user_id = ?
      AND YEAR(expense_date) = ?
      AND MONTH(expense_date) = ?
    `,
    [userId, year, month]
  );

  return Number(exercise.total) + Number(expense.total);
};

const findMonthlyFailAmount = async (userId, year, month) => {
  const [rows] = await db.query(
    `
    SELECT 
      t.total_amount,
      t.target_count
    FROM exercise_records er
    JOIN tickets t
      ON er.ticket_id = t.id
    WHERE er.user_id = ?
      AND er.is_success = 0
      AND YEAR(er.exercise_date) = ?
      AND MONTH(er.exercise_date) = ?
    `,
    [userId, year, month]
  );

  let totalFailAmount = 0;

  for (const row of rows) {
    if (row.target_count && row.total_amount) {
      totalFailAmount += row.total_amount / row.target_count;
    }
  }

  return totalFailAmount;
};

const findMonthlySuccessCount = async (userId, year, month) => {
  const [[result]] = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM exercise_records
    WHERE user_id = ?
      AND is_success = 1
      AND YEAR(exercise_date) = ?
      AND MONTH(exercise_date) = ?
    `,
    [userId, year, month]
  );

  return result.count;
};

const findUserTargets = async (userId) => {
  const [[user]] = await db.query(
    `
    SELECT budget_goal, exercise_goal
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return user;
};

// 월 목표 조회
const findGoalsByMonth = async (userId, yearMonth) => {
  const [rows] = await db.query(
    `
    SELECT \`goal\`
    FROM \`calendar_goals\`
    WHERE \`user_id\` = ?
      AND \`target_month\` = ?
    ORDER BY \`id\` ASC
    `,
    [userId, yearMonth]
  );

  return rows;
};

// 월 목표 삭제
const deleteGoalsByMonth = async (userId, yearMonth) => {
  await db.query(
    `
    DELETE FROM \`calendar_goals\`
    WHERE \`user_id\` = ?
      AND \`target_month\` = ?
    `,
    [userId, yearMonth]
  );
};

// 월 목표 추가
const insertGoal = async (userId, yearMonth, goalText) => {
  await db.query(
    `
    INSERT INTO \`calendar_goals\`
      (\`user_id\`, \`target_month\`, \`goal\`)
    VALUES (?, ?, ?)
    `,
    [userId, yearMonth, goalText]
  );
};

module.exports = {
  findMonthlyRecords,
  findExerciseByDate,
  findExpenseByDate,
  findTicketByDate,
  findMonthlyTotalAmount,
  findMonthlyFailAmount,
  findMonthlySuccessCount,
  findUserTargets,
  findGoalsByMonth,
  deleteGoalsByMonth,
  insertGoal,
};