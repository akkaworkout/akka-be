const express = require('express')
const router = express.Router()
const controller = require('../controllers/expense.controller')

/**
 * @swagger
 * /expense:
 *   post:
 *     summary: 기타비용(지출) 등록
 *     description: 사용자가 운동 관련 기타비용을 등록합니다.
 *     tags:
 *       - Expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - category
 *               - title
 *               - amount
 *               - expense_date
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               category:
 *                 type: string
 *                 example: 운동 식품
 *                 description: 운동 용품 | 운동 식품 | 기타
 *               title:
 *                 type: string
 *                 example: 단백질 쉐이크
 *               amount:
 *                 type: integer
 *                 example: 23000
 *               expense_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-05
 *     responses:
 *       201:
 *         description: 지출 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 지출이 등록되었습니다.
 *       400:
 *         description: 필수값 누락
 *       500:
 *         description: 서버 오류
 */
router.post('/', controller.createExpense)

module.exports = router