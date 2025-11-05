import { Router } from "express";

import { AuthMiddleware } from "../middlewares/auth-middleware";
import { authorizeRoles } from "../middlewares/role-middleware";
import {
  createRentalContract,
  endRentalContract,
  getContractsByWallet,
} from "../controllers/rentalContract-controller";

const router = Router();

// POST /api/contracts
router.post("/", AuthMiddleware, createRentalContract);

// GET /api/contracts/user/:wallet
router.get(
  "/user/:wallet",
  AuthMiddleware,
  authorizeRoles("admin", "owner"),
  getContractsByWallet
);

// PATCH /api/contracts/end/:txHash
router.patch(
  "/end/:txHash",
  AuthMiddleware,
  authorizeRoles("admin", "owner"),
  endRentalContract
);

export default router;
