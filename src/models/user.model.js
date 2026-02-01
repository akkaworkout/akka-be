const db = require('../config/db');

const User = {
  findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });
  },

  create(email, password) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, password],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.insertId);
        }
      );
    });
  }
};

module.exports = User;