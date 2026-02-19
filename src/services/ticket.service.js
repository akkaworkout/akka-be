const ticketModel = require('../models/ticket.model')

const createTicket = async (userId, body) => {
    const {
        exercise_type,
        color,
        ticket_type,
        target_count,
        total_price,
        start_date,
        end_date
    } = body

    if (!exercise_type || !ticket_type || !total_price) {
        throw new Error('필수 값 누락')
    }

    if (!target_count) {
        throw new Error('target_count 필요')
    }

    if (!start_date || !end_date) {
        throw new Error('날짜 필요')
    }

    const ticketData = {
        user_id: userId,
        exercise_type,
        color,
        ticket_type,
        target_count,
        total_price,
        refund_price: 0,
        status: 'ACTIVE',
        end_reason: null,
        start_date,
        end_date
    }

    return await ticketModel.createTicket(ticketData)
}

const getTicketsByUser = async (userId) => {
    return await ticketModel.findByUserId(userId)
}

const getTicketDetail = async (userId, ticketId) => {
    const ticket = await ticketModel.findById(ticketId)

    if (!ticket) throw new Error('티켓 없음')
    if (ticket.user_id !== userId) throw new Error('권한 없음')

    return ticket
}

const deleteTicket = async (userId, ticketId) => {
    const ticket = await ticketModel.findById(ticketId)

    if (!ticket) throw new Error('티켓 없음')
    if (ticket.user_id !== userId) throw new Error('권한 없음')

    await ticketModel.deleteTicket(ticketId)
}

const endTicket = async (userId, ticketId, endReason, refundPrice) => {
    const ticket = await ticketModel.findById(ticketId)

    if (!ticket) throw new Error('티켓 없음')
    if (ticket.user_id !== userId) throw new Error('권한 없음')

    if (ticket.status !== 'ACTIVE') {
        throw new Error('이미 종료된 이용권')
    }

    if (!endReason) throw new Error('종료 사유 필요')

    if (endReason === 'REFUNDED') {
        if (!refundPrice || refundPrice <= 0) {
            throw new Error('환불 금액 필요')
        }
    }

    await ticketModel.updateStatus(
        ticketId,
        'ENDED',
        endReason,
        endReason === 'REFUNDED' ? refundPrice : 0
    )
}

module.exports = {
    createTicket,
    getTicketsByUser,
    getTicketDetail,
    deleteTicket,
    endTicket
}