/* 비밀번호 처리 */

const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
