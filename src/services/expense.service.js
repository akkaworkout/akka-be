const expenseModel = require('../models/expense.model')

const categoryColorMap = {
  '운동 용품': '#FCD7FF',
  '운동 식품': '#FFEAD7',
  '기타': '#D7EDFF',
}

const createExpense = async (data) => {
  const { category } = data

  const color = categoryColorMap[category]

  if (!color) {
    throw new Error('유효하지 않은 카테고리입니다.')
  }

  const expenseData = {
    ...data,
    color,
  }

  return await expenseModel.createExpense(expenseData)
}

module.exports = {
  createExpense,
}
