const expenseModel = require('../models/expense.model')
const { getMonthlyStats } = require('../models/expense.model');

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

const getThisMonthExpense = async (user_id) => {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const rows = await getMonthlyStats(user_id, yearMonth);

  let totalAmount = 0;
  let expenseCount = 0;
  let topCategory = null;

  if (rows.length > 0) {
    expenseCount = rows.reduce((sum, r) => sum + Number(r.category_count || 0), 0);
    totalAmount = rows.reduce((sum, r) => sum + Number(r.total_amount), 0);
    topCategory = rows[0].category;
  }

  return {
    expenseCount,
    totalAmount,
    topCategory,
  };
};

module.exports = {
  createExpense,
  getThisMonthExpense
}
