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
    color
  } = data

  const query = `
    INSERT INTO exercise_record
    (user_id, exercise_date, success, memo, image_url, cost, ticket_id, color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `

  const values = [
    user_id,
    exercise_date,
    success,
    memo,
    image_url,
    cost,
    ticket_id,
    color
  ]

  const [result] = await db.query(query, values)
  return result
}

module.exports = {
  createExerciseRecord
}