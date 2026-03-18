const ticketService = require('../services/ticket.service')
const { calculateTicketSummary } = require('../utils/ticket.util');

/* 이용권 등록 */
exports.createTicket = async (req, res) => {
    try {
        const userId = req.user.id

        const ticketId = await ticketService.createTicket(userId, req.body)

        res.status(201).json({
            message: '이용권 등록 완료',
            ticket_id: ticketId
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

/* 내 이용권 전체 조회 */
exports.getMyTickets = async (req, res) => {
    try {
        const userId = req.user.id

        const tickets = await ticketService.getTicketsByUser(userId)

        res.status(200).json(tickets)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

/* 특정 이용권 조회 */
exports.getTicketDetail = async (req, res) => {
    try {
        const userId = req.user.id
        const { ticketId } = req.params

        const ticket = await ticketService.getTicketDetail(userId, ticketId)

        res.status(200).json(ticket)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

/* 진행 중인 이용권 목록 조회 */
exports.getActiveTickets = async (req, res) => {
    try {
        const userId = req.user.id

        const tickets = await ticketService.getActiveTickets(userId)

        res.status(200).json(tickets)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

/* 이용권 삭제 */
exports.deleteTicket = async (req, res) => {
    try {
        const userId = req.user.id
        const { ticketId } = req.params

        await ticketService.deleteTicket(userId, ticketId)

        res.status(200).json({
            message: '삭제 완료'
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

/* 이용권 종료 */
exports.endTicket = async (req, res) => {
    try {
        const userId = req.user.id
        const { ticketId } = req.params
        const { end_reason, refund_price } = req.body

        await ticketService.endTicket(userId, ticketId, end_reason, refund_price)

        res.status(200).json({ message: '이용권 종료 완료' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getTicketSummary = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const data = await ticketService.getTicketSummary(ticketId);

    if (!data) {
      return res.status(404).json({ message: '이용권 없음' });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};