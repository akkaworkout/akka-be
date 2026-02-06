const User = require("../models/user.model");
const MonthlyGoal = require("../models/monthlyGoal.model");
const { hashPassword, comparePassword } = require("../utils/password");
const { createToken } = require("../utils/jwt");

/**
 * 회원가입
 * - 계정 생성만 수행
 * - 토큰 발급 ❌
 */
const register = async ({
  email,
  password,
  nickname,
  target_budget,
  target_exercise_count,
}) => {
  console.log("A. register service start");

  /* 필수값 검증 */
  if (!email || !password || !nickname) {
    const err = new Error("필수 항목이 누락되었습니다");
    err.status = 400;
    throw err;
  }

  console.log("B. before findByEmail");
  const exists = await User.findByEmail(email);
  console.log("C. after findByEmail");

  if (exists) {
    const err = new Error("이미 존재하는 이메일입니다");
    err.status = 409;
    throw err;
  }

  console.log("D. before hashPassword");
  const hashed = await hashPassword(password);
  console.log("E. after hashPassword");

  console.log("F. before User.create");
  const userId = await User.create({
    email,
    password: hashed,
    nickname,
  });
  console.log("G. after User.create:", userId);

  /* 이번 달 목표 생성 */
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  console.log("H. before MonthlyGoal.create");
  await MonthlyGoal.create({
    user_id: userId,
    year_month: yearMonth,
    target_budget: target_budget || 0,
    target_exercise_count: target_exercise_count || 0,
  });
  console.log("I. after MonthlyGoal.create");

  // ✅ 토큰 생성 제거
  console.log("J. register end (no token)");
  return;
};

/**
 * 로그인
 * - 성공 시 JWT 토큰 발급 ⭕
 */
const login = async (email, password) => {
  console.log("A. login service start");

  if (!email || !password) {
    const err = new Error("이메일과 비밀번호를 입력하세요");
    err.status = 400;
    throw err;
  }

  console.log("B. login findByEmail");
  const user = await User.findByEmail(email);

  if (!user) {
    const err = new Error("이메일 또는 비밀번호가 올바르지 않습니다");
    err.status = 401;
    throw err;
  }

  console.log("C. login comparePassword");
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const err = new Error("이메일 또는 비밀번호가 올바르지 않습니다");
    err.status = 401;
    throw err;
  }

  console.log("D. login success → createToken");
  return createToken(user.user_id);
};

module.exports = { register, login };