const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendar.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /calendar/{date}:
 *   get:
 *     summary: 특정 날짜 기록 조회
 *     description: 로그인한 사용자의 특정 날짜 운동 및 지출 기록을 조회합니다.
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
 *         description: 조회할 날짜 (YYYY-MM-DD 형식)
 *     responses:
 *       200:
 *         description: 해당 날짜 기록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: 헬스
 *                   status:
 *                     type: string
 *                     example: 성공
 *                   amount:
 *                     type: integer
 *                     example: 7000
 *                   memo:
 *                     type: string
 *                     example: 하체 루틴 완료
 *                   created_at:
 *                     type: string
 *                     example: 2026-01-16T10:22:11.000Z
 *                   color:
 *                     type: string
 *                     example: rgb(213,211,255)
 *       401:
 *         description: 인증 실패
 */
router.get("/:date", authMiddleware, calendarController.getByDate);

module.exports = router;