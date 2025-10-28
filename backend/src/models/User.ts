import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: {
    public_id: { type: String };
    secure_url: { type: String };
  };
  role: "user" | "admin" | "owner";
  isActive: boolean;
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    role: { type: String, enum: ["user", "admin", "owner"], default: "user" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
