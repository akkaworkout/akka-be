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
    INSERT INTO exercise_records
    (user_id, exercise_date, is_success, memo, image_url, exercise_amount, ticket_id, color_code, failure_reason)
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
    FROM exercise_records
    WHERE id = ?
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
    UPDATE exercise_records
    SET
      exercise_date = ?,
      is_success = ?,
      memo = ?,
      image_url = ?,
      failure_reason = ?
    WHERE id = ?
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
    DELETE FROM exercise_records
    WHERE id = ?
  `

  const [result] = await db.query(query, [record_id])

  return result
}

const getExerciseRecordById = async (record_id) => {
  const query = `
    SELECT 
      er.*,
      t.exercise_type
    FROM exercise_records er
    JOIN tickets t ON er.ticket_id = t.id
    WHERE er.id = ?
  `

  const [rows] = await db.query(query, [record_id])

  return rows[0]
}

const getExerciseRecordsByUser = async (user_id) => {
  const query = `
    SELECT 
      er.*,
      t.exercise_type
    FROM exercise_records er
    JOIN tickets t ON er.ticket_id = t.id
    WHERE er.user_id = ?
    ORDER BY er.exercise_date DESC
  `

  const [rows] = await db.query(query, [user_id])

  return rows
}

const findTicketForUpdate = async (conn, ticket_id) => {
  const [rows] = await conn.execute(
    `SELECT * FROM tickets WHERE id = ? FOR UPDATE`,
    [ticket_id]
  )

  return rows[0] || null
}

const createExerciseRecordWithConn = async (
  conn,
  data
) => {
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

  const [result] = await conn.execute(
    `INSERT INTO exercise_records
    (
      user_id,
      exercise_date,
      is_success,
      memo,
      image_url,
      exercise_amount,
      ticket_id,
      color_code,
      failure_reason
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
  )

  return result
}

const decreaseRemainingCount = async (
  conn,
  ticket_id
) => {
  await conn.execute(
    `UPDATE tickets
     SET remaining_count = remaining_count - 1
     WHERE id = ?`,
    [ticket_id]
  )
}

module.exports = {
  createExerciseRecord,
  createExerciseRecordWithConn,
  findTicketForUpdate,
  decreaseRemainingCount,
  findById,
  updateExerciseRecord,
  deleteExerciseRecord,
  getExerciseRecordById,
  getExerciseRecordsByUser
}