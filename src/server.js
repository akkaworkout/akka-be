const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello Node Backend");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중 PORT: ${PORT}`);
});
