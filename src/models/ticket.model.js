const db = require('../config/db')

const createTicket = async (ticketData) => {
    const {
        user_id,
        exercise_type,
        color,
        ticket_type,
        target_count,
        total_price,
        refund_price,
        status,
        end_reason,
        start_date,
        end_date
    } = ticketData

    const query = `
    INSERT INTO ticket
    (user_id, exercise_type, color, ticket_type,
     target_count, total_price, refund_price,
     status, end_reason, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

    const values = [
        user_id,
        exercise_type,
        color,
        ticket_type,
        target_count,
        total_price,
        refund_price,
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
    FROM ticket
    WHERE user_id = ?
    ORDER BY created_at DESC
  `
    const [rows] = await db.execute(query, [userId])
    return rows
}

const findById = async (ticketId) => {
    const query = `
    SELECT *
    FROM ticket
    WHERE ticket_id = ?
    LIMIT 1
  `
    const [rows] = await db.execute(query, [ticketId])
    return rows[0]
}

const deleteTicket = async (ticketId) => {
    const query = `
    DELETE FROM ticket
    WHERE ticket_id = ?
  `
    await db.execute(query, [ticketId])
}

const updateStatus = async (ticketId, status, endReason, refundPrice) => {
    const query = `
    UPDATE ticket
    SET status = ?, end_reason = ?, refund_price = ?
    WHERE ticket_id = ?
  `
    await db.execute(query, [status, endReason, refundPrice, ticketId])
}

module.exports = {
    createTicket,
    findByUserId,
    findById,
    deleteTicket,
    updateStatus
}
