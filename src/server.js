const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`서버 실행 중 PORT: ${PORT}`);
});