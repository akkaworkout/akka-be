const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  uri: process.env.MYSQL_PUBLIC_URL,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+09:00',
  dateStrings: true
});

module.exports = pool;