const expenseService = require('../services/expense.service')

const createExpense = async (req, res) => {
  try {
    const {
      user_id,
      category,
      title,
      amount,
      expense_date
    } = req.body

    if (!user_id || !category || !title || !amount || !expense_date) {
      return res.status(400).json({
        message: '필수값이 누락되었습니다.'
      })
    }

    await expenseService.createExpense({
      user_id,
      category,
      title,
      amount,
      expense_date
    })

    res.status(201).json({
      message: '지출이 등록되었습니다.'
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: '서버 오류'
    })
  }
}

module.exports = {
  createExpense,
}