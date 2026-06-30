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
    throw new Error("필수 입력값이 누락되었습니다.");
  }

  const emailUser = await authModel.findByEmail(email);

  if (emailUser) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  const nicknameUser =
    await authModel.findByNickname(nickname);

  if (nicknameUser) {
    throw new Error("이미 사용 중인 닉네임입니다.");
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
    throw new Error("존재하지 않는 이메일입니다.");
  }

  const isMatch = await comparePassword(
    password,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error("비밀번호가 일치하지 않습니다.");
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