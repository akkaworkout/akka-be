const authService = require("../services/auth.service");
const User = require("../models/user.model");

/**
 * 회원가입
 * - 계정 생성만 수행
 * - 토큰 발급 ❌
 */
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      nickname,
      target_budget,
      target_exercise_count,
    } = req.body;

    await authService.register({
      email,
      password,
      nickname,
      target_budget,
      target_exercise_count,
    });

    res.status(201).json({
      success: true,
      message: "회원가입 성공",
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * 로그인
 * - 성공 시 JWT 토큰 반환
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: "로그인 성공",
      data: { token },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * 이메일 중복 확인
 */
const checkEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false });
  }

  const exists = await User.findByEmail(email);

  res.json({
    success: true,
    available: !exists,
  });
};

/**
 * 닉네임 중복 확인
 */
const checkNickname = async (req, res) => {
  const { nickname } = req.query;

  if (!nickname) {
    return res.status(400).json({ success: false });
  }

  const exists = await User.findByNickname(nickname);

  res.json({
    success: true,
    available: !exists,
  });
};

module.exports = {
  register,
  login,
  checkEmail,
  checkNickname,
};