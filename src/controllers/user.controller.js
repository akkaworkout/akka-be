const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

/**
 * 사용자 정보 조회
 */
const getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user.user_id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "유저 없음",
      });
    }

    return res.status(200).json({
      success: true,
      message: "내 정보 조회 성공",
      data: {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
        profile_image_url: user.profile_image_url,
        target_budget: user.budget_goal,
        target_exercise_count: user.exercise_goal,
        points: user.points,
      },
    });
  } catch (err) {
    console.error("❌ getMe 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
};

/**
 * 사용자 정보 수정
 */
const updateMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user.user_id;

    const {
      email,
      nickname,
      target_budget,
      target_exercise_count,
      password,
      profile,
    } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "유저 없음",
      });
    }

    // 이메일 유효성 검사
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(String(email))) {
        return res.status(400).json({
          success: false,
          message: "올바른 이메일 형식이 아닙니다.",
        });
      }

      if (String(email) !== user.email) {
        const exists = await userModel.findByEmail(String(email));
        if (exists) {
          return res.status(409).json({
            success: false,
            message: "이미 사용 중인 이메일입니다.",
          });
        }
      }
    }

    // 업데이트 데이터 구성
    const updatedData = {};

    if (email !== undefined && String(email) !== user.email) {
      updatedData.email = String(email);
    }

    if (nickname !== undefined) updatedData.nickname = nickname;
    if (target_budget !== undefined) updatedData.target_budget = target_budget;
    if (target_exercise_count !== undefined)
      updatedData.target_exercise_count = target_exercise_count;

    // 프로필 이미지
    const profilePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    if (profilePath !== undefined) updatedData.profile_image_url = profilePath;

    // 비밀번호 해싱
    if (password !== undefined) {
      const hashed = await bcrypt.hash(String(password), 10);
      updatedData.password_hash = hashed;
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "수정할 값이 없습니다.",
      });
    }

    await userModel.updateById(userId, updatedData);

    return res.status(200).json({
      success: true,
      message: "내 정보 수정 성공",
    });
  } catch (err) {
    console.error("❌ updateMe 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
};

module.exports = {
  getMe,
  updateMe,
};