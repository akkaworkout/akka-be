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
 *               - total_amount
 *             properties:
 *               exercise_type:
 *                 type: string
 *                 example: 발레
 *               color_code:
 *                 type: string
 *                 example: "#FFE6CC"
 *               ticket_type:
 *                 type: string
 *                 enum: [COUNT, PERIOD]
 *                 example: COUNT
 *               target_count:
 *                 type: integer
 *                 example: 24
 *               total_amount:
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
 * /tickets/active:
 *   get:
 *     summary: 진행 중인 이용권 조회
 *     description: |
 *       현재 ACTIVE 상태인 이용권 목록을 반환합니다.
 *       운동 기록 작성 및 분석 페이지에서 선택용으로 사용됩니다.
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 진행 중인 이용권 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ticket_id:
 *                     type: integer
 *                     example: 3
 *                   color_code:
 *                     type: string
 *                     example: "#FFE6CC"
 *                   exercise_type:
 *                     type: string
 *                     example: 발레
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 만료)
 *       500:
 *         description: 서버 내부 오류
 */
router.get('/active', authMiddleware, ticketController.getActiveTickets)

/**
 * @swagger
 * /tickets/{ticketId}/summary:
 *   get:
 *     summary: 이용권 요약 정보 조회
 *     description: 선택한 이용권의 잔여 횟수, 사용 횟수, 회당 금액을 반환
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 이용권 ID
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             example:
 *               remainingCount: 24
 *               usedCount: 15
 *               amountPerSession: 20000
 *       404:
 *         description: 이용권 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:ticketId/summary', authMiddleware, ticketController.getTicketSummary);

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
 *     description: |
 *       이용권을 종료 처리합니다.
 *       
 *       - status는 서버에서 자동으로 ENDED로 변경됩니다.
 *       - end_reason은 반드시 입력해야 합니다.
 *       - 이용권 종료는 총 완료/기간만료/환불/기타로 이루어져 있습니다. [COMPLETED, EXPIRED, REFUNDED, ETC]
 *       - REFUNDED일 경우에만 refund_amount(환불금액)를 작성합니다.
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 종료할 이용권 ID
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
 *                 description: 종료 사유
 *               refund_amount:
 *                 type: integer
 *                 nullable: true
 *                 example: 200000
 *                 description: 환불 금액 (REFUNDED일 때만 사용)
 *     responses:
 *       200:
 *         description: 종료 성공
 */
router.patch('/:ticketId/end', authMiddleware, ticketController.endTicket)

module.exports = router