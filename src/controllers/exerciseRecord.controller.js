const exerciseService = require('../services/exerciseRecord.service')

exports.createExerciseRecord = async (req, res) => {
  try {

    const result = await exerciseService.createExerciseRecord(
      req.body,
      req.file,
      req.user?.userId
    )

    res.status(201).json({
      message: '운동 기록 생성 완료',
      record_id: result.insertId
    })

  } catch (error) {

    console.error(error)

    res.status(error.status || 500).json({
      message: error.message || '서버 에러'
    })
  }
}

exports.updateExerciseRecord = async (req, res) => {
  try {

    const record_id = req.params.record_id

    const record = await exerciseService.getExerciseRecord(record_id)

    const data = {
      ...req.body,
      exercise_date: req.body.exercise_date?.slice(0, 10)
    }

    if (req.file) {
      data.image_url = `/uploads/${req.file.filename}`
    } else {
      data.image_url = record.image_url
    }

    await exerciseService.updateExerciseRecord(record_id, data)

    res.json({
      message: '운동 기록 수정 완료'
    })

  } catch (error) {

    console.error(error)

    res.status(error.status || 500).json({
      message: error.message || '서버 에러'
    })
  }
}

exports.deleteExerciseRecord = async (req, res) => {
  try {

    const record_id = req.params.record_id

    await exerciseService.deleteExerciseRecord(record_id)

    res.json({
      message: '운동 기록 삭제 완료'
    })

  } catch (error) {

    console.error(error)

    res.status(error.status || 500).json({
      message: error.message || '서버 에러'
    })
  }
}

exports.getExerciseRecord = async (req, res) => {
  try {

    const record_id = req.params.record_id

    const record = await exerciseService.getExerciseRecord(record_id)

    res.json(record)

  } catch (error) {

    console.error(error)

    res.status(error.status || 500).json({
      message: error.message || '서버 에러'
    })
  }
}

exports.getExerciseRecords = async (req, res) => {
  try {

    const userId = req.user?.userId || 1

    const records = await exerciseService.getExerciseRecords(userId)

    res.json(records)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: '서버 에러'
    })
  }
}