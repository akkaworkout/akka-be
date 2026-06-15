const ticketService = require('../services/ticket.service')

exports.createTicket = async (req, res, next) => {
    try {
        const userId = req.user.id

        const ticketId =
            await ticketService.createTicket(
                userId,
                req.body
            )

        return res.status(201).json({
            success: true,
            message: '이용권 등록 완료',
            ticket_id: ticketId
        })

    } catch (error) {
        next(error)
    }
}

exports.getMyTickets = async (req, res, next) => {
    try {
        const userId = req.user.id

        const tickets =
            await ticketService.getTicketsByUser(
                userId
            )

        return res.status(200).json({
            success: true,
            data: tickets
        })

    } catch (error) {
        next(error)
    }
}

exports.getTicketDetail = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { ticketId } = req.params

        const ticket =
            await ticketService.getTicketDetail(
                userId,
                ticketId
            )

        return res.status(200).json({
            success: true,
            data: ticket
        })

    } catch (error) {
        next(error)
    }
}

exports.getActiveTickets = async (req, res, next) => {
    try {
        const userId = req.user.id

        const tickets =
            await ticketService.getActiveTickets(
                userId
            )

        return res.status(200).json({
            success: true,
            data: tickets
        })

    } catch (error) {
        next(error)
    }
}

exports.deleteTicket = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { ticketId } = req.params

        await ticketService.deleteTicket(
            userId,
            ticketId
        )

        return res.status(200).json({
            success: true,
            message: '삭제 완료'
        })

    } catch (error) {
        next(error)
    }
}

exports.endTicket = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { ticketId } = req.params
        const {
            end_reason,
            refund_amount
        } = req.body

        await ticketService.endTicket(
            userId,
            ticketId,
            end_reason,
            refund_amount
        )

        return res.status(200).json({
            success: true,
            message: '이용권 종료 완료'
        })

    } catch (error) {
        next(error)
    }
}

exports.getTicketSummary = async (
    req,
    res,
    next
) => {
    try {
        const { ticketId } = req.params

        const data =
            await ticketService.getTicketSummary(
                ticketId
            )

        return res.status(200).json({
            success: true,
            data
        })

    } catch (error) {
        next(error)
    }
}