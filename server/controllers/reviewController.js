// src/controllers/reviewController.js
import { supabase } from "../db/supabaseClient.js";

export const addReview = async (req, res) => {
  const { vendor_id, rating, comment } = req.body;

  if (!vendor_id || !rating) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert([{ vendor_id, rating, comment }]);

  if (error) return res.status(500).json({ error });

  await updateVendorRating(vendor_id);

  res.status(201).json(data);
};

const updateVendorRating = async (vendor_id) => {
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("vendor_id", vendor_id);

  if (!data.length) return;

  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;

  await supabase.from("vendors").update({ rating: avg }).eq("id", vendor_id);
};
