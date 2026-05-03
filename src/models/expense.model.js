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
    INSERT INTO expenses
    (user_id, category, item_name, amount, expense_date, color_code)
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

const getMonthlyStats = async (user_id, yearMonth) => {
  const query = `
    SELECT 
      COUNT(*) AS expense_count,
      SUM(amount) AS total_amount,
      category,
      COUNT(category) AS category_count
    FROM expenses
    WHERE user_id = ? AND DATE_FORMAT(expense_date, '%Y-%m') = ?
    GROUP BY category
    ORDER BY category_count DESC
  `;

  const [rows] = await db.query(query, [user_id, yearMonth]);
  return rows;
};

module.exports = {
  createExpense,
  getMonthlyStats
}
