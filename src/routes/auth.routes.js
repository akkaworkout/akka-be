console.log("auth.routes loaded");

const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");


const upload = require("../middlewares/upload");
const refreshTokenMiddleware = require("../middlewares/refreshTokenMiddleware");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     description: 회원가입 성공 시 accessToken과 refreshToken을 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               profile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
router.post("/register", upload.single("profile"), controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 로그인 성공 시 accessToken과 refreshToken을 반환합니다.
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 로그인 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: 이메일 또는 비밀번호 누락
 *       401:
 *         description: 로그인 정보 불일치
 *       500:
 *         description: 서버 오류
 */
router.post("/login", controller.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 액세스 토큰 갱신
 *     description: 리프레시 토큰으로 새로운 액세스 토큰을 발급합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 토큰 갱신 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: 유효하지 않은 리프레시 토큰
 *       500:
 *         description: 서버 오류
 */
router.post("/refresh", refreshTokenMiddleware, controller.refresh); 

/**
 * @swagger
 * /auth/check-email:
 *   get:
 *     summary: 이메일 중복 확인
 *     description: 이메일이 사용 가능한지 여부를 반환합니다.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: akka@naver.com
 *     responses:
 *       200:
 *         description: 이메일 사용 가능 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 available:
 *                   type: boolean
 *                   description: true면 사용 가능, false면 중복
 *                   example: false
 */
router.get("/check-email", controller.checkEmail);

/**
 * @swagger
 * /auth/check-nickname:
 *   get:
 *     summary: 닉네임 중복 확인
 *     description: 닉네임이 사용 가능한지 여부를 반환합니다.
 *     parameters:
 *       - in: query
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         example: 아카
 *     responses:
 *       200:
 *         description: 닉네임 사용 가능 여부
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 available:
 *                   type: boolean
 *                   description: true면 사용 가능, false면 중복
 *                   example: true
 */
router.get("/check-nickname", controller.checkNickname);

module.exports = router;