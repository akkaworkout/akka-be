const authService = require("../services/auth.service");

/**
 * 회원가입
 * - email/password/nickname 필수
 * - multipart/form-data 지원 (profile 이미지 업로드)
 * - 성공 시 token 반환
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

    // ✅ multer 파일: req.file
    // 프론트에서 formData.append("profile", file)로 보낸 경우 여기 들어옴
    const profile = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ multipart에서는 숫자도 문자열로 들어올 수 있어서 변환
    const token = await authService.register({
      email,
      password,
      nickname,
      target_budget: target_budget !== undefined ? Number(target_budget) : null,
      target_exercise_count:
        target_exercise_count !== undefined ? Number(target_exercise_count) : null,
      profile, // ✅ 추가
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