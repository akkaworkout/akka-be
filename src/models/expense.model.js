const db = require('../config/db')

const createExpense = async (expenseData) => {
  const {
    user_id,
    category,
    title,
    amount,
    expense_date,
    color
  } = expenseData

  const query = `
    INSERT INTO expense
    (user_id, category, title, amount, expense_date, color)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  const values = [
    user_id,
    category,
    title,
    amount,
    expense_date,
    color
  ]

  const [result] = await db.query(query, values)
  return result
}

module.exports = {
  createExpense,
}
