const express = require('express')
const router = express.Router()
const ticketController = require('../controllers/ticket.controller')
const authMiddleware = require('../middlewares/auth.middleware')

/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: 이용권 관리 API
 */

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: 이용권 등록
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exercise_type
 *               - ticket_type
 *               - total_price
 *             properties:
 *               exercise_type:
 *                 type: string
 *                 example: 발레
 *               color:
 *                 type: string
 *                 example: "#FFE6CC"
 *               ticket_type:
 *                 type: string
 *                 enum: [COUNT, PERIOD]
 *                 example: COUNT
 *               target_count:
 *                 type: integer
 *                 example: 24
 *               total_price:
 *                 type: integer
 *                 example: 480000
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-05
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-05
 *     responses:
 *       201:
 *         description: 이용권 등록 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post('/', authMiddleware, ticketController.createTicket)

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: 내 이용권 전체 조회
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 이용권 목록 반환
 */
router.get('/', authMiddleware, ticketController.getMyTickets)

/**
 * @swagger
 * /tickets/{ticketId}:
 *   get:
 *     summary: 특정 이용권 조회
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 이용권 상세 정보 반환
 *       404:
 *         description: 이용권 없음
 */
router.get('/:ticketId', authMiddleware, ticketController.getTicketDetail)

/**
 * @swagger
 * /tickets/{ticketId}:
 *   delete:
 *     summary: 이용권 삭제
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       404:
 *         description: 이용권 없음
 */
router.delete('/:ticketId', authMiddleware, ticketController.deleteTicket)

/**
 * @swagger
 * /tickets/{ticketId}/end:
 *   patch:
 *     summary: 이용권 종료
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - end_reason
 *             properties:
 *               end_reason:
 *                 type: string
 *                 enum: [COMPLETED, EXPIRED, REFUNDED, ETC]
 *                 example: COMPLETED
 *               refund_price:
 *                 type: integer
 *                 example: 200000
 *     responses:
 *       200:
 *         description: 종료 성공
 */
router.patch('/:ticketId/end', authMiddleware, ticketController.endTicket)

module.exports = router