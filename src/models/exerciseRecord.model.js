const db = require('../config/db')

const createExerciseRecord = async (data) => {
  const {
    user_id,
    exercise_date,
    success,
    memo,
    image_url,
    cost,
    ticket_id,
    color,
    fail_reason
  } = data

  const query = `
    INSERT INTO exercise_record
    (user_id, exercise_date, success, memo, image_url, cost, ticket_id, color, fail_reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const values = [
    user_id,
    exercise_date,
    success,
    memo,
    image_url,
    cost,
    ticket_id,
    color,
    fail_reason
  ]

  const [result] = await db.query(query, values)
  return result
}

const findById = async (record_id) => {

  const query = `
    SELECT *
    FROM exercise_record
    WHERE record_id = ?
  `

  const [rows] = await db.query(query, [record_id])

  return rows[0]
}

const updateExerciseRecord = async (record_id, data) => {

  const {
    exercise_date,
    success,
    memo,
    image_url,
    fail_reason
  } = data

  const query = `
    UPDATE exercise_record
    SET
      exercise_date = ?,
      success = ?,
      memo = ?,
      image_url = ?,
      fail_reason = ?
    WHERE record_id = ?
  `

  const values = [
    exercise_date,
    success,
    memo,
    image_url,
    fail_reason,
    record_id
  ]

  const [result] = await db.query(query, values)

  return result
}

const deleteExerciseRecord = async (record_id) => {

  const query = `
    DELETE FROM exercise_record
    WHERE record_id = ?
  `

  const [result] = await db.query(query, [record_id])

  return result
}

const getExerciseRecordById = async (record_id) => {
  const query = `
    SELECT 
      er.*,
      t.exercise_type
    FROM exercise_record er
    JOIN ticket t ON er.ticket_id = t.ticket_id
    WHERE er.record_id = ?
  `

  const [rows] = await db.query(query, [record_id])

  return rows[0]
}

const getExerciseRecordsByUser = async (user_id) => {
  const query = `
    SELECT 
      er.*,
      t.exercise_type
    FROM exercise_record er
    JOIN ticket t ON er.ticket_id = t.ticket_id
    WHERE er.user_id = ?
    ORDER BY er.exercise_date DESC
  `

  const [rows] = await db.query(query, [user_id])

  return rows
}

module.exports = {
  createExerciseRecord,
  findById,
  updateExerciseRecord,
  deleteExerciseRecord,
  getExerciseRecordById,
  getExerciseRecordsByUser
}