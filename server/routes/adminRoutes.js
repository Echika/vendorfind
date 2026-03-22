import express from "express";
import { getAllVendorsAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.get("/vendors", getAllVendorsAdmin);

export default router;
