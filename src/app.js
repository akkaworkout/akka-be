const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Node Backend");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

module.exports = app;
