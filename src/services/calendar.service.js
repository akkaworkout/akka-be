const calendarModel = require("../models/calendar.model");

// 월 전체 운동 기록 조회 (달력용)
const getMonthlyRecords = async (userId, year, month) => {
  if (!userId || !year || !month) {
    throw new Error("userId, year and month are required");
  }

  const rows = await calendarModel.findMonthlyRecords(
    userId,
    year,
    month
  );

  return rows.map((row) => ({
    date: row.date,
    name: row.name,
    color: row.color,
    type: row.type,
  }));
};

// 특정 날짜 기록 조회 (운동 + 지출 병합)
const getByDate = async (userId, date) => {
  if (!userId || !date) {
    throw new Error("userId and date are required");
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error("Invalid date format (YYYY-MM-DD required)");
  }

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start);
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
    expense_date: row.expense_date,
  }));

  const records = [...exercises, ...expenses];

  return {
    date,
    records,
  };
};

/* 월 요약(summary) */
const getMonthlySummary = async (userId, year, month) => {
  if (!userId || !year || !month) {
    throw new Error("userId, year and month are required");
  }

  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (
    Number.isNaN(parsedYear) ||
    Number.isNaN(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    throw new Error("Invalid year or month format");
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
    targetBudget: userTargets?.target_budget || 0,
    failAmount,
    exerciseCount,
    targetExerciseCount:
      userTargets?.target_exercise_count || 0,
  };
};

const getMonthlyGoal = async (userId, year, month) => {
  if (!userId || !year || !month) {
    throw new Error("userId, year and month are required");
  }

  const yearMonth = `${year}-${String(month).padStart(2, "0")}`;

  const rows = await calendarModel.findGoalsByMonth(userId, yearMonth);

  return rows.map((row) => row.goal_text);
};

const updateMonthlyGoal = async (userId, year, month, goals) => {
  if (!userId || !year || !month || !Array.isArray(goals)) {
    throw new Error("Invalid input for updating monthly goal");
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