const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello Node Backend");
});

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: 서버 상태 확인
 *     description: 서버가 살아있는지 확인하는 테스트 API
 *     responses:
 *       200:
 *         description: pong 반환
 */
app.get("/ping", (req, res) => {
  res.send("pong");
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: 로그인 성공
 */
app.use("/auth", authRoutes);

module.exports = app;