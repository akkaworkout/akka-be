const expenseService = require('../services/expense.service');

const createExpense = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: '인증 정보가 없습니다.',
      });
    }

    const userId = req.user.id;
    const { category, title, amount, expense_date } = req.body;

    if (!category || !title || !amount || !expense_date) {
      return res.status(400).json({
        success: false,
        message: '필수값이 누락되었습니다.',
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: '금액은 0보다 큰 숫자여야 합니다.',
      });
    }

    await expenseService.createExpense({
      user_id: userId,
      category,
      title,
      amount: Number(amount),
      expense_date,
    });

    return res.status(201).json({
      success: true,
      message: '지출이 등록되었습니다.',
    });

  } catch (error) {
    next(error);
  }
};

const getMonthlyExpenseStats = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: '인증 정보가 없습니다.',
      });
    }

    const userId = req.user.id;
    const stats =
      await expenseService.getThisMonthExpense(userId);

    return res.status(200).json({
      success: true,
      data: stats,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getMonthlyExpenseStats,
};