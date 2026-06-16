const reportService = require("../services/report.service");

// 월간 리포트 조회
const getMonthlyReport = async (req, res) => {
  try {
    const { year, month, exerciseType } = req.query;

    // 1) 입력값 검증
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "year와 month는 필수입니다.",
      });
    }

    // 2) 사용자 인증 확인
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
    }

    // 3) 서비스 호출
    const data = await reportService.getMonthlyReport({
      userId,
      year: Number(year),
      month: Number(month),
      exerciseType: exerciseType ? String(exerciseType) : null,
    });

    // 4) 응답
    return res.status(200).json({
      success: true,
      message: "월간 리포트 조회 성공",
      data,
    });
  } catch (error) {
    console.error("❌ report error:", error);
    return res.status(500).json({
      success: false,
      message: "월간 리포트 조회 실패",
    });
  }
};

module.exports = {
  getMonthlyReport,
};