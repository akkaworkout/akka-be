const express = require("express");
const router = express.Router();

const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: 월간 리포트 조회
 *     description: 연/월 기준으로 운동/지출/노쇼 통계를 조회합니다.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: exerciseType
 *         required: false
 *         schema:
 *           type: string
 *         example: 발레
 *     responses:
 *       200:
 *         description: 월간 리포트 조회 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.get("/", authMiddleware, reportController.getMonthlyReport);

module.exports = router;