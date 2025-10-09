import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  // profilePicture: string;
  role: "user" | "admin" | "owner";
  isActive: boolean;
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // profilePicture: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "owner"], default: "user" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
