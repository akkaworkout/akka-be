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
const reportRoutes = require("./routes/report.routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.set("trust proxy", 1);

/* CORS */
const allowedOrigins = require("./config/cors");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* 기본 미들웨어 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 파일 업로드 */
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"))
);

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

app.use(errorHandler);

module.exports = app;