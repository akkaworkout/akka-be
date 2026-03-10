console.log("src/app.js loaded");

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const path = require("path");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const ticketRoutes = require("./routes/ticket.routes");
const expenseRoutes = require("./routes/expense.routes");
const calendarRoutes = require("./routes/calendar.routes");
const exerciseRecordRouter = require("./routes/exerciseRecord.routes");

/* 추가 */
const reportRoutes = require("./routes/report.routes");

const app = express();

app.set("trust proxy", 1);

/* CORS */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://akkaworkout.store"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

/* 기본 미들웨어 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 파일 업로드 */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* Swagger */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* 기본 라우트 */
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

/* Auth */
app.use("/auth", authRoutes);

/* User */
app.use("/users", userRoutes);

/* Ticket */
app.use("/tickets", ticketRoutes);

/* 기타비용 */
app.use("/expense", expenseRoutes);

/* Calendar */
app.use("/calendar", calendarRoutes);

/* 운동기록 */
app.use("/exercise-record", exerciseRecordRouter);

/* Reports */
app.use("/reports", reportRoutes);

module.exports = app;