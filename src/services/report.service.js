const db = require("../config/db");

// 월 시작/끝 범위 만들기 (YYYY-MM-01 00:00:00 ~ 다음달 01 00:00:00)
const getMonthRange = (year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
};

// MySQL DAYOFWEEK: 1=일 ... 7=토
// 우리가 원하는 배열: 월(0)~일(6)
// 변환: ((DAYOFWEEK(date) + 5) % 7)
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

  // ticket + expense 합쳐서 totalExpenseAmount 만들기
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
  // 2) Goal (선택 운동 기준) ✅ ticket join 정석
  // ---------------------------
  let goal = {
    exerciseType: exerciseType || "",
    targetCount: 0,
    successCount: 0,
    exerciseAchievementRate: 0,
    targetBudget: 0,
  };

  if (exerciseType) {
    // 목표 횟수: ticket의 target_count 합
    const [[targetRow]] = await db.query(
      `
      SELECT COALESCE(SUM(t.target_count), 0) AS targetCount
      FROM ticket t
      WHERE t.user_id = ?
        AND t.exercise_type = ?
      `,
      [userId, exerciseType]
    );

    // 성공 횟수: exercise_record + ticket 조인해서 exercise_type 필터
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
  const exerciseByDow = Array(7).fill(0); // 월~일
  const expenseByDow = Array(7).fill(0); // 월~일

  // 운동: 성공 횟수 요일별
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

  // 지출: 금액 합계 요일별
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
  // 4) Summary
  // ---------------------------
  const summary = {};

  return {
    period: { year, month },
    kpi,
    goal,
    charts,
    summary,
  };
};

module.exports = {
  getMonthlyReport,
};