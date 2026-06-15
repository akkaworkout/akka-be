const authModel = require("../models/auth.model");
const { hashPassword, comparePassword } = require("../utils/password");
const { createAccessToken, createRefreshToken } = require("../utils/jwt");

const checkEmail = async (email) => {
  const user = await authModel.findByEmail(email);

  return !user;
};

const checkNickname = async (nickname) => {
  const user = await authModel.findByNickname(nickname);

  return !user;
};

const register = async ({
  email,
  password,
  nickname,
  target_budget = 0,
  target_exercise_count = 0,
  profile = null,
}) => {
  if (!email || !password || !nickname) {
    throw new Error(
      "email, password_hash, nickname are required"
    );
  }

  const emailUser = await authModel.findByEmail(email);

  if (emailUser) {
    throw new Error("이미 존재하는 이메일");
  }

  const nicknameUser =
    await authModel.findByNickname(nickname);

  if (nicknameUser) {
    throw new Error("이미 존재하는 닉네임");
  }

  const hashed = await hashPassword(password);

  const userId = await authModel.createUser({
    email,
    passwordHash: hashed,
    nickname,
    profile,
    target_budget,
    target_exercise_count,
  });

  return {
    accessToken: createAccessToken(userId),
    refreshToken: createRefreshToken(userId),
  };
};

const login = async (email, password) => {
  const user = await authModel.findByEmail(email);

  if (!user) {
    throw new Error("유저 없음");
  }

  const isMatch = await comparePassword(
    password,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error("비밀번호 틀림");
  }

  return {
    accessToken: createAccessToken(user.id),
    refreshToken: createRefreshToken(user.id),
  };
};

module.exports = {
  checkEmail,
  checkNickname,
  register,
  login,
};