const exerciseModel = require('../models/exerciseRecord.model')
const ticketModel = require('../models/ticket.model')

exports.createExerciseRecord = async (req, res) => {
  try {
    const {
      exercise_date,
      success,
      memo,
      ticket_id,
      fail_reason
    } = req.body

    if (!ticket_id) {
      return res.status(400).json({ message: 'ticket_id 필요' })
    }

    const ticket = await ticketModel.findById(ticket_id)

    if (!ticket) {
      return res.status(404).json({ message: '티켓 없음' })
    }

    const successValue =
      success === 'true' || success === true ? 1 : 0

    if (successValue === 1 && fail_reason) {
      return res.status(400).json({
        message: '성공 기록에는 실패 이유를 작성할 수 없습니다'
      })
    }

    const cost = Math.round(ticket.total_price / ticket.target_count)
    const color = ticket.color
    const image_url = req.file ? `/uploads/${req.file.filename}` : null

    const recordData = {
      user_id: req.user?.userId || 1,
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

    res.status(201).json({
      message: '운동 기록 생성 완료',
      record_id: result.insertId
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '서버 에러' })
  }
}