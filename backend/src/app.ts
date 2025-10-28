import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db";
import authRoute from "./routes/auth-route";
import otpRoute from "./routes/otp-route";
import roleRoute from "./routes/role-route";
import warehouseRoute from "./routes/warehouse-route";
import cors from "cors";
import { checkApiKey } from "./middlewares/api-key-middleware";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/auth", checkApiKey, authRoute);
app.use("/api/otp", checkApiKey, otpRoute);
app.use("/api/role", checkApiKey, roleRoute);
app.use("/api/warehouses", checkApiKey, warehouseRoute);
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
