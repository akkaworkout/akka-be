const reportService = require("../services/report.service");

// 월간 리포트 조회
const getMonthlyReport = async (req, res) => {
  try {
    const { year, month, exerciseType } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "year와 month는 필수입니다.",
      });
    }

    const userId = req.user?.id; 

    const data = await reportService.getMonthlyReport({
      userId,
      year: Number(year),
      month: Number(month),
      exerciseType: exerciseType ? String(exerciseType) : null, 
    });

    res.status(200).json({
      success: true,
      message: "월간 리포트 조회 성공",
      data,
    });
  } catch (error) {
    console.error("❌ report error:", error);
    res.status(500).json({
      success: false,
      message: "월간 리포트 조회 실패",
    });
  }
};

module.exports = {
  getMonthlyReport,
};