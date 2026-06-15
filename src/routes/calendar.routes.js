const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendar.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /calendar:
 *   get:
 *     summary: 월 전체 운동 기록 조회 (달력용)
 *     description: 해당 연/월에 포함된 운동 기록을 반환합니다. 날짜별로 name(exercise_type 또는 title)과 color 정보를 제공합니다.
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *         description: 조회할 연도
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *         description: 조회할 월 (1-12)
 *     responses:
 *       200:
 *         description: 월 전체 기록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: 2026-02-23
 *                       name:
 *                         type: string
 *                         example: 발레
 *                       color:
 *                         type: string
 *                         example: "#FFE6CC"
 *       400:
 *         description: year 또는 month 누락, 혹은 month 범위 오류
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 만료)
 *       500:
 *         description: 서버 내부 오류
 */
router.get("/", authMiddleware, calendarController.getMonthlyRecords);

/**
 * @swagger
 * /calendar/goal:
 *   get:
 *     summary: 월 목표 조회
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 조회 성공
 *       400:
 *         description: year 또는 month 누락
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */
router.get("/goal", authMiddleware, calendarController.getMonthlyGoal);

/**
 * @swagger
 * /calendar/goal:
 *   patch:
 *     summary: 월 목표 수정
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - month
 *               - goals
 *             properties:
 *               year:
 *                 type: integer
 *                 example: 2026
 *               month:
 *                 type: integer
 *                 example: 1
 *               goals:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - 운동 12번 가기
 *                   - 지각하지 않기
 *                   - 체지방 -1kg
 *     responses:
 *       200:
 *         description: 수정 성공
 *       400:
 *         description: 필수 값 누락 또는 형식 오류
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */
router.patch("/goal", authMiddleware, calendarController.updateMonthlyGoal);

/**
 * @swagger
 * /calendar/summary:
 *   get:
 *     summary: 월 요약 정보 조회
 *     description: 이번 달 총 사용 금액(운동금액+운동지출), 목표 예산, 실패 금액, 성공 운동 횟수, 목표 운동 횟수를 반환합니다.
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: 월 요약 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAmount:
 *                       type: number
 *                       example: 70000
 *                     targetBudget:
 *                       type: number
 *                       example: 120000
 *                     failAmount:
 *                       type: number
 *                       example: 20000
 *                     exerciseCount:
 *                       type: number
 *                       example: 12
 *                     targetExerciseCount:
 *                       type: number
 *                       example: 30
 *       400:
 *         description: year 또는 month 누락/형식 오류
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 내부 오류
 */
router.get("/summary", authMiddleware, calendarController.getMonthlySummary);

/**
 * @swagger
 * /calendar/{date}:
 *   get:
 *     summary: 특정 날짜 기록 조회
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-01-16
 *     responses:
 *       200:
 *         description: 조회 성공
 *       400:
 *         description: 날짜 형식 오류
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 에러
 */
router.get("/:date", authMiddleware, calendarController.getByDate);

module.exports = router;