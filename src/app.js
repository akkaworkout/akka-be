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
  // 프론트 배포주소 있으면 여기에 추가
  // "https://너희-프론트-도메인"
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Postman/서버간 호출처럼 origin 없는 요청은 허용
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 프리플라이트(OPTIONS) 요청 처리
app.options("*", cors());

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