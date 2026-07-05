const reportModel = require("../models/report.model");

// 월 시작/끝 범위
const getMonthRange = (year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return { start, end };
};

/**
 * 월별 리포트 조회
 * - reportModel에서 필요한 데이터 가져오기
 * - 비즈니스 로직(가공)만 담당
 */
const getMonthlyReport = async ({ userId, year, month, exerciseType }) => {
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

  const { start, end } = getMonthRange(parsedYear, parsedMonth);

  // ===========================
  // 1) KPI
  // ===========================
  const totalExerciseCount = await reportModel.getTotalExerciseCount({
    userId,
    startDate: start,
    endDate: end,
  });

  const noShowCount = await reportModel.getNoShowCount({
    userId,
    startDate: start,
    endDate: end,
  });

  const noshowLossAmount = await reportModel.getNoShowLossAmount({
    userId,
    startDate: start,
    endDate: end,
  });

  const totalExpenseAmount = await reportModel.getTotalExpenseAmount({
    userId,
    startDate: start,
    endDate: end,
  });

  const kpi = {
    totalExerciseCount,
    noShowCount,
    noshowLossAmount,
    totalExpenseAmount,
  };

  // ===========================
  // 2) Goal
  // ===========================
  let goal = {
    exerciseType: exerciseType || "",
    targetCount: 0,
    successCount: 0,
    exerciseAchievementRate: 0,
    targetBudget: 0,
  };

  if (exerciseType) {
    const targetCount = await reportModel.getTargetCountByExerciseType({
      userId,
      exerciseType,
      startDate: start,
      endDate: end,
    });

    const successCount = await reportModel.getSuccessCountByExerciseType({
      userId,
      exerciseType,
      startDate: start,
      endDate: end,
    });

    goal = {
      exerciseType,
      targetCount,
      successCount,
      exerciseAchievementRate:
        targetCount > 0 ? Math.round((successCount / targetCount) * 100) : 0,
      targetBudget: 0,
    };
  }

  // ===========================
  // 3) Charts
  // ===========================
  const exerciseByDow = await reportModel.getExerciseByDayOfWeek({
    userId,
    startDate: start,
    endDate: end,
  });

  const expenseByDow = await reportModel.getExpenseByDayOfWeek({
    userId,
    startDate: start,
    endDate: end,
  });

  const charts = { exerciseByDow, expenseByDow };

  // ===========================
  // 4) Breakdown
  // ===========================
  const exerciseBreakdown = await reportModel.getExerciseBreakdown({
    userId,
    startDate: start,
    endDate: end,
  });

  const noShowBreakdown = await reportModel.getNoShowBreakdown({
    userId,
    startDate: start,
    endDate: end,
  });

  const failMemos = await reportModel.getFailureMemos({
    userId,
    exerciseType,
    startDate: start,
    endDate: end,
  });

  const expenseBreakdown = await reportModel.getExpenseBreakdown({
    userId,
    startDate: start,
    endDate: end,
  });

  const breakdown = {
    exercise: exerciseBreakdown,
    noshow: noShowBreakdown,
    expense: expenseBreakdown,
    failMemo: failMemos,
  };

  // ===========================
  // 5) Summary (비어있음)
  // ===========================
  const summary = {};

  console.log("SERVICE RESULT", {
    period: { year: parsedYear, month: parsedMonth },
    kpi,
    goal,
    charts,
    breakdown,
    summary,
  });

  return {
    period: { year: parsedYear, month: parsedMonth },
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