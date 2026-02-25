const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendar.controller");
const authMiddleware = require("../middlewares/auth.middleware");

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
 *       401:
 *         description: 인증 실패
 */
router.get("/:date", authMiddleware, calendarController.getByDate);

module.exports = router;