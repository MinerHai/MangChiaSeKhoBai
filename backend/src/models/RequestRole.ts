import mongoose, { Document, Schema } from "mongoose";

interface Image {
  public_id: string;
  secure_url: string;
}
export interface IRequestRole extends Document {
  user: mongoose.Types.ObjectId; // ref tới User

  requestedRole: "owner";
  images: Image[];
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const requestRoleSchema = new Schema<IRequestRole>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedRole: { type: String, required: true },
    images: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);
export const RequestRole = mongoose.model<IRequestRole>(
  "RequestRole",
  requestRoleSchema
);
