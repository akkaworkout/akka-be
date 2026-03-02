console.log("src/server.js loaded");

const db = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

/* DB 연결 확인 */
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("DB 연결 성공");
  } catch (err) {
    console.error("DB 연결 실패", err);
  }
})();

/* 서버 실행 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중 PORT: ${PORT}`);
});