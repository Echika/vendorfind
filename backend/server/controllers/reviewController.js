// src/controllers/reviewController.js
import { supabase } from "../db/supabaseClient.js";

// ------------------- ADD REVIEW -------------------
export const addReview = async (req, res) => {
  const { vendor_id, rating, comment } = req.body;

  if (!vendor_id || !rating) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert([{ vendor_id, rating, comment }])
    .select(); // return inserted data

  if (error) return res.status(500).json({ error: error.message });

  // Update vendor average rating
  await updateVendorRating(vendor_id);

  res.status(201).json(data);
};

// ------------------- GET ALL REVIEWS -------------------
export const getReviews = async (req, res) => {
  try {
    const { vendor_id } = req.query;
    console.log(vendor_id);

    let query = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by vendor_id if provided
    if (vendor_id) {
      query = query.eq("vendor_id", vendor_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------- UPDATE VENDOR RATING -------------------
const updateVendorRating = async (vendor_id) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("vendor_id", vendor_id);

  if (error || !data.length) return;

  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;

  await supabase.from("vendors").update({ rating: avg }).eq("id", vendor_id);
};
