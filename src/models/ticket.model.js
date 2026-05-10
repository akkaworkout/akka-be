const db = require('../config/db')

const createTicket = async (ticketData) => {
    const {
        user_id,
        exercise_type,
        color_code,
        ticket_type,
        target_count,
        remaining_count,
        total_amount,
        refund_amount,
        status,
        end_reason,
        start_date,
        end_date
    } = ticketData

    const query = `
    INSERT INTO tickets
    (user_id, exercise_type, color_code, ticket_type,
     target_count, remaining_count, total_amount,
     refund_amount, status, end_reason, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

    const values = [
        user_id,
        exercise_type,
        color_code,
        ticket_type,
        target_count,
        remaining_count,
        total_amount,
        refund_amount,
        status,
        end_reason,
        start_date,
        end_date
    ]

    const [result] = await db.execute(query, values)
    return result.insertId
}

const findByUserId = async (userId) => {
    const query = `
    SELECT *
    FROM tickets
    WHERE user_id = ?
    ORDER BY created_at DESC
  `
    const [rows] = await db.execute(query, [userId])
    return rows
}

const findById = async (ticketId) => {
    const query = `
    SELECT *
    FROM tickets
    WHERE id = ?
    LIMIT 1
  `
    const [rows] = await db.execute(query, [ticketId])
    return rows[0]
}

const findActiveByUserId = async (userId) => {
    const query = `
        SELECT id, color_code, exercise_type
        FROM tickets
        WHERE user_id = ?
        AND status = 'ACTIVE'
        ORDER BY created_at DESC
    `

    const [rows] = await db.execute(query, [userId])
    return rows
}

const deleteTicket = async (ticketId) => {
    const query = `
    DELETE FROM tickets
    WHERE id = ?
  `
    await db.execute(query, [ticketId])
}

const updateStatus = async (ticketId, status, endReason, refundAmount, forfeitedAmount = 0) => {
    const query = `
    UPDATE tickets
    SET status = ?, end_reason = ?, refund_amount = ?, forfeited_amount = ?, remaining_count = 0
    WHERE id = ?
  `
    await db.execute(query, [status, endReason, refundAmount, forfeitedAmount, ticketId])
}

module.exports = {
    createTicket,
    findByUserId,
    findById,
    findActiveByUserId,
    deleteTicket,
    updateStatus
}