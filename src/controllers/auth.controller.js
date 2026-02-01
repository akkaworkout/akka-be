/* 컨트롤러 */

const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.register(email, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login };