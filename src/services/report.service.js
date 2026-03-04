const reportModel = require("../models/report.model");

const pad2 = (n) => String(n).padStart(2, "0");
const formatDate = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// 월간 리포트 조회
const getMonthlyReport = async ({ userId, year, month, exerciseType }) => {
  const startDate = `${year}-${pad2(month)}-01`;
  const endDate = formatDate(new Date(year, month, 0));

  const totalExerciseCount = await reportModel.getTotalExerciseCount({
    userId,
    startDate,
    endDate,
  });

  const noShowCount = await reportModel.getNoShowCount({
    userId,
    startDate,
    endDate,
  });

  const noshowLossAmount = await reportModel.getNoShowLossAmount({
    userId,
    startDate,
    endDate,
  });

  const totalExpenseAmount = await reportModel.getTotalExpenseAmount({
    userId,
    startDate,
    endDate,
  });

  let goal = {
    exerciseType: exerciseType || null,
    targetCount: 0,
    successCount: 0,
    exerciseAchievementRate: 0,
    targetBudget: 0,
  };

  if (exerciseType) {
    const targetCount = await reportModel.getTargetCountByExerciseType({
      userId,
      exerciseType,
      startDate,
      endDate,
    });

    const successCount = await reportModel.getSuccessCountByExerciseType({
      userId,
      exerciseType,
      startDate,
      endDate,
    });

    const rate =
      targetCount > 0 ? Math.round((successCount / targetCount) * 100) : 0;

    goal = {
      ...goal,
      targetCount,
      successCount,
      exerciseAchievementRate: rate,
    };
  }

  return {
    period: { year, month },
    kpi: {
      totalExerciseCount,
      noShowCount,
      noshowLossAmount,
      totalExpenseAmount,
    },
    goal,
    charts: {},
    summary: {},
  };
};

module.exports = {
  getMonthlyReport,
};