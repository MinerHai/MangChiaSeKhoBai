import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db";
import authRoute from "./routes/auth-route";
import otpRoute from "./routes/otp-route";
import roleRoute from "./routes/role-route";
const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/otp", otpRoute);
app.use("/api/role", roleRoute);
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
