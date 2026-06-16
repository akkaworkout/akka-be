const db = require("../config/db");

// ===========================
// 1) KPI 데이터
// ===========================

const getTotalExerciseCount = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count
     FROM exercise_records
     WHERE user_id = ?
       AND is_success = 1
       AND exercise_date BETWEEN ? AND ?`,
    [userId, startDate, endDate]
  );
  return Number(rows[0]?.count) || 0;
};

const getNoShowCount = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count
     FROM exercise_records
     WHERE user_id = ?
       AND is_success = 0
       AND exercise_date BETWEEN ? AND ?`,
    [userId, startDate, endDate]
  );
  return Number(rows[0]?.count) || 0;
};

const getNoShowLossAmount = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `SELECT IFNULL(SUM(exercise_amount), 0) AS total
     FROM exercise_records
     WHERE user_id = ?
       AND is_success = 0
       AND exercise_date BETWEEN ? AND ?`,
    [userId, startDate, endDate]
  );
  return Number(rows[0]?.total) || 0;
};

const getTotalExpenseAmount = async ({ userId, startDate, endDate }) => {
  const [ticketRows] = await db.query(
    `SELECT IFNULL(SUM(total_amount), 0) AS total
     FROM tickets
     WHERE user_id = ?
       AND created_at BETWEEN ? AND ?`,
    [userId, startDate, endDate]
  );

  const [expenseRows] = await db.query(
    `SELECT IFNULL(SUM(amount), 0) AS total
     FROM expenses
     WHERE user_id = ?
       AND expense_date BETWEEN ? AND ?`,
    [userId, startDate, endDate]
  );

  return Number(ticketRows[0]?.total || 0) + Number(expenseRows[0]?.total || 0);
};

// ===========================
// 2) Goal 데이터
// ===========================

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
    `SELECT IFNULL(SUM(target_count), 0) AS target
     FROM tickets
     WHERE user_id = ?
       AND exercise_type = ?
       AND start_date <= ?
       AND end_date >= ?`,
    [userId, exerciseType, endDate, startDate]
  );
  return Number(rows[0]?.target) || 0;
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
    `SELECT COUNT(*) AS count
     FROM exercise_records er
     JOIN tickets t ON t.id = er.ticket_id
     WHERE er.user_id = ?
       AND er.is_success = 1
       AND t.exercise_type = ?
       AND er.exercise_date BETWEEN ? AND ?`,
    [userId, exerciseType, startDate, endDate]
  );
  return Number(rows[0]?.count) || 0;
};

// ===========================
// 3) Charts 데이터
// ===========================

/**
 * 요일별 운동 횟수
 * MySQL DAYOFWEEK: 1=일 ... 7=토
 * 변환: ((DAYOFWEEK + 5) % 7) → 0=월 ... 6=일
 */
const getExerciseByDayOfWeek = async ({ userId, startDate, endDate }) => {
  const DOW_EXPR = `((DAYOFWEEK(exercise_date) + 5) % 7)`;
  const [rows] = await db.query(
    `SELECT ${DOW_EXPR} AS dow, COUNT(*) AS cnt
     FROM exercise_records
     WHERE user_id = ?
       AND is_success = 1
       AND exercise_date BETWEEN ? AND ?
     GROUP BY dow`,
    [userId, startDate, endDate]
  );

  const result = Array(7).fill(0);
  rows.forEach((r) => {
    const dow = Number(r.dow);
    if (dow >= 0 && dow <= 6) result[dow] = Number(r.cnt);
  });
  return result;
};

/**
 * 요일별 지출액
 */
const getExpenseByDayOfWeek = async ({ userId, startDate, endDate }) => {
  const DOW_EXPR = `((DAYOFWEEK(expense_date) + 5) % 7)`;
  const [rows] = await db.query(
    `SELECT ${DOW_EXPR} AS dow, IFNULL(SUM(amount), 0) AS sum_amount
     FROM expenses
     WHERE user_id = ?
       AND expense_date BETWEEN ? AND ?
     GROUP BY dow`,
    [userId, startDate, endDate]
  );

  const result = Array(7).fill(0);
  rows.forEach((r) => {
    const dow = Number(r.dow);
    if (dow >= 0 && dow <= 6) result[dow] = Number(r.sum_amount);
  });
  return result;
};

// ===========================
// 4) Breakdown 데이터
// ===========================

/**
 * 운동 유형별 성공 횟수
 */
const getExerciseBreakdown = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `SELECT t.exercise_type AS label, COUNT(*) AS count
     FROM exercise_records er
     JOIN tickets t ON t.id = er.ticket_id
     WHERE er.user_id = ?
       AND er.is_success = 1
       AND er.exercise_date BETWEEN ? AND ?
     GROUP BY t.exercise_type
     ORDER BY count DESC`,
    [userId, startDate, endDate]
  );
  return rows.map((r) => ({ label: r.label, count: Number(r.count) }));
};

/**
 * 운동 유형별 미참석
 */
const getNoShowBreakdown = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `SELECT t.exercise_type AS label, COUNT(*) AS count
     FROM exercise_records er
     JOIN tickets t ON t.id = er.ticket_id
     WHERE er.user_id = ?
       AND er.is_success = 0
       AND er.exercise_date BETWEEN ? AND ?
     GROUP BY t.exercise_type
     ORDER BY count DESC`,
    [userId, startDate, endDate]
  );
  return rows.map((r) => ({ label: r.label, count: Number(r.count) }));
};

/**
 * 실패 사유 메모
 */
const getFailureMemos = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `SELECT 
       DATE_FORMAT(er.exercise_date, '%m/%d') AS date,
       t.exercise_type AS category,
       er.failure_reason AS reason
     FROM exercise_records er
     JOIN tickets t ON t.id = er.ticket_id
     WHERE er.user_id = ?
       AND er.is_success = 0
       AND er.failure_reason IS NOT NULL
       AND er.exercise_date BETWEEN ? AND ?
     ORDER BY er.exercise_date DESC`,
    [userId, startDate, endDate]
  );
  return rows || [];
};

/**
 * 지출 카테고리별 분석
 * - 운동비(tickets): created_at 기준
 * - 기타비용(expenses): category별
 */
const getExpenseBreakdown = async ({ userId, startDate, endDate }) => {
  const [rows] = await db.query(
    `SELECT label, SUM(amount) AS amount
     FROM (
       SELECT '운동비' AS label, SUM(total_amount) AS amount
       FROM tickets
       WHERE user_id = ?
         AND created_at BETWEEN ? AND ?

       UNION ALL

       SELECT category AS label, SUM(amount) AS amount
       FROM expenses
       WHERE user_id = ?
         AND expense_date BETWEEN ? AND ?
       GROUP BY category
     ) AS combined
     GROUP BY label
     ORDER BY amount DESC`,
    [userId, startDate, endDate, userId, startDate, endDate]
  );
  return rows.map((r) => ({ label: r.label, amount: Number(r.amount) }));
};

// ===========================
// Exports
// ===========================

module.exports = {
  // KPI
  getTotalExerciseCount,
  getNoShowCount,
  getNoShowLossAmount,
  getTotalExpenseAmount,

  // Goal
  getTargetCountByExerciseType,
  getSuccessCountByExerciseType,

  // Charts
  getExerciseByDayOfWeek,
  getExpenseByDayOfWeek,

  // Breakdown
  getExerciseBreakdown,
  getNoShowBreakdown,
  getFailureMemos,
  getExpenseBreakdown,
};