import multer from "multer";
import path from "path";

// Lưu file tạm trong thư mục "uploads/"
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Chỉ nhận file ảnh
const checkFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image file!! Please upload only images"));
  }
};

const upload = multer({
  storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
});

export default upload;
