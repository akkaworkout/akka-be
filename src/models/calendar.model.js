const db = require("../config/db");

// 월 전체 기록 조회 (운동 + 지출)
const findMonthlyRecords = async (userId, year, month) => {
  const [rows] = await db.query(
    `
    SELECT * FROM (

      SELECT 
        DATE(er.exercise_date) AS date,
        t.exercise_type AS name,
        er.color,
        'exercise' AS type
      FROM exercise_record er
      LEFT JOIN ticket t
        ON er.ticket_id = t.ticket_id
      WHERE er.user_id = ?
        AND YEAR(er.exercise_date) = ?
        AND MONTH(er.exercise_date) = ?

      UNION ALL

      SELECT
        DATE(e.expense_date) AS date,
        e.title AS name,
        e.color,
        'expense' AS type
      FROM expense e
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
      er.record_id AS id,
      er.success,
      er.memo,
      er.cost,
      er.color,
      er.image_url,
      er.created_at,
      t.exercise_type
    FROM exercise_record er
    LEFT JOIN ticket t
      ON er.ticket_id = t.ticket_id
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
      expense_id AS id,
      category,
      title,
      amount,
      color,
      expense_date
    FROM expense
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
      ticket_id AS id,
      exercise_type,
      color,
      created_at
    FROM ticket
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
    SELECT IFNULL(SUM(cost), 0) AS total
    FROM exercise_record
    WHERE user_id = ?
      AND YEAR(exercise_date) = ?
      AND MONTH(exercise_date) = ?
    `,
    [userId, year, month]
  );

  const [[expense]] = await db.query(
    `
    SELECT IFNULL(SUM(amount), 0) AS total
    FROM expense
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
      t.total_price,
      t.target_count
    FROM exercise_record er
    JOIN ticket t
      ON er.ticket_id = t.ticket_id
    WHERE er.user_id = ?
      AND er.success = 0
      AND YEAR(er.exercise_date) = ?
      AND MONTH(er.exercise_date) = ?
    `,
    [userId, year, month]
  );

  let totalFailAmount = 0;

  for (const row of rows) {
    if (row.target_count && row.total_price) {
      totalFailAmount += row.total_price / row.target_count;
    }
  }

  return totalFailAmount;
};

const findMonthlySuccessCount = async (userId, year, month) => {
  const [[result]] = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM exercise_record
    WHERE user_id = ?
      AND success = 1
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
    SELECT target_budget, target_exercise_count
    FROM users
    WHERE user_id = ?
    `,
    [userId]
  );

  return user;
};

// 월 목표 조회
const findGoalsByMonth = async (userId, yearMonth) => {
  const [rows] = await db.query(
    `
    SELECT \`goal_text\`
    FROM \`calendar_goal\`
    WHERE \`user_id\` = ?
      AND \`year_month\` = ?
    ORDER BY \`calendar_goal_id\` ASC
    `,
    [userId, yearMonth]
  );

  return rows;
};

// 월 목표 삭제
const deleteGoalsByMonth = async (userId, yearMonth) => {
  await db.query(
    `
    DELETE FROM \`calendar_goal\`
    WHERE \`user_id\` = ?
      AND \`year_month\` = ?
    `,
    [userId, yearMonth]
  );
};

// 월 목표 추가
const insertGoal = async (userId, yearMonth, goalText) => {
  await db.query(
    `
    INSERT INTO \`calendar_goal\`
      (\`user_id\`, \`year_month\`, \`goal_text\`)
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