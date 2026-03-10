const exerciseModel = require('../models/exerciseRecord.model')
const ticketModel = require('../models/ticket.model')

exports.createExerciseRecord = async (data, file, userId) => {

    const {
        exercise_date,
        success,
        memo,
        ticket_id,
        fail_reason
    } = data

    if (!ticket_id) {
        throw { status: 400, message: 'ticket_id 필요' }
    }

    const ticket = await ticketModel.findById(ticket_id)

    if (!ticket) {
        throw { status: 404, message: '티켓 없음' }
    }

    const successValue =
        success === 'true' || success === true ? 1 : 0

    if (successValue === 1 && fail_reason) {
        throw {
            status: 400,
            message: '성공 기록에는 실패 이유를 작성할 수 없습니다'
        }
    }

    const cost = Math.round(ticket.total_price / ticket.target_count)
    const color = ticket.color
    const image_url = file ? `/uploads/${file.filename}` : null

    const recordData = {
        user_id: userId || 1,
        exercise_date,
        success: successValue,
        memo,
        image_url,
        cost,
        ticket_id,
        color,
        fail_reason: successValue === 0 ? fail_reason || null : null
    }

    const result = await exerciseModel.createExerciseRecord(recordData)

    return result
}

exports.updateExerciseRecord = async (record_id, data) => {

    const record = await exerciseModel.findById(record_id)

    if (!record) {
        throw { status: 404, message: '운동 기록 없음' }
    }

    let successValue = record.success

    if (data.success !== undefined) {
        successValue =
            data.success === 'true' || data.success === true ? 1 : 0
    }

    if (successValue === 1 && data.fail_reason) {
        throw {
            status: 400,
            message: '성공 기록에는 실패 이유를 작성할 수 없습니다'
        }
    }

    const updateData = {
        ...data,
        success: successValue,
        fail_reason: successValue === 0 ? data.fail_reason || null : null
    }

    const result = await exerciseModel.updateExerciseRecord(record_id, updateData)

    return result
}

exports.deleteExerciseRecord = async (record_id) => {

    const record = await exerciseModel.findById(record_id)

    if (!record) {
        throw { status: 404, message: '운동 기록 없음' }
    }

    const result = await exerciseModel.deleteExerciseRecord(record_id)

    return result
}

exports.getExerciseRecord = async (record_id) => {

    const record = await exerciseModel.getExerciseRecordById(record_id)

    if (!record) {
        throw { status: 404, message: '운동 기록 없음' }
    }

    return record
}

exports.getExerciseRecords = async (userId) => {

    const records = await exerciseModel.getExerciseRecordsByUser(userId)

    return records
}