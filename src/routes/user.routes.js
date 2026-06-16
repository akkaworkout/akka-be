const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
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
router.get("/me", authMiddleware, userController.getMe);

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
  userController.updateMe
);

module.exports = router;