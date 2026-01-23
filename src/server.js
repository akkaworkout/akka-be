const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

// DB 연결 확인
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("DB 연결 성공");

    app.listen(PORT, () => {
      console.log(`서버 실행 중 PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("DB 연결 실패", err);
  }
})();