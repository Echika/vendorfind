import express from "express";
import { getVendors, createVendor } from "../controllers/vendorController.js";

const router = express.Router();

router.get("/", getVendors);
router.post("/", createVendor);

export default router;
