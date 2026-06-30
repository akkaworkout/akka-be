const ticketModel = require('../models/ticket.model')
const { calculateTicketSummary } = require('../utils/ticket.util');

const createTicket = async (userId, body) => {
    const {
        exercise_type,
        color_code,
        ticket_type,
        target_count,
        total_amount,
        start_date,
        end_date
    } = body

    if (
        !exercise_type ||
        !ticket_type ||
        !target_count ||
        !total_amount ||
        !start_date ||
        !end_date
    ) {
        throw new Error("필수 입력값이 누락되었습니다.");
    }

    const ticketData = {
        user_id: userId,
        exercise_type,
        color_code,
        ticket_type,
        target_count,
        remaining_count: target_count,
        total_amount,
        refund_amount: 0,
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
            color_code: t.color_code,
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

    if (!ticket) throw new Error("존재하지 않는 이용권입니다.");
    if (ticket.user_id !== userId) throw new Error("존재하지 않는 이용권입니다.");

    return ticket
}

const deleteTicket = async (userId, ticketId) => {
    const ticket = await ticketModel.findById(ticketId)

    if (!ticket) throw new Error("존재하지 않는 이용권입니다.");
    if (ticket.user_id !== userId) throw new Error("접근 권한이 없습니다.");

    await ticketModel.deleteTicket(ticketId)
}

const endTicket = async (userId, ticketId, endReason, refundAmount) => {
    const ticket = await ticketModel.findById(ticketId)

    if (!ticket) throw new Error("존재하지 않는 이용권입니다.");
    if (ticket.user_id !== userId) throw new Error("접근 권한이 없습니다.");

    if (ticket.status !== 'ACTIVE') {
        throw new Error("이미 종료된 이용권입니다.");
    }

    if (!endReason) throw new Error("종료 사유를 입력해주세요.");

    let forfeitedAmount  = 0

    if (endReason === 'REFUNDED') {
        if (!refundAmount || refundAmount <= 0) {
            throw new Error("환불 금액을 입력해주세요.");
        }
    } else if (endReason === 'EXPIRED') {
        forfeitedAmount = (ticket.total_amount / ticket.target_count) * ticket.remaining_count
    }

    await ticketModel.updateStatus(
        ticketId,
        'ENDED',
        endReason,
        refundAmount,
        forfeitedAmount
    )
}

const getTicketSummary = async (ticketId) => {
    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) return null;

    return calculateTicketSummary(ticket);
};

module.exports = {
    createTicket,
    getTicketsByUser,
    getActiveTickets,
    getTicketDetail,
    deleteTicket,
    endTicket,
    getTicketSummary
}