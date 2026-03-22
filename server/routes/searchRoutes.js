// src/routes/searchRoutes.js
import express from "express";
import { searchVendors } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchVendors);

export default router;
