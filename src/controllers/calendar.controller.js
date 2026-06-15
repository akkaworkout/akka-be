const calendarService = require("../services/calendar.service");

const validateYearMonth = (year, month) => {
  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (
    Number.isNaN(parsedYear) ||
    Number.isNaN(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    return false;
  }

  return true;
};

// 월 전체 운동 기록 조회 (달력용)
exports.getMonthlyRecords = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const parsedYear = Number(year);
    const parsedMonth = Number(month);
    
    const userId = req.user.id;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "year와 month는 필수입니다.",
      });
    }

    if (!validateYearMonth(year, month)) {
      return res.status(400).json({
        success: false,
        message: "year 또는 month 형식이 올바르지 않습니다.",
      });
    }

    const result = await calendarService.getMonthlyRecords(
      userId,
      parsedYear,
      parsedMonth
    );

    return res.status(200).json({
      success: true,
      data: result || [],
    });
  } catch (err) {
    next(err);
  }
};

// 특정 날짜 기록 조회
exports.getByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "날짜가 필요합니다.",
      });
    }

    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)",
      });
    }

    const result = await calendarService.getByDate(userId, date);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// 월 요약 조회
exports.getMonthlySummary = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const userId = req.user.id;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "year와 month는 필수입니다.",
      });
    }

    if (!validateYearMonth(year, month)) {
      return res.status(400).json({
        success: false,
        message: "year 또는 month 형식이 올바르지 않습니다.",
      });
    }

    const result = await calendarService.getMonthlySummary(
      userId,
      year,
      month
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// 월 목표 조회
exports.getMonthlyGoal = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const userId = req.user.id;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "year와 month는 필수입니다.",
      });
    }

    if (!validateYearMonth(year, month)) {
      return res.status(400).json({
        success: false,
        message: "year 또는 month 형식이 올바르지 않습니다.",
      });
    }

    const result = await calendarService.getMonthlyGoal(
      userId,
      year,
      month
    );

    return res.status(200).json({
      success: true,
      data: result || [],
    });
  } catch (err) {
    next(err);
  }
};

// 월 목표 수정
exports.updateMonthlyGoal = async (req, res, next) => {
  try {
    const { year, month, goals } = req.body;
    const userId = req.user.id;

    if (!year || !month || !Array.isArray(goals)) {
      return res.status(400).json({
        success: false,
        message: "year, month, goals 배열은 필수입니다.",
      });
    }

    if (!validateYearMonth(year, month)) {
      return res.status(400).json({
        success: false,
        message: "year 또는 month 형식이 올바르지 않습니다.",
      });
    }

    if (
      !goals.every(
        (goal) => typeof goal === "string"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "goals는 문자열 배열이어야 합니다.",
      });
    }

    await calendarService.updateMonthlyGoal(
      userId,
      year,
      month,
      goals
    );

    return res.status(200).json({
      success: true,
      message: "월 목표가 수정되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};