import express from "express";
import {
  getVendors,
  createVendor,
  login,
} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/", getVendors);
router.post("/", createVendor);
router.post("/", login);

export default router;
