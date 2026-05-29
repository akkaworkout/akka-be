const authService = require("../services/auth.service");
const { createAccessToken } = require("../utils/jwt");

/**
 * 회원가입
 * - email/password/nickname 필수
 * - multipart/form-data 지원 (profile 이미지 업로드)
 * - 성공 시 accessToken, refreshToken 반환
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
      return res.status(400).json({
        success: false,
        message: "email, password, nickname are required",
      });
    }

    // multer 파일: req.file
    const profile = req.file ? `/uploads/${req.file.filename}` : null;

    // accessToken, refreshToken 받기
    const { accessToken, refreshToken } = await authService.register({
      email,
      password,
      nickname,
      target_budget: target_budget !== undefined ? Number(target_budget) : null,
      target_exercise_count:
        target_exercise_count !== undefined ? Number(target_exercise_count) : null,
      profile,
    });

    return res.status(201).json({
      success: true,
      message: "회원가입 성공",
      data: { accessToken, refreshToken }, 
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
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    // accessToken, refreshToken 받기
    const { accessToken, refreshToken } = await authService.login(
      email,
      password
    );

    return res.status(200).json({
      success: true,
      message: "로그인 성공",
      data: { accessToken, refreshToken }, // 둘 다 반환
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * 액세스 토큰 갱신
 */
const refresh = async (req, res) => {
  try {
    const userId = req.user.id;

    // 새로운 accessToken 생성
    const accessToken = createAccessToken(userId);

    return res.status(200).json({
      success: true,
      message: "토큰 갱신 성공",
      data: { accessToken },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
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

const checkNickname = async (req, res) => {
  try {
    const { nickname } = req.query;

    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: "nickname is required",
      });
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
  refresh, 
  checkEmail,
  checkNickname,
};