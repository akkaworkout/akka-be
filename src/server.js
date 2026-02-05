const express = require("express");
const db = require('./config/db');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ Railway DB 연결 성공');
  } catch (err) {
    console.error('❌ Railway DB 연결 실패', err);
  }
})();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello Node Backend");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;
  res.json({
    message: "회원가입 요청 받음",
    email,
    password,
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  res.json({
    message: "로그인 요청 받음",
    email,
    password,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 서버 실행 중 PORT: ${PORT}`);
});
