import mongoose, { Document, Schema } from "mongoose";

export interface IRentalContract extends Document {
  warehouseId: string;
  warehouseRef?: mongoose.Types.ObjectId;
  renterWallet: string;
  ownerWallet: string;
  pricePaidWei: string;
  depositWei: string;
  durationDays: number;
  startTime: Date;
  endTime: Date;
  txHash: string;
  status: "active" | "ended" | "refunded" | "pending_end";
  blockNumber?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const rentalContractSchema = new Schema<IRentalContract>(
  {
    warehouseId: { type: String, required: true, index: true },
    warehouseRef: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    renterWallet: { type: String, required: true },
    ownerWallet: { type: String, required: true },
    pricePaidWei: { type: String, required: true },
    depositWei: { type: String, required: true },
    durationDays: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    txHash: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["active", "ended", "refunded", "pending_end"],
      default: "active",
    },
    blockNumber: { type: Number, default: null },
  },
  { timestamps: true }
);

// 🧠 Virtual: thời gian còn lại
rentalContractSchema
  .virtual("timeLeftSeconds")
  .get(function (this: IRentalContract) {
    if (this.status !== "active") return 0;
    const now = Date.now();
    const diff = new Date(this.endTime).getTime() - now;
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  });

rentalContractSchema.index({ renterWallet: 1 });
rentalContractSchema.index({ ownerWallet: 1 });
rentalContractSchema.index({ status: 1 });

const RentalContract = mongoose.model<IRentalContract>(
  "RentalContract",
  rentalContractSchema
);

export default RentalContract;
