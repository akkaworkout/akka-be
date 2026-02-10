console.log("✅ src/app.js loaded");


const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

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