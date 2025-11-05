import { Request, Response } from "express";
import RentalContract from "../models/RentalContract";
import Warehouse from "../models/Warehouse";

/**
 * POST /api/contracts
 * ✅ Tạo mới hợp đồng thuê sau khi người dùng thanh toán on-chain thành công
 */
export const createRentalContract = async (req: Request, res: Response) => {
  try {
    const {
      _id, // id ở backend
      warehouseId, // id ở block chain
      renterWallet,
      ownerWallet,
      pricePaidWei,
      depositWei,
      durationDays,
      txHash,
      startTime,
      endTime,
      blockNumber,
    } = req.body;

    // Kiểm tra trùng txHash
    const exists = await RentalContract.findOne({ txHash });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Transaction already recorded",
      });
    }
    const warehouse = await Warehouse.findOne({ warehouseId });
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    const contract = await RentalContract.create({
      warehouseRef: warehouse._id, // ref tới warehouse
      warehouseId,
      renterWallet,
      ownerWallet,
      pricePaidWei,
      depositWei,
      durationDays,
      txHash,
      startTime,
      endTime,
      blockNumber,
      status: "active",
    });

    // Cập nhật trạng thái kho
    await Warehouse.findOneAndUpdate(
      { warehouseId },
      { isRenting: true },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Rental contract created successfully",
      data: contract,
    });
  } catch (error: any) {
    console.error("Error creating rental contract:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/contracts/user/:wallet
 * ✅ Lấy danh sách hợp đồng của một ví (renter hoặc owner)
 */
export const getContractsByWallet = async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;

    const contracts = await RentalContract.find({
      $or: [{ renterWallet: wallet }, { ownerWallet: wallet }],
    }).sort({ createdAt: -1 });

    return res.json({ success: true, data: contracts });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/contracts/end/:txHash
 * ✅ Đánh dấu hợp đồng đã kết thúc (gọi khi event LeaseEnded được backend bắt)
 */
export const endRentalContract = async (req: Request, res: Response) => {
  try {
    const { txHash } = req.params;

    const updated = await RentalContract.findOneAndUpdate(
      { txHash },
      { status: "ended" },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });

    // Đồng thời đánh dấu kho là rảnh
    await Warehouse.findOneAndUpdate(
      { warehouseId: updated.warehouseId },
      { isRenting: false }
    );

    return res.json({
      success: true,
      message: "Contract ended successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const endRentalByOwner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ownerWallet } = req.body; // gửi kèm từ frontend

    const contract = await RentalContract.findById(id);
    if (!contract)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hợp đồng" });

    // ✅ Kiểm tra quyền của owner
    if (contract.ownerWallet.toLowerCase() !== ownerWallet.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền kết thúc hợp đồng này",
      });
    }

    if (contract.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Hợp đồng không ở trạng thái active",
      });
    }

    // ✅ Gửi yêu cầu kết thúc on-chain (frontend thực hiện giao dịch, sau đó backend lưu lại)
    // → Backend chỉ cập nhật trạng thái tạm thời
    contract.status = "pending_end";
    await contract.save();

    return res.json({
      success: true,
      message: "Đã xác nhận yêu cầu kết thúc, chờ xác thực on-chain",
      data: contract,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
