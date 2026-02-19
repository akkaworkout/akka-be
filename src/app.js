console.log("✅ src/app.js loaded (CORS v3)");

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const path = require("path"); // ⭐ 추가

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.set("trust proxy", 1);

/* ===== CORS ===== */
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // "https://너희-프론트-도메인"
]);

const corsOptions = {
  origin: (origin, cb) => {
    console.log("CORS check origin:", origin);

    if (!origin) return cb(null, true);

    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);

    if (allowedOrigins.has(origin) || isLocalhost) return cb(null, true);

    console.warn("❌ CORS blocked origin:", origin);
    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/* ===== 기본 미들웨어 ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐⭐ 추가: 업로드 파일 정적 서빙 ⭐⭐
// upload.js에서 "../../uploads"로 저장하니까
// 실제 위치는 backend/uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ===== Swagger ===== */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ===== 기본 라우트 ===== */
app.get("/", (req, res) => {
  res.send("Hello Node Backend");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/__cors", (req, res) => {
  res.json({
    ok: true,
    origin: req.headers.origin || null,
    host: req.headers.host || null,
  });
});

/* ===== Auth ===== */
app.use("/auth", authRoutes);

/* ===== User ===== */
app.use("/users", userRoutes);

module.exports = app;