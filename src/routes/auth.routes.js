const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     description: 회원가입 성공 시 JWT 토큰을 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nickname
 *             properties:
 *               email:
 *                 type: string
 *                 example: akka@naver.com
 *               password:
 *                 type: string
 *                 example: password123!
 *               nickname:
 *                 type: string
 *                 example: 아카
 *               target_budget:
 *                 type: number
 *                 example: 120000
 *               target_exercise_count:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       400:
 *         description: 필수값 누락 또는 형식 오류
 *       409:
 *         description: 이미 존재하는 이메일
 *       500:
 *         description: 서버 오류
 */
router.post("/register", controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 로그인 성공 시 JWT 토큰을 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: akka@naver.com
 *               password:
 *                 type: string
 *                 example: password123!
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       400:
 *         description: 이메일 또는 비밀번호 누락
 *       401:
 *         description: 로그인 정보 불일치
 *       500:
 *         description: 서버 오류
 */
router.post("/login", controller.login);

module.exports = router;