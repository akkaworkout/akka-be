const db = require("../config/db");

const getTotalExerciseCount = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM exercise_record
    WHERE user_id = ?
      AND success = 1
      AND exercise_date BETWEEN ? AND ?
    `,
    [userId, startDate, endDate]
  );

  return Number(rows[0].count) || 0;
};

const getNoShowCount = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM exercise_record
    WHERE user_id = ?
      AND success = 0
      AND exercise_date BETWEEN ? AND ?
    `,
    [userId, startDate, endDate]
  );

  return Number(rows[0].count) || 0;
};

const getNoShowLossAmount = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `
    SELECT IFNULL(SUM(cost), 0) AS total
    FROM exercise_record
    WHERE user_id = ?
      AND success = 0
      AND exercise_date BETWEEN ? AND ?
    `,
    [userId, startDate, endDate]
  );

  return Number(rows[0].total) || 0;
};

const getTotalExpenseAmount = async ({ userId, startDate, endDate }) => {
  // 1) ticket: created_at 기준 (구매월)
  const [ticketRows] = await db.query(
    `
    SELECT IFNULL(SUM(total_price), 0) AS total
    FROM ticket
    WHERE user_id = ?
      AND created_at BETWEEN ? AND ?
    `,
    [userId, startDate, endDate]
  );

  // 2) expense: expense_date 기준
  const [expenseRows] = await db.query(
    `
    SELECT IFNULL(SUM(amount), 0) AS total
    FROM expense
    WHERE user_id = ?
      AND expense_date BETWEEN ? AND ?
    `,
    [userId, startDate, endDate]
  );

  return Number(ticketRows[0].total || 0) + Number(expenseRows[0].total || 0);
};

/**
 * 운동별 목표 횟수 (ticket.target_count)
 * - 해당 월에 "겹치는(유효한)" 티켓들의 target_count 합산
 *   start_date <= endDate AND end_date >= startDate
 */
const getTargetCountByExerciseType = async ({
  userId,
  exerciseType,
  startDate,
  endDate,
}) => {
  const [rows] = await db.query(
    `
    SELECT IFNULL(SUM(target_count), 0) AS target
    FROM ticket
    WHERE user_id = ?
      AND exercise_type = ?
      AND start_date <= ?
      AND end_date >= ?
    `,
    [userId, exerciseType, endDate, startDate]
  );

  return Number(rows[0].target) || 0;
};

/**
 * 운동별 성공 횟수
 * - exercise_record(ticket_id) -> ticket.exercise_type 조인
 * - 월 기준은 exercise_record.exercise_date
 */
const getSuccessCountByExerciseType = async ({
  userId,
  exerciseType,
  startDate,
  endDate,
}) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS count
    FROM exercise_record er
    JOIN ticket t ON t.ticket_id = er.ticket_id
    WHERE er.user_id = ?
      AND er.success = 1
      AND t.exercise_type = ?
      AND er.exercise_date BETWEEN ? AND ?
    `,
    [userId, exerciseType, startDate, endDate]
  );

  return Number(rows[0].count) || 0;
};

module.exports = {
  getTotalExerciseCount,
  getNoShowCount,
  getNoShowLossAmount,
  getTotalExpenseAmount,
  getTargetCountByExerciseType,
  getSuccessCountByExerciseType,
};