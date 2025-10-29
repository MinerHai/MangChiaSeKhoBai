import { Request, Response } from "express";
import WareHouse from "../models/Warehouse";
import { uploadMultipleImages } from "../utils/cloudinary-util";
import cloudinary from "../config/cloudinary";
import { Console } from "console";

/**
 * POST /api/warehouses/add
 * Body: { warehouseId, name, location, capacity, ownerUserId(opt), ownerWallet, pricePerDayWei, depositWei, registerOnChain(bool) }
 */
export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const {
      warehouseId,
      name,
      capacity,
      ownerWallet,
      pricePerDayWei,
      depositWei,
      txHash,
    } = req.body;
    const location = JSON.parse(req.body.location);
    console.log(req.body);
    const ownerUserId = req.user?.id || null;
    if (!name || !ownerWallet)
      return res.status(400).json({ error: "name, ownerWallet required" });
    // Xử lý upload hình ảnh qua multer middleware
    const files = req.files as Express.Multer.File[];
    console.log(files);
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "Vui lòng upload ít nhất một hình ảnh" });
    }
    const filePaths = files.map((f) => f.path);

    // Upload lên Cloudinary
    const images = await uploadMultipleImages(filePaths, "warehouses"); // { public_id, url }[]
    if (images.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Upload hình ảnh thất bại! Vui lòng thử lại", // Upload lên cloud thất bại
      });
    }
    // Save to DB
    const wh = await WareHouse.create({
      warehouseId,
      name,
      location: location,
      capacity,
      ownerUserId,
      ownerWallet,
      pricePerDayWei: pricePerDayWei || "0",
      depositWei: depositWei || "0",
      onChain: false,
      images,
      description: req.body.description || "",
      txHash: txHash,
    });

    res.status(201).json(wh);
  } catch (err: any) {
    console.error("createWarehouse error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/warehouses
 * Query params: ownerWallet(optional), page, limit
 
 */

export const listWarehouses = async (req: Request, res: Response) => {
  try {
    const {
      ownerWallet,
      page = 1,
      limit = 20,
      registerOnChain,
      ownerUserId,
      keyword, // thêm mới
      province,
      district,
      ward,
      street,
      minCapacity,
      maxCapacity,
      minPriceWei,
      maxPriceWei,
      minDepositWei,
      maxDepositWei,
    } = req.query;

    // console.log("req.query:", req.query);

    // --- Tạo bộ lọc ---
    const filter: any = {};

    if (ownerWallet) filter.ownerWallet = ownerWallet;
    if (registerOnChain !== undefined)
      filter.registerOnChain = registerOnChain === "true";
    if (ownerUserId) filter.ownerUserId = ownerUserId;

    // --- Tìm kiếm theo từ khóa ---
    if (keyword) {
      // Dùng regex để tìm gần đúng theo tên, mô tả hoặc địa chỉ
      const regex = new RegExp(keyword as string, "i"); // i = không phân biệt hoa/thường
      filter.$or = [
        { name: regex },
        { description: regex },
        { "location.province": regex },
        { "location.district": regex },
        { "location.ward": regex },
        { "location.street": regex },
      ];
    }

    // --- Lọc theo vị trí cụ thể ---
    if (province) filter["location.province"] = province;
    if (district) filter["location.district"] = district;
    if (ward) filter["location.ward"] = ward;
    if (street) filter["location.street"] = street;
    // --- Lọc theo dung tích ---
    if (minCapacity || maxCapacity) {
      filter.capacity = {};
      if (minCapacity) filter.capacity.$gte = Number(minCapacity);
      if (maxCapacity) filter.capacity.$lte = Number(maxCapacity);
    }

    // ---  Lọc theo giá thuê ---
    if (minPriceWei || maxPriceWei) {
      filter.pricePerDayWei = {};
      if (minPriceWei) filter.pricePerDayWei.$gte = minPriceWei.toString();
      if (maxPriceWei) filter.pricePerDayWei.$lte = maxPriceWei.toString();
    }

    // ---  Lọc theo tiền cọc ---
    if (minDepositWei || maxDepositWei) {
      filter.depositWei = {};
      if (minDepositWei) filter.depositWei.$gte = minDepositWei.toString();
      if (maxDepositWei) filter.depositWei.$lte = maxDepositWei.toString();
    }
    // ---  Phân trang ---
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    // ---  Truy vấn dữ liệu ---
    const items = await WareHouse.find(filter)
      .populate({
        path: "ownerUserId",
        select: "username email",
      })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await WareHouse.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    // --- Trả kết quả ---
    res.json({
      success: true,
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/warehouses/:id
 * Path params: id (warehouse _id)
 */
export const getWarehouseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const wh = await WareHouse.findById(id).populate({
      path: "ownerUserId",
      select: "username email",
    });
    if (!wh)
      return res.status(404).json({
        success: false,
        message: "Kho hàng không tồn tại",
      });
    res.status(200).json({
      success: true,
      data: wh,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * PUT /api/warehouses/:id
 * Path params: id (warehouse _id)
 * Body: { name, location, capacity, description, ownerUserId(opt), ownerWallet, pricePerDayWei, depositWei }
 */
export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const {
      name,
      location,
      pricePerDayWei,
      depositWei,
      description,
      capacity,
    } = req.body;
    const wh = await WareHouse.findById(id);
    if (!wh)
      return res.status(404).json({
        success: false,
        message: "Kho hàng không tồn tại",
      });

    //
    const user = req.user; // from AuthMiddleware
    if (wh.ownerUserId?.toString() !== user?.id || user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật kho hàng này",
        id: user?.id,
        ownerUserId: wh.ownerUserId,
      });
    }
    // Cập nhật các trường nếu chúng được cung cấp trong body
    // update thông tin
    if (description) wh.description = description;
    if (capacity) wh.capacity = capacity;
    if (name) wh.name = name;

    // update location
    if (location && typeof location === "object") {
      wh.location = {
        ...wh.location,
        ...location,
      };
    }
    //update giá
    if (pricePerDayWei) wh.pricePerDayWei = pricePerDayWei;
    if (depositWei) wh.depositWei = depositWei;

    await wh.save();
    res.status(200).json({
      success: true,
      data: wh,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * DELETE /api/warehouses/:id
 * Path params: id (warehouse _id)
 */
export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const wh = await WareHouse.findById(id);

    if (!wh) {
      return res.status(404).json({
        success: false,
        message: "Kho hàng không tồn tại",
      });
    }

    const user = req.user; // from AuthMiddleware
    if (user?.role !== "admin" && wh.ownerUserId?.toString() !== user?.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa kho hàng này",
      });
    }

    // Xóa ảnh ở Cloudinary nếu có
    if (wh.images && wh.images.length > 0) {
      await Promise.all(
        wh.images.map((image) => cloudinary.uploader.destroy(image.public_id))
      );
    }

    // Xóa kho hàng sau khi đã kiểm tra quyền
    await WareHouse.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Kho hàng đã được xóa",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * Delete one image of warehouse
 * DELETE /api/warehouses/:id/images
 * Body: { public_id }
 * Response: { success, message }
 */
export const deleteWarehouseImage = async (req: Request, res: Response) => {
  try {
    const { id, public_id: rawPublicId } = req.params; // rawPublicId = "xyz
    const fullPublicId = `warehouses/${rawPublicId}`; // → warehouses/xyz
    const wh = await WareHouse.findById(id);
    if (!wh) {
      return res.status(404).json({
        success: false,
        message: "Kho hàng không tồn tại",
      });
    }

    const user = req.user;
    if (user?.role !== "admin" && wh.ownerUserId?.toString() !== user?.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa ảnh kho hàng này",
      });
    }

    console.log("Deleting Cloudinary image:", fullPublicId);
    const result = await cloudinary.uploader.destroy(fullPublicId);
    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(500).json({
        success: false,
        message: "Không thể xóa ảnh trên Cloudinary",
      });
    }
    const result_data = await WareHouse.findByIdAndUpdate(
      id,
      { $pull: { images: { public_id: fullPublicId } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Hình ảnh đã được xóa thành công",
      data: result_data,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * PUT /api/warehouses/:id/images
 * Path params: id (warehouse _id)
 * Body: form-data images[]
 */
export const addWarehouseImages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const wh = await WareHouse.findById(id);
    if (!wh)
      return res.status(404).json({
        success: false,
        message: "Kho hàng không tồn tại",
      });
    // kiểm tra quyền truy cập
    const user = req.user; // from AuthMiddleware
    if (user?.role !== "admin" && wh.ownerUserId?.toString() !== user?.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật kho hàng này",
      });
    }
    // Xử lý upload hình ảnh qua multer middleware
    const files = req.files as Express.Multer.File[];
    // console.log(files);
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "Vui lòng upload ít nhất một hình ảnh" });
    }
    const filePaths = files.map((f) => f.path);

    // Upload lên Cloudinary
    const images = await uploadMultipleImages(filePaths, "warehouses"); // { public_id, url }[]
    if (images.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Upload hình ảnh thất bại! Vui lòng thử lại", // Upload lên cloud thất bại
      });
    }
    // Add to images array
    wh.images.push(...images);
    await wh.save();
    res.status(200).json({
      success: true,
      message: "Hình ảnh đã được thêm",
      data: wh,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
