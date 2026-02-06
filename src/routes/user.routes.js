const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "내 정보 조회 성공",
    data: {
      userId: req.user.userId,
    },
  });
});

module.exports = router;