const db = require("../config/db");

// 월 시작/끝 범위
const getMonthRange = (year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
};

// MySQL DAYOFWEEK: 1=일 ... 7=토
// 우리가 원하는 배열: 월(0)~일(6)
const DOW_EXPR = (col) => `((DAYOFWEEK(${col}) + 5) % 7)`;

const getMonthlyReport = async ({ userId, year, month, exerciseType }) => {
  const { start, end } = getMonthRange(year, month);

  const EXERCISE_DATE_COL = "er.exercise_date";
  const EXPENSE_DATE_COL = "e.expense_date";
  const TICKET_DATE_COL = "t.created_at";

  // ---------------------------
  // 1) KPI
  // ---------------------------
  const [kpiRows] = await db.query(
    `
    SELECT
      SUM(CASE WHEN er.success = 1 THEN 1 ELSE 0 END) AS totalExerciseCount,
      SUM(CASE WHEN er.success = 0 THEN 1 ELSE 0 END) AS noShowCount,
      COALESCE(SUM(CASE WHEN er.success = 0 THEN er.cost ELSE 0 END), 0) AS noshowLossAmount
    FROM exercise_record er
    WHERE er.user_id = ?
      AND ${EXERCISE_DATE_COL} >= ?
      AND ${EXERCISE_DATE_COL} < ?
    `,
    [userId, start, end]
  );

  const kpi = {
    totalExerciseCount: Number(kpiRows?.[0]?.totalExerciseCount ?? 0),
    noShowCount: Number(kpiRows?.[0]?.noShowCount ?? 0),
    noshowLossAmount: Number(kpiRows?.[0]?.noshowLossAmount ?? 0),
    totalExpenseAmount: 0,
  };

  const [[ticketSumRow]] = await db.query(
    `
    SELECT COALESCE(SUM(t.total_price), 0) AS ticketSum
    FROM ticket t
    WHERE t.user_id = ?
      AND ${TICKET_DATE_COL} >= ?
      AND ${TICKET_DATE_COL} < ?
    `,
    [userId, start, end]
  );

  const [[expenseSumRow]] = await db.query(
    `
    SELECT COALESCE(SUM(e.amount), 0) AS expenseSum
    FROM expense e
    WHERE e.user_id = ?
      AND ${EXPENSE_DATE_COL} >= ?
      AND ${EXPENSE_DATE_COL} < ?
    `,
    [userId, start, end]
  );

  kpi.totalExpenseAmount =
    Number(ticketSumRow?.ticketSum ?? 0) + Number(expenseSumRow?.expenseSum ?? 0);

  // ---------------------------
  // 2) Goal
  // ---------------------------
  let goal = {
    exerciseType: exerciseType || "",
    targetCount: 0,
    successCount: 0,
    exerciseAchievementRate: 0,
    targetBudget: 0,
  };

  if (exerciseType) {
    const [[targetRow]] = await db.query(
      `
      SELECT COALESCE(SUM(t.target_count), 0) AS targetCount
      FROM ticket t
      WHERE t.user_id = ?
        AND t.exercise_type = ?
      `,
      [userId, exerciseType]
    );

    const [[successRow]] = await db.query(
      `
      SELECT COUNT(*) AS successCount
      FROM exercise_record er
      JOIN ticket t ON t.ticket_id = er.ticket_id
      WHERE er.user_id = ?
        AND er.success = 1
        AND ${EXERCISE_DATE_COL} >= ?
        AND ${EXERCISE_DATE_COL} < ?
        AND t.exercise_type = ?
      `,
      [userId, start, end, exerciseType]
    );

    const targetCount = Number(targetRow?.targetCount ?? 0);
    const successCount = Number(successRow?.successCount ?? 0);

    goal = {
      exerciseType,
      targetCount,
      successCount,
      exerciseAchievementRate:
        targetCount > 0 ? Math.round((successCount / targetCount) * 100) : 0,
      targetBudget: 0,
    };
  }

  // ---------------------------
  // 3) Charts
  // ---------------------------
  const exerciseByDow = Array(7).fill(0);
  const expenseByDow = Array(7).fill(0);

  const [exRows] = await db.query(
    `
    SELECT ${DOW_EXPR(EXERCISE_DATE_COL)} AS dow, COUNT(*) AS cnt
    FROM exercise_record er
    WHERE er.user_id = ?
      AND er.success = 1
      AND ${EXERCISE_DATE_COL} >= ?
      AND ${EXERCISE_DATE_COL} < ?
    GROUP BY dow
    `,
    [userId, start, end]
  );

  exRows.forEach((r) => {
    const dow = Number(r.dow);
    const cnt = Number(r.cnt) || 0;
    if (dow >= 0 && dow <= 6) exerciseByDow[dow] = cnt;
  });

  const [expRows] = await db.query(
    `
    SELECT ${DOW_EXPR(EXPENSE_DATE_COL)} AS dow, COALESCE(SUM(e.amount), 0) AS sum_amount
    FROM expense e
    WHERE e.user_id = ?
      AND ${EXPENSE_DATE_COL} >= ?
      AND ${EXPENSE_DATE_COL} < ?
    GROUP BY dow
    `,
    [userId, start, end]
  );

  expRows.forEach((r) => {
    const dow = Number(r.dow);
    const sum = Number(r.sum_amount) || 0;
    if (dow >= 0 && dow <= 6) expenseByDow[dow] = sum;
  });

  const charts = { exerciseByDow, expenseByDow };

  // ---------------------------
  // 4) Breakdown
  // ---------------------------
  const [exerciseRows] = await db.query(
    `
    SELECT t.exercise_type AS label, COUNT(*) AS count
    FROM exercise_record er
    JOIN ticket t ON t.ticket_id = er.ticket_id
    WHERE er.user_id = ?
      AND er.success = 1
      AND ${EXERCISE_DATE_COL} >= ?
      AND ${EXERCISE_DATE_COL} < ?
    GROUP BY t.exercise_type
    ORDER BY count DESC
    `,
    [userId, start, end]
  );

  const [noshowRows] = await db.query(
    `
    SELECT t.exercise_type AS label, COUNT(*) AS count
    FROM exercise_record er
    JOIN ticket t ON t.ticket_id = er.ticket_id
    WHERE er.user_id = ?
      AND er.success = 0
      AND ${EXERCISE_DATE_COL} >= ?
      AND ${EXERCISE_DATE_COL} < ?
    GROUP BY t.exercise_type
    ORDER BY count DESC
    `,
    [userId, start, end]
  );

  // 실패 메모 데이터
  const [memoRowsRaw] = await db.query(
    `
    SELECT 
      DATE_FORMAT(er.exercise_date,'%m/%d') AS date,
      t.exercise_type AS category,
      er.fail_reason AS reason
    FROM exercise_record er
    JOIN ticket t ON t.ticket_id = er.ticket_id
    WHERE er.user_id = ?
      AND er.success = 0
      AND er.fail_reason IS NOT NULL
      AND DATE(er.exercise_date) >= DATE(?)
      AND DATE(er.exercise_date) < DATE(?)
    ORDER BY er.exercise_date DESC
    `,
    [userId, start, end]
  );

  const memoRows = memoRowsRaw || [];

  const [expenseRows] = await db.query(
    `
    SELECT label, SUM(amount) AS amount
    FROM (
      SELECT 
        '운동비' AS label,
        SUM(t.total_price) AS amount
      FROM ticket t
      WHERE t.user_id = ?
        AND ${TICKET_DATE_COL} >= ?
        AND ${TICKET_DATE_COL} < ?

      UNION ALL

      SELECT 
        e.category AS label,
        SUM(e.amount) AS amount
      FROM expense e
      WHERE e.user_id = ?
        AND ${EXPENSE_DATE_COL} >= ?
        AND ${EXPENSE_DATE_COL} < ?
      GROUP BY e.category
    ) AS combined
    GROUP BY label
    ORDER BY amount DESC
    `,
    [userId, start, end, userId, start, end]
  );

  const breakdown = {
    exercise: exerciseRows.map((r) => ({
      label: r.label,
      count: Number(r.count),
    })),
    noshow: noshowRows.map((r) => ({
      label: r.label,
      count: Number(r.count),
    })),
    expense: expenseRows.map((r) => ({
      label: r.label,
      amount: Number(r.amount),
    })),
    failMemo: memoRows,
  };

  // ---------------------------
  // 5) Summary
  // ---------------------------
  const summary = {};

  console.log("SERVICE RESULT", {
    period: { year, month },
    kpi,
    goal,
    charts,
    breakdown,
    summary,
  });



  return {
    period: { year, month },
    kpi,
    goal,
    charts,
    breakdown,
    summary,
  };
};

module.exports = {
  getMonthlyReport,
};