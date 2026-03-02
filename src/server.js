console.log("✅ src/server.js loaded");

const db = require("./config/db");
const app = require("./app");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

/* ================= CORS 설정 ================= */
app.use(
  cors({
    origin: "http://localhost:5173", // 프론트 주소
    credentials: true,
  })
);

/* ================= DB 연결 확인 ================= */
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Railway DB 연결 성공");
  } catch (err) {
    console.error("❌ Railway DB 연결 실패", err);
  }
})();

/* ================= 서버 실행 ================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 서버 실행 중 PORT: ${PORT}`);
});