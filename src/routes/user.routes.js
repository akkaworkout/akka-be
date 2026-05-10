const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userModel = require("../models/user.model");
const upload = require("../middlewares/upload");

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
    const userId = req.user.id || req.user.userId || req.user.user_id;

    const user = await userModel.findById(userId);

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
        userId: user.id, 
        email: user.email,
        nickname: user.nickname,
        profile_image_url: user.profile_image_url,
        target_budget: user.budget_goal, 
        target_exercise_count: user.exercise_goal, 
        points: user.points, 
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

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: 내 정보 수정
 *     description: 로그인한 사용자의 정보를 수정합니다. 원하는 필드만 선택적으로 수정 가능합니다.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 변경할 이메일 주소
 *                 example: akka@naver.com
 *               nickname:
 *                 type: string
 *                 description: 변경할 닉네임
 *                 example: 아카
 *               target_budget:
 *                 type: number
 *                 description: 목표 예산 (원 단위)
 *                 example: 100000
 *               target_exercise_count:
 *                 type: number
 *                 description: 목표 운동 횟수
 *                 example: 20
 *               password:
 *                 type: string
 *                 description: 새 비밀번호 (8자 이상 권장)
 *                 example: password123!
 *               profile:
 *                 type: string
 *                 description: 프로필 이미지 경로 또는 URL
 *                 example: /uploads/1712345678901-profile.png
 *           example:
 *             email: akka@naver.com
 *             password: password123!
 *             nickname: 아카
 *             target_budget: 100000
 *             target_exercise_count: 20
 *             profile: /uploads/1712345678901-profile.png
 *     responses:
 *       200:
 *         description: 내 정보 수정 성공
 *       400:
 *         description: 수정할 값이 없음 또는 형식 오류
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 유저 없음
 *       409:
 *         description: 이메일 중복
 *       500:
 *         description: 서버 오류
 */
router.patch(
  "/me",
  authMiddleware,
  upload.single("profile"),
  async (req, res) => {
    try {
      const userId = req.user.id || req.user.userId || req.user.user_id;

      const {
        email,
        nickname,
        target_budget,
        target_exercise_count,
        password,
        profile,
      } = req.body;

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "유저 없음",
        });
      }

      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(String(email))) {
          return res.status(400).json({
            success: false,
            message: "올바른 이메일 형식이 아닙니다.",
          });
        }

        if (String(email) !== user.email) {
          const exists = await userModel.findByEmail(String(email));
          if (exists) {
            return res.status(409).json({
              success: false,
              message: "이미 사용 중인 이메일입니다.",
            });
          }
        }
      }

      const updatedData = {};

      if (email !== undefined && String(email) !== user.email) {
        updatedData.email = String(email);
      }

      if (nickname !== undefined) updatedData.nickname = nickname;
      if (target_budget !== undefined)
        updatedData.target_budget = target_budget;
      if (target_exercise_count !== undefined)
        updatedData.target_exercise_count = target_exercise_count;

      const profilePath = req.file
        ? `/uploads/${req.file.filename}`
        : undefined;
      if (profilePath !== undefined)
        updatedData.profile_image_url = profilePath;

      if (password !== undefined) {
        const bcrypt = require("bcryptjs");
        const hashed = await bcrypt.hash(String(password), 10);
        updatedData.password_hash = hashed;
      }

      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "수정할 값이 없습니다.",
        });
      }

      await userModel.updateById(userId, updatedData);

      return res.status(200).json({
        success: true,
        message: "내 정보 수정 성공",
      });
    } catch (err) {
      console.error("❌ PATCH /users/me 오류:", err);
      return res.status(500).json({
        success: false,
        message: "서버 오류",
      });
    }
  },
);

module.exports = router;
