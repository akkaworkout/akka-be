const exerciseModel = require('../models/exerciseRecord.model')
const db = require('../config/db')

exports.createExerciseRecord = async (
    data,
    file,
    userId
) => {
    const conn = await db.getConnection()

    try {
        await conn.beginTransaction()

        const {
            exercise_date,
            success,
            memo,
            ticket_id,
            fail_reason
        } = data

        if (!ticket_id) {
            throw new Error('ticket_id 필요')
        }

        const ticket =
            await exerciseModel.findTicketForUpdate(
                conn,
                ticket_id
            )

        if (!ticket) {
            throw new Error('티켓 없음')
        }

        const successValue =
            success === 'true' || success === true
                ? 1
                : 0

        if (successValue === 1 && fail_reason) {
            throw new Error(
                '성공 기록에는 실패 이유를 작성할 수 없습니다'
            )
        }

        if (
            successValue === 1 &&
            ticket.remaining_count <= 0
        ) {
            throw new Error('잔여 횟수 없음')
        }

        const cost = Math.round(
            ticket.total_amount /
            ticket.target_count
        )

        const image_url = file
            ? `/uploads/${file.filename}`
            : null

        const recordData = {
            user_id: userId || 1,
            exercise_date,
            success: successValue,
            memo,
            image_url,
            cost,
            ticket_id,
            color: ticket.color_code,
            fail_reason:
                successValue === 0
                    ? fail_reason || null
                    : null
        }

        const result =
            await exerciseModel.createExerciseRecordWithConn(
                conn,
                recordData
            )

        if (successValue === 1) {
            await exerciseModel.decreaseRemainingCount(
                conn,
                ticket_id
            )
        }

        await conn.commit()

        return result

    } catch (err) {

        await conn.rollback()
        throw err

    } finally {

        conn.release()

    }
}

exports.updateExerciseRecord = async (
    record_id,
    data
) => {

    const record =
        await exerciseModel.findById(record_id)

    if (!record) {
        throw new Error('운동 기록 없음')
    }

    let successValue = record.success

    if (data.success !== undefined) {
        successValue =
            data.success === 'true' ||
            data.success === true
                ? 1
                : 0
    }

    if (successValue === 1 && data.fail_reason) {
        throw new Error(
            '성공 기록에는 실패 이유를 작성할 수 없습니다'
        )
    }

    const updateData = {
        ...data,
        success: successValue,
        fail_reason:
            successValue === 0
                ? data.fail_reason || null
                : null
    }

    return await exerciseModel.updateExerciseRecord(
        record_id,
        updateData
    )
}

exports.deleteExerciseRecord = async (
    record_id
) => {

    const record =
        await exerciseModel.findById(record_id)

    if (!record) {
        throw new Error('운동 기록 없음')
    }

    return await exerciseModel.deleteExerciseRecord(
        record_id
    )
}

exports.getExerciseRecord = async (
    record_id
) => {

    const record =
        await exerciseModel.getExerciseRecordById(
            record_id
        )

    if (!record) {
        throw new Error('운동 기록 없음')
    }

    return record
}

exports.getExerciseRecords = async (
    userId
) => {

    return await exerciseModel.getExerciseRecordsByUser(
        userId
    )
}