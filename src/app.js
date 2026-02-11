console.log("src/app.js loaded");

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

/* ===== CORS ===== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // 프론트 배포주소 있으면 여기에 추가
  // "https://너희-프론트-도메인"
];

const corsOptions = {
  origin: (origin, cb) => {
    // Postman/서버간 호출처럼 origin 없는 요청은 허용
    if (!origin) return cb(null, true);

    // localhost 포트가 바뀌는 경우(5173 말고도)까지 허용하고 싶으면 유지
    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);

    if (allowedOrigins.includes(origin) || isLocalhost) return cb(null, true);

    // ❗여기서 에러 던지지 말고 false 처리 (그래야 CORS 헤더가 덜 꼬임)
    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// 프리플라이트(OPTIONS) 요청도 동일 옵션으로 처리
app.options("*", cors(corsOptions));

/* ===== 기본 미들웨어 ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== Swagger ===== */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ===== 기본 라우트 ===== */
app.get("/", (req, res) => {
  res.send("Hello Node Backend");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

/* ===== Auth ===== */
app.use("/auth", authRoutes);

/* ===== User ===== */
app.use("/users", userRoutes);

module.exports = app;