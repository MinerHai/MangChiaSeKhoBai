// src/models/Warehouse.js
import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    warehouseId: { type: String, required: true, unique: true }, // id in smart contract
    name: { type: String, required: true },
    // Cấu trúc địa chỉ chi tiết
    location: {
      province: { type: String, required: true }, // Tỉnh/Thành phố
      district: { type: String, required: true }, // Quận/Huyện
      ward: { type: String, required: false }, // Xã/Phường
      street: { type: String, required: false }, // Đường / số nhà
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    description: { type: String },
    capacity: { type: Number, default: 0 }, // theo m3
    pricePerDayWei: { type: Number, required: true },
    depositWei: { type: Number, required: true },
    ownerWallet: { type: String, required: true }, // wallet address (owner's metamask address)
    txHash: { type: String, default: null }, // txHash cho register tx ( tx = transaction hash : mã giao dịch)
    blockNumber: { type: Number, default: null },
    images: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    isRenting: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for fast queries by ownerWallet
warehouseSchema.index({ ownerWallet: 1 });

export default mongoose.model("Warehouse", warehouseSchema);
