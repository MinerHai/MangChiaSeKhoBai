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

export const getAllRoleRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestRole.find().populate("user", "-password");
    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ! Vui lòng thử lại",
    });
  }
};

export const acceptRoleRequest = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const request = await RequestRole.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu",
      });
    }

    request.status = "approved";
    const user = await User.findById(request.user._id);
    if (user) {
      user.role = "owner";
      await user.save();
    }
    await request.save();

    res.status(200).json({
      success: true,
      message: "Đã chấp nhận yêu cầu",
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

export const rejectRoleRequest = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const request = await RequestRole.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu",
      });
    }
    request.status = "rejected";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Đã từ chối yêu cầu",
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
