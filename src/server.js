console.log("src/server.js loaded");

const db = require("./config/db");
const app = require("./app");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

/* ================= CORS 설정 ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://akka-fe.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // 서버-서버 요청이나 Postman 등 (origin 없는 경우)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// preflight 대응
app.options("*", cors());

/* ================= DB 연결 확인 ================= */

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("DB 연결 성공");
  } catch (err) {
    console.error("DB 연결 실패", err);
  }
})();

/* ================= 서버 실행 ================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중 PORT: ${PORT}`);
});