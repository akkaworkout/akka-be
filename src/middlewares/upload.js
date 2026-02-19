const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads 폴더 경로
const uploadDir = path.join(__dirname, "../../uploads");

// 폴더 없으면 생성 (recursive 추가 ⭐)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 저장 방식 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

// ⭐ 이미지 파일만 허용
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  }
  cb(null, true);
};

// ⭐ 용량 제한 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;