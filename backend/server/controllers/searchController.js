// src/controllers/searchController.js
import { supabase } from "../db/supabaseClient.js";

export const searchVendors = async (req, res) => {
  const { keyword, category, location } = req.query;

  let query = supabase.from("vendors").select("*");

  if (keyword) {
    query = query.ilike("business_name", `%${keyword}%`);
  }

  if (category) {
    query = query.eq("category_id", category);
  }

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error });

  res.json(data);
};
