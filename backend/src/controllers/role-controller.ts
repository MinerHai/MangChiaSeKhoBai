import { Request, Response } from "express";
import User from "../models/User";
import { RequestRole } from "../models/RequestRole";
import { uploadMultipleImages } from "../utils/cloudinary-util";

export const requestRoleOwner = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const currentUser = await User.findById(user?.id);
    if (currentUser?.role === "owner") {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã là chủ kho!",
      });
    }

    const existingRequest = await RequestRole.findOne({
      user: user?.id,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã từng gửi yêu cầu, vui lòng chờ!!!",
      });
    }

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
    const images = await uploadMultipleImages(filePaths, "request_roles"); // { public_id, url }[]

    if (images.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Upload hình ảnh thất bại! Vui lòng thử lại", // Upload lên cloud thất bại
      });
    }
    const newRequest = new RequestRole({
      user: user?.id,
      requestedRole: "owner",
      images,
      status: "pending",
    });

    await newRequest.save();

    res.status(200).json({
      success: true,
      message: "Yêu cầu đã được gửi thành công!",
      request: newRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại",
    });
  }
};

/**
 * Lấy tất cả các yêu cầu thay đổi vai trò
 * page, limit: phân trang (nếu cần)
 */
export const getAllRoleRequests = async (req: Request, res: Response) => {
  try {
    const { status, email, page = 1, limit = 10 } = req.query;

    // 🔹 Validate status hợp lệ
    const validStatuses = ["pending", "approved", "rejected"];
    if (
      status &&
      status !== "all" &&
      !validStatuses.includes(status as string)
    ) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ!",
      });
    }

    // 🔹 Chuẩn bị filter
    const filter: any = {};
    if (status && status !== "all") filter.status = status;

    // 🔹 Nếu có email → tìm user tương ứng
    if (email) {
      const users = await User.find({
        email: { $regex: email as string, $options: "i" }, // tìm gần đúng, không phân biệt hoa thường
      }).select("_id");

      if (users.length === 0) {
        return res.status(200).json({
          success: true,
          total: 0,
          page: 1,
          totalPages: 0,
          requests: [],
        });
      }

      filter.user = { $in: users.map((u) => u._id) };
    }

    // 🔹 Phân trang
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // 🔹 Query dữ liệu
    const [requests, total] = await Promise.all([
      RequestRole.find(filter)
        .populate("user", "-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      RequestRole.countDocuments(filter),
    ]);

    // 🔹 Trả kết quả
    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      requests,
    });
  } catch (error) {
    console.error("Error in getAllRoleRequests:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại.",
    });
  }
};

export const getRoleRequestDetail = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const request = await RequestRole.findById(requestId).populate(
      "user",
      "-password"
    );
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu",
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Error in getRoleRequestDetail:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại.",
    });
  }
};

export const ResponseRoleRequest = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const request = await RequestRole.findById(requestId);
    const status = req.body.status;
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu",
      });
    }
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Trạng thái yêu cầu không hợp lệ",
      });
    }
    request.status = status;
    const user = await User.findById(request.user._id);
    if (user && request.status === "approved") {
      user.role = "owner";
      await user.save();
    }
    await request.save();

    res.status(200).json({
      success: true,
      message:
        request.status === "approved"
          ? "Đã chấp nhận yêu cầu"
          : "Đã từ chối yêu cầu",
      request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại",
    });
  }
};
