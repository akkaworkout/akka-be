const calendarService = require("../services/calendar.service");

exports.getByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;

    const result = await calendarService.getByDate(userId, date);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};