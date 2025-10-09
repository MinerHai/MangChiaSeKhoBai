import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth-payload";

export const signToken = async (user: AuthPayload): Promise<string> => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role }, // payload
    process.env.JWT_SECRET_KEY?.toString() || "", // secret key
    { expiresIn: "1h" } // hết hạn 1 giờ
  );
  return token;
};

export const verifyToken = (token: string): AuthPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY?.toString() || ""
    ) as AuthPayload;
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};
