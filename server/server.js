import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import vendorRoutes from "./routes/vendorRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VendorFind API running 🚀");
});

app.use("/api/vendors", vendorRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/test-env", (req, res) => {
  res.json({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY ? "Loaded ✅" : "Missing ❌",
  });
});
