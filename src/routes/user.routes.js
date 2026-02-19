const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userModel = require("../models/user.model"); // ✅ mysql2 모델

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 내 정보 조회
 *     description: 로그인한 사용자의 마이페이지 정보를 조회합니다.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 내 정보 조회 성공
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 만료)
 *       404:
 *         description: 유저 없음
 *       500:
 *         description: 서버 오류
 */

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // auth middleware에서 세팅된 값

    const user = await userModel.findById(userId); // ✅ 우리가 만든 함수 사용

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "유저 없음",
      });
    }

    return res.status(200).json({
      success: true,
      message: "내 정보 조회 성공",
      data: {
        userId: user.user_id,
        email: user.email,
        nickname: user.nickname,
        profile_image_url: user.profile_image, // DB컬럼 → 프론트용 매핑
        target_budget: user.target_budget,
        target_exercise_count: user.target_exercise_count,
        point: user.point,
      },
    });
  } catch (err) {
    console.error("❌ /users/me 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
});

module.exports = router;