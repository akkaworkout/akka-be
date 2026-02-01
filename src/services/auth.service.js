/* 실제 로직 */

const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/password");
const { createToken } = require("../utils/jwt");

const register = async (email, password) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("이미 존재하는 이메일");

  const hashed = await hashPassword(password);
  const user = await User.create({ email, password: hashed });

  return createToken(user._id);
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("유저 없음");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("비밀번호 틀림");

  return createToken(user._id);
};

module.exports = { register, login };
