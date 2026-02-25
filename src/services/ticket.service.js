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

    if (
        !exercise_type ||
        !ticket_type ||
        !target_count ||
        !total_price ||
        !start_date ||
        !end_date
    ) {
        throw new Error('필수 값 누락')
    }

    const ticketData = {
        user_id: userId,
        exercise_type,
        color,
        ticket_type,
        target_count,
        remaining_count: target_count,
        total_price,
        refund_price: 0,
        status: 'ACTIVE',
        end_reason: null,
        start_date,
        end_date
    }

    return await ticketModel.createTicket(ticketData)
}

const getTicketsByUser = async (userId, status, simple) => {
    const tickets = await ticketModel.findByUserId(userId)

    let filtered = tickets

    if (status) {
        filtered = filtered.filter(t => t.status === status)
    }

    if (simple === 'true') {
        return filtered.map(t => ({
            color: t.color,
            exercise_type: t.exercise_type
        }))
    }

    return filtered
}

const getActiveTickets = async (userId) => {
    return await ticketModel.findActiveByUserId(userId)
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
    getActiveTickets,
    getTicketDetail,
    deleteTicket,
    endTicket,
}