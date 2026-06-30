const exerciseService = require('../services/exerciseRecord.service')

exports.createExerciseRecord = async (req, res, next) => {
  try {
    const result = await exerciseService.createExerciseRecord(
      req.body,
      req.file,
      req.user?.userId
    )

    return res.status(201).json({
      success: true,
      message: '운동 기록 생성 완료',
      record_id: result.insertId
    })
  } catch (error) {
    next(error)
  }
}

exports.updateExerciseRecord = async (req, res, next) => {
  try {
    const record_id = req.params.record_id

    const record =
      await exerciseService.getExerciseRecord(record_id)

    const data = {
      ...req.body,
      exercise_date: req.body.exercise_date?.slice(0, 10)
    }

    if (req.file) {
      data.image_url = `/uploads/${req.file.filename}`
    } else {
      data.image_url = record.image_url
    }

    await exerciseService.updateExerciseRecord(
      record_id,
      data
    )

    return res.status(200).json({
      success: true,
      message: '운동 기록 수정 완료'
    })
  } catch (error) {
    next(error)
  }
}

exports.deleteExerciseRecord = async (req, res, next) => {
  try {
    const record_id = req.params.record_id

    await exerciseService.deleteExerciseRecord(
      record_id
    )

    return res.status(200).json({
      success: true,
      message: '운동 기록 삭제 완료'
    })
  } catch (error) {
    next(error)
  }
}

exports.getExerciseRecord = async (req, res, next) => {
  try {
    const record_id = req.params.record_id

    const record =
      await exerciseService.getExerciseRecord(
        record_id
      )

    return res.status(200).json({
      success: true,
      data: record
    })
  } catch (error) {
    next(error)
  }
}

exports.getExerciseRecords = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "인증이 필요합니다."
      });
    } 1

    const records =
      await exerciseService.getExerciseRecords(
        userId
      )

    return res.status(200).json({
      success: true,
      data: records
    })
  } catch (error) {
    next(error)
  }
}