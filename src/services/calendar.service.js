const calendarModel = require("../models/calendar.model");

const getByDate = async (userId, date) => {
  if (!userId || !date) {
    throw new Error("userId and date are required");
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error("Invalid date format (YYYY-MM-DD required)");
  }

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const rows = await calendarModel.findByDate(userId, start, end);

  return rows.map((row) => ({
    id: row.id,
    name: "운동",
    status: row.success === 1 ? "성공" : "실패",
    amount: row.cost,
    memo: row.memo,
    color: row.color,
    created_at: row.created_at,
  }));
};

module.exports = {
  getByDate,
};