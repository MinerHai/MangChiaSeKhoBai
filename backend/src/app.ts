import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db";
import helmet from "helmet";
import mongoSanitize from "mongo-sanitize";
import xss from "xss";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth-route";
import otpRoute from "./routes/otp-route";
import roleRoute from "./routes/role-route";
import warehouseRoute from "./routes/warehouse-route";
import rentalContractRoute from "./routes/rentalContract-route";
import blogRoute from "./routes/blog-route";
import categoryRoute from "./routes/category-route";

import cors from "cors";
import { checkApiKey } from "./middlewares/api-key-middleware";

const app = express();

const allowedOrigins = ["http://localhost:5000", "http://localhost:5173"];

// Cấu hình CORS (Cross-Origin Resource Sharing):
// - Giới hạn nguồn (origin) được phép gọi API là http://localhost:3000 (frontend React)
// - Cho phép gửi cookie và header xác thực (credentials: true)
// - Nếu origin không nằm trong danh sách cho phép => từ chối truy cập ("Not allowed by CORS")
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Sử dụng Helmet để thêm các HTTP header bảo mật:
// - Ngăn XSS (Content-Security-Policy, X-XSS-Protection)
// - Chặn clickjacking (X-Frame-Options)
// - Ngăn đoán loại MIME (X-Content-Type-Options)
// - Buộc dùng HTTPS (Strict-Transport-Security)
// - Ẩn thông tin server (X-Powered-By)
app.use(helmet());

app.use(express.json());
app.use(cookieParser());
// XSS Clean: loại bỏ các input có chứa mã HTML/JS độc hại

app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});
//Mongo Sanitize: ngăn tấn công NoSQL injection qua query MongoDB
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  next();
});

app.use("/api/auth", checkApiKey, authRoute);
app.use("/api/otp", checkApiKey, otpRoute);
app.use("/api/role", checkApiKey, roleRoute);
app.use("/api/warehouses", checkApiKey, warehouseRoute);
app.use("/api/contracts", checkApiKey, rentalContractRoute);
app.use("/api/blogs", checkApiKey, blogRoute);
app.use("/api/categories", checkApiKey, categoryRoute);
app.get("/test", (req, res) => res.send("OK"));
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
