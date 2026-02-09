const authService = require("../services/auth.service");

/**
 * 회원가입
 * - email/password/nickname 필수
 * - 성공 시 token 반환 (프론트에서 바로 사용)
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

    if (!email || !password || !nickname) {
      return res
        .status(400)
        .json({ success: false, message: "email, password, nickname are required" });
    }

    // auth.service.js는 register를 "객체"로 받는 버전으로 통일했을 때 기준
    const token = await authService.register({
      email,
      password,
      nickname,
      target_budget,
      target_exercise_count,
    });

    return res.status(201).json({
      success: true,
      message: "회원가입 성공",
      data: { token },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * 로그인
 * - email/password 필수
 * - 성공 시 token 반환
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }

    const token = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "로그인 성공",
      data: { token },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * 이메일 중복 확인
 * GET /auth/check-email?email=...
 */
const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is required" });
    }

    const available = await authService.checkEmail(email);

    return res.json({
      success: true,
      available,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * 닉네임 중복 확인
 * GET /auth/check-nickname?nickname=...
 */
const checkNickname = async (req, res) => {
  try {
    const { nickname } = req.query;

    if (!nickname) {
      return res
        .status(400)
        .json({ success: false, message: "nickname is required" });
    }

    const available = await authService.checkNickname(nickname);

    return res.json({
      success: true,
      available,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  checkEmail,
  checkNickname,
};