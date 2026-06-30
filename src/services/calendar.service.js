const calendarModel = require("../models/calendar.model");

const toKSTDate = (date) => {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
};

// 월 전체 기록 조회 (달력 표시용)
const getMonthlyRecords = async (userId, year, month) => {
  if (!userId || !year || !month) {
    throw new Error("필수 입력값이 누락되었습니다.");
  }

  const rows = await calendarModel.findMonthlyRecords(
    userId,
    year,
    month
  );

  return rows.map((row) => ({
    date: toKSTDate(new Date(row.date)),
    name: row.name,
    color: row.color_code,
    type: row.type,
  }));
};

// 특정 날짜의 운동 + 지출 + 이용권 기록 조회
const getByDate = async (userId, date) => {
  if (!userId || !date) {
    throw new Error("필수 입력값이 누락되었습니다.");
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error("날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)");
  }

  const start = new Date(`${date}T00:00:00+09:00`);
  const end = new Date(`${date}T00:00:00+09:00`);
  end.setDate(end.getDate() + 1);

  const exerciseRows = await calendarModel.findExerciseByDate(
    userId,
    start,
    end
  );

  const exercises = exerciseRows.map((row) => ({
    type: "exercise",
    id: row.id,
    exercise_type: row.exercise_type,
    success: row.success,
    cost: row.cost,
    memo: row.memo,
    color: row.color,
    image_url: row.image_url,
    date: toKSTDate(new Date(row.created_at)),
    created_at: row.created_at,
  }));

  const expenseRows = await calendarModel.findExpenseByDate(
    userId,
    start,
    end
  );

  const expenses = expenseRows.map((row) => ({
    type: "expense",
    id: row.id,
    category: row.category,
    title: row.title,
    amount: row.amount,
    color: row.color,
    date: toKSTDate(new Date(row.expense_date)),
    expense_date: row.expense_date,
  }));

  const ticketRows = await calendarModel.findTicketByDate(
    userId,
    date
  );

  const tickets = ticketRows.map((row) => ({
    type: "ticket",
    id: row.id,
    exercise_type: row.exercise_type,
    color: row.color,
    date: toKSTDate(new Date(row.created_at)),
    created_at: row.created_at,
  }));

  const records = [...exercises, ...expenses, ...tickets];

  return {
    date,
    records,
  };
};

// 월 요약 정보 조회 (지출, 실패금액, 운동횟수)
const getMonthlySummary = async (userId, year, month) => {
  if (!userId || !year || !month) {
    throw new Error("필수 입력값이 누락되었습니다.");
  }

  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (
    Number.isNaN(parsedYear) ||
    Number.isNaN(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    throw new Error("연도 또는 월 형식이 올바르지 않습니다.");
  }

  const totalAmount = await calendarModel.findMonthlyTotalAmount(
    userId,
    parsedYear,
    parsedMonth
  );

  const failAmount = await calendarModel.findMonthlyFailAmount(
    userId,
    parsedYear,
    parsedMonth
  );

  const exerciseCount = await calendarModel.findMonthlySuccessCount(
    userId,
    parsedYear,
    parsedMonth
  );

  const userTargets = await calendarModel.findUserTargets(userId);

  return {
    totalAmount,
    targetBudget: userTargets?.budget_goal || 0,
    failAmount,
    exerciseCount,
    targetExerciseCount:
      userTargets?.exercise_goal || 0,
  };
};

// 월 목표 조회
const getMonthlyGoal = async (userId, year, month) => {
  if (!userId || !year || !month) {
    throw new Error("필수 입력값이 누락되었습니다.");
  }

  const yearMonth = `${year}-${String(month).padStart(2, "0")}`;

  const rows = await calendarModel.findGoalsByMonth(userId, yearMonth);

  return rows.map((row) => row.goal);
};

// 월 목표 수정
const updateMonthlyGoal = async (userId, year, month, goals) => {
  if (!userId || !year || !month || !Array.isArray(goals)) {
    throw new Error("요청 형식이 올바르지 않습니다.");
  }

  const yearMonth = `${year}-${String(month).padStart(2, "0")}`;

  await calendarModel.deleteGoalsByMonth(userId, yearMonth);

  for (const goal of goals) {
    if (goal && goal.trim() !== "") {
      await calendarModel.insertGoal(userId, yearMonth, goal);
    }
  }
};

module.exports = {
  getMonthlyRecords,
  getByDate,
  getMonthlySummary,
  getMonthlyGoal,
  updateMonthlyGoal,
};